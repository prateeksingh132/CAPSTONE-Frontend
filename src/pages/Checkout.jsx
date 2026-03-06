import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

///// referring from sba 320
// logic: building the checkout page
// https://github.com/bradtraversy/proshop-v2
// https://github.com/betheashvin/mern-secure-auth

const Checkout = () => {
    const { state, dispatch } = useCart();
    const { cartItems } = state;
    const navigate = useNavigate();

    // logic: setting up a local state to show success or error messages to the user.
    const [message, setMessage] = useState('');

    // calculating total price and items to show on page
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

    const placeOrderHandler = async () => {
        try {
            // logic: mapping the cart items to match my backend order schema. 
            // i only need to send the product id and quantity bcuz my backend document snapshot pattern handles the price calculation securely.
            const orderPayload = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                }))
            };

            // logic: using fetch to hit my backend proxy. my httponly jwt cookie will attach automatically to verify i am logged in.
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok) {
                const data = await response.json();

                ////////////TESTING
                // console.log('TESTING: order placed successfully:', data);
                ////////////

                // if it works, i ll have to remove the global cart state and show a success message.
                dispatch({ type: 'CLEAR_CART' });
                setMessage('Order placed successfully! Redirecting...');

                // logic: now i m gonna put them back to the home page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to place order....Please make sure you are logged in');
            }

        } catch (error) {
            setMessage('Network error occurred while placing order.');
        }
    };

    // logic: return if the cart is empty so user cant submit a blank order.
    if (cartItems.length === 0 && !message) {
        return (
            <div className="main_container">
                <h2>You have no items to checkout.</h2>
                <button className="btn" onClick={() => navigate('/shop')}>Back to Shop</button>
            </div>
        );
    }

    return (
        <div className="main_container empty-state">
            <h1>Checkout</h1>
            <div className="formBox">
                <h2>Order Summary</h2>
                <p>Total Items: {totalItems}</p>
                <p className="price">Total Price: ${totalPrice}</p>

                {/* i m conditionally rendering the message using my text classes for red/green colors. will add styling later in app.css. */}
                {message && (
                    <p className={message.includes('successfully') ? "in-stock-text" : "out-of-stock-text"}>
                        {message}
                    </p>
                )}

                <button
                    className="btn"
                    onClick={placeOrderHandler}
                    disabled={cartItems.length === 0}
                >
                    Confirm & Place Order
                </button>
            </div>
        </div>
    );
};

export default Checkout;