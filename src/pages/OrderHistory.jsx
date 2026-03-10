import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// logic: building a order history page .
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useDocumentTitle('My Order History');

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                // logic: executing a manual fetch to my secure route.
                // using credentials: 'include' so my httponly jwt cookie safely passes the vite proxy.
                const res = await fetch('/api/orders/mine', {
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    setError('failed to fetch your order history. please log in again.');
                }
            } catch (err) {
                setError('network error. could not connect to server.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    if (loading) return <h2 className="loading-text">Loading order history...</h2>;
    if (error) return <h2 className="out-of-stock-text">{error}</h2>;

    return (
        <div className="main_container">
            <h1>My Order History</h1>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <h2>You haven't placed any orders yet!</h2>
                    <Link to="/shop" className="btn">Start Shopping</Link>
                </div>
            ) : (
                <div className="products_container">
                    {/* logic: mapping over the historical orders. */}
                    {orders.map((order) => (
                        <div key={order._id} className="formBox">
                            <h3>Order ID: {order._id}</h3>
                            <p className="in-stock-text">
                                Date: {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <div className="specs-box">
                                <h4>Items Purchased:</h4>
                                <ul>
                                    {order.orderItems.map((item) => (
                                        <li key={item._id}>
                                            <strong>{item.quantity}x {item.name}</strong> - Snapshot Price: <span className="price">${item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <h2 className="price">Total Paid: ${order.totalPrice}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;