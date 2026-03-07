import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/apiSlice.js';
import { useCart } from '../context/CartContext.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// logic: building a dedicated page for a single item. users can see full descriptions and specs.
// https://stackoverflow.com/questions/77808914/how-extract-id-from-react-router-with-useparams
const ProductDetailsPage = () => {
    // logic: grabbing the id straight from the url bar using the useparams hook.
    const { id } = useParams();

    // logic: passing that exact id into my rtk query to fetch the specific product from my db.
    const { data: product, isLoading, error } = useGetProductByIdQuery(id);
    const { dispatch } = useCart();

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
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;