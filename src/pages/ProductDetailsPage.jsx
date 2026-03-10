import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/apiSlice.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// logic: building a dedicated page for a single item. users can see full descriptions and specs. 
// full crud functionality: if the user is logged in as an admin, a special controls box renders with buttons to delete the product (DELETE) or quickly restock it (PUT).
// https://stackoverflow.com/questions/77808914/how-extract-id-from-react-router-with-useparams
const ProductDetailsPage = () => {
    // logic: grabbing the id straight from the url bar using the useparams hook.
    const { id } = useParams();
    const navigate = useNavigate();

    // logic: passing that exact id into my rtk query to fetch the specific product from my db.
    // i am also extracting the refetch function so i can update the ui cleanly without a hard reload.
    const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(id);
    const { dispatch } = useCart();
    const { showToast } = useToast();

    // logic: pulling the user profile from localstorage so i can conditionally render my admin crud buttons.
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    // logic: showing dynamic tab title based on what product is clicked. if it is still fetching, it will just says loading...
    useDocumentTitle(product ? product.name : 'Loading...');

    ////////////TESTING
    // console.log('TESTING: loading product details for url id:', id);
    ////////////

    // logic: checking laoding state and error if any. i m doing returns here so the app doesnt crash while the network request is still pending.
    if (isLoading) return <h2 className="loading-text">Loading product details...</h2>;
    if (error) return <h2 className="loading-text">Error fetching product. Check server connection.</h2>;
    if (!product) return <h2 className="loading-text">Product not found.</h2>;

    const addToCartHandler = () => {
        // dispatching to the global cart state again.
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
        showToast('Item added to cart!', 'success');
    };

    // logic: adding a manual fetch function to test the DELETE route.
    const handleDeleteProduct = async () => {
        if (window.confirm('are you sure you wanna delete this product completely?')) {
            try {
                const res = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    // the idea is that i must include credentials here so my httponly jwt cookie passes through the vite proxy to verify my admin role.
                    credentials: 'include'
                });

                if (res.ok) {
                    showToast('Product deleted successfully', 'success');
                    navigate('/shop');
                } else {
                    showToast('Failed to delete product', 'error');
                }
            } catch (err) {
                showToast('Network error while deleting.', 'error');
            }
        }
    };

    // logic: adding a manual fetch function to test the PUT route. this quick restock enables my frontend to send a update request.
    const handleQuickRestock = async () => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: 100 }),
                credentials: 'include'
            });

            if (res.ok) {
                showToast('Product quickly restocked to 100!', 'success');
                // logic: calling rtk query's refetch instead of window.location.reload() so it updates cleanly without wiping the spa state.
                refetch();
            } else {
                showToast('Failed to restock product', 'error');
            }
        } catch (err) {
            showToast('Network error while restocking.', 'error');
        }
    };

    return (
        <div className="main_container">
            <Link to="/shop" className="btn">&larr; Back to Shop</Link>

            <div className="product-details">
                <div className="product-image-box">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info-box">
                    <h1>{product.name}</h1>
                    <h2 className="price">${product.price}</h2>
                    <p>{product.description}</p>

                    {/* here i am gonna check if there are specs and if yes, then i will map over the object keys to display them dynamically */}
                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="specs-box">
                            <h3>Specifications:</h3>
                            <ul>
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <li key={key}><strong>{key}:</strong> {value}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="formBox">
                        <p className={product.stock > 0 ? "in-stock-text" : "out-of-stock-text"}>
                            Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                        <button
                            className="btn"
                            onClick={addToCartHandler}
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                        </button>
                    </div>

                    {/* logic: mapping over the populated reviews array to display them */}
                    <div className="formBox">
                        <h3>Customer Reviews</h3>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map(review => (
                                <div key={review._id} className="card">
                                    <h4 className="price">{review.user?.username || 'Verified Customer'}</h4>
                                    <p className="in-stock-text">Rating: {review.rating}/5</p>
                                    <p>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="loading-text">No reviews yet for this product.</p>
                        )}
                    </div>

                    {/* i m rendering the admin crud controls here. delete (Delete Product) and update (Quick Restock (100)) */}
                    {userInfo && userInfo.role === 'admin' && (
                        <div className="formBox">
                            <h3 className="out-of-stock-text">Admin Controls</h3>
                            <div className="cart-item-actions">
                                <button className="btn btn-secondary" onClick={handleQuickRestock}>
                                    Quick Restock (100)
                                </button>
                                <button className="btn btn-danger" onClick={handleDeleteProduct}>
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;