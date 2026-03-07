import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

//// from sba 320
// logic: i am building the main navigation bar here

// BUG: logout is successful, but not able to redirect to login

const Navbar = () => {
    // logic: grabbing the state object from the context
    const { state } = useCart();
    const { cartItems } = state;
    const { showToast } = useToast();
    const navigate = useNavigate();


    // logic: pulling the user profile to change the navbar links
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // calculating how many total items are in the cart so i can show a little notification badge next to the link.
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    ////////////TESTING
    // console.log('TESTING: navbar rendered. current cart count is: ', cartCount);
    ////////////

    const logoutHandler = async (e) => {
        e.preventDefault();
        try {
            // logic: sending a fetch request to my backend to clear the httponly jwt cookie safely
            await fetch('/api/auth/logout', { method: 'POST' });

            // logic: wiping the frontend profile from localstorage
            localStorage.removeItem('userInfo');

            showToast('Logged out successfully', 'success');
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="navBar">
            <div className="logoBox">
                <Link to="/">GadgetShack</Link>
            </div>
            <ul className="navLinksList">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/advisor">Advisor</Link></li>
                <li>
                    <Link to="/cart">
                        Cart
                        {cartCount > 0 && (
                            <span className="price"> ({cartCount})</span>
                        )}
                    </Link>
                </li>
                {/* logic: rendering links based on authentication status and role */}
                {userInfo ? (
                    <>
                        {/* logic: only rendering the dashboard link if they have admin privileges */}
                        {userInfo.role === 'admin' && <li><Link to="/admin">Dashboard</Link></li>}
                        <li><Link to="#" onClick={logoutHandler}>Logout</Link></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;