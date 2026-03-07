import { Link } from 'react-router-dom';

// logic: creating a simple 404 page so if the user types a wrong url they dont just get a blank screen
const NotFound = () => {
    ////////////TESTING
    // console.log('TESTING: 404 page rendered due to wrong url');
    ////////////
    
    return (
        <div className="fallback_container">
            <h1 className="error_heading">404 - Page Not Found</h1>
            <p className="loading-text">Sorry! cant find the page, check again..</p>
            <br />
            <Link to="/shop" className="btn">Back to Shop</Link>
        </div>
    );
};

export default NotFound;