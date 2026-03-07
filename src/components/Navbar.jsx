import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

//// from sba 320
// logic: i am building the main navigation bar here
const Navbar = () => {
    // logic: grabbing the state object from the context
    const { state } = useCart();
    const { cartItems } = state;

    // calculating how many total items are in the cart so i can show a little notification badge next to the link.
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    ////////////TESTING
    // console.log('TESTING: navbar rendered. current cart count is: ', cartCount);
    ////////////

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
                        {/* logic: conditional rendering. the badge only shows up if there is actually items in the cart */}
                        {cartCount > 0 && (
                            <span className="price"> ({cartCount})</span>
                        )}
                    </Link>
                </li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;