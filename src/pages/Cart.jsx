import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

////from sba 320
// logic: building out the cart page
// BUG: button doesnt disable when product's quantity reaches stock value. user can click the + button to increase quantity infinitely --  FIXED

const Cart = () => {
    const { state, dispatch } = useCart();
    const { cartItems } = state;

    // logic: using navigate to send the user to checkout later without a page reload.
    const navigate = useNavigate();

    // logic: calculating the total items and total price using array reduce.
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

    ////////////TESTING
    // console.log('TESTING: cart page rendered. total items:', totalItems, 'total price:', totalPrice);
    ////////////

    const removeFromCartHandler = (id) => {
        // logic: dispatching the remove action to delete the item from global state.
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const updateQuantityHandler = (item, newQuantity) => {
        // logic: preventing users from setting quantity below 1 or above available stock.
        if (newQuantity > 0 && newQuantity <= item.stock) {
            dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity: newQuantity } });
        }
    };

    const checkoutHandler = () => {
        // logic: sending the user to the checkout route when they click the button.
        navigate('/checkout');
    };

    // logic: return if the cart is completely empty.
    if (cartItems.length === 0) {
        return (
            <div className="main_container">
                <h2>Your Cart is Empty</h2>
                <Link to="/shop" className="btn">Go Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="main_container empty-state">
            <h1>Shopping Cart</h1>
            <div className="cart-layout">
                <div className="cart-items-section">
                    {/* mapping over the global cart state array and rendering each item row. */}
                    {cartItems.map((item) => (
                        <div key={item._id} className="cart-item-card">
                            <div className="cart-item-image">
                                <img src={item.image} alt={item.name} className="cart-img" />
                            </div>

                            <div className="cart-item-details">
                                <Link to={`/product/${item._id}`}>
                                    <h3>{item.name}</h3>
                                </Link>
                                <p className="price">${item.price}</p>
                            </div>

                            <div className="cart-item-actions">
                                <button
                                    className="btn btn-small btn-secondary"
                                    onClick={() => updateQuantityHandler(item, item.quantity - 1)}
                                    disabled={item.quantity === 1}
                                >
                                    -
                                </button>
                                <span className="quantity-text">{item.quantity}</span>
                                <button
                                    className="btn btn-small btn-secondary"
                                    onClick={() => updateQuantityHandler(item, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>

                            <div className="cart-item-remove">
                                <button
                                    className="btn remove-btn btn-small btn-danger"
                                    onClick={() => removeFromCartHandler(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary-box">
                    <h2>Order Summary</h2>
                    <p>Total Items: {totalItems}</p>
                    <h3 className="price">Subtotal: ${totalPrice}</h3>
                    <button className="btn checkout-btn" onClick={checkoutHandler}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;