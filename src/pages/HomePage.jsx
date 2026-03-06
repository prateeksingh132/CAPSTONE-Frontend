import HeroCarousel from '../components/HeroCarousel.jsx';

//// referring from sba 320
// logic: building the home page
const HomePage = () => {
    ////////////TESTING
    // console.log('TESTING: homepage component is rendering');
    ////////////

    return (
        <div>
            <HeroCarousel />

            <div className="main_container">
                <h2>Why Choose Us?</h2>

                <div className="products_container">
                    <div className="card">
                        <h3>Fast Shipping</h3>
                        <p>Get your gadgets delivered in record time with our premium logistics network.</p>
                    </div>
                    <div className="card">
                        <h3>24/7 Support</h3>
                        <p>Our tech experts are always online to help you troubleshoot any device.</p>
                    </div>
                    <div className="card">
                        <h3>Best Prices</h3>
                        <p>We price match all major retailers to guarantee you the best deal possible.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;