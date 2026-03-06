import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

// logic: building the individual product card here so i can map over it in the shop page.
// idea is that when a user clicks add to cart, it should send a dispatch payload directly to my context reducer
const ProductCard = ({ product }) => {
    // logic: bringing in my dispatch function from the global cart context.
    const { dispatch } = useCart();

    const addToCartHandler = (e) => {
        // logic: stopping the link click from firing when i just wanna click the button.
        e.preventDefault();

        // logic: sending the action to my cartcontext reducer. i am defaulting the quantity to 1 for now.
        dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });

        ////////////TESTING
        // console.log('TESTING: added to cart: ', product.name);
        ////////////
    };

    return (
        <div className="card">
            <Link to={`/product/${product._id}`}>
                {/* checking if image exists just in case my database seeder messed up later. */}
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
            </Link>

            <button
                className="btn"
                onClick={addToCartHandler}
                // disabling the button completely if stock hits zero.
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default ProductCard;