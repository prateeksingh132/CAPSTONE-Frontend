import { Link } from 'react-router-dom';

// logic: building the footer component
const Footer = () => {
    ////////////TESTING
    // console.log('TESTING: footer rendered');
    ////////////

    return (
        <footer className="footer_container">
            <div className="footer_brand">
                <h3>GadgetShack</h3>
                <p>&copy; 2026 GadgetShack Inc. All rights reserved.</p>
            </div>

            <div className="footer_links">
                {/* i m gonna add some quick footer links that just route back to home for now */}
                {/* FUTUREWORK: maybe create separate pages for these three links? or a floating info card? */}
                <Link to="/" className="footer_link">Privacy Policy</Link>
                <Link to="/" className="footer_link">Terms of Service</Link>
                <Link to="/" className="footer_link">Contact Support</Link>
            </div>
        </footer>
    );
};

export default Footer;