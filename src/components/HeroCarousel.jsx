import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gamingLaptop from '../images/gamingLaptop.jpg';
import headset from '../images/headset.jpg';
import proLaptop from '../images/proLaptop.jpg';
import smartphones from '../images/smartphones.jpg';
import speaker from '../images/speaker.jpg';
import smartwatch from '../images/smartwatch.jpg';
import tablet from '../images/tablet.jpg';

//// referred from sba 320
// logic: i am gonna build an automatic image carousel that changes images smoothly
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// https://stackoverflow.com/questions/53981593/react-hooks-and-setinterval

const HeroCarousel = () => {
    ////////////TESTING
    // console.log('TESTING: hero carousel rendered');
    ////////////

    // array of images for the carousel background
    const images = [
        gamingLaptop,
        headset,
        proLaptop,
        smartphones,
        speaker,
        smartwatch,
        tablet
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // logic: using useeffect with a setinterval timer to change the picture every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                // logic: if we hit the end of the array, loop back to 0, otherwise go to the next image
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        // cleanup function to prevent memory leaks if the user leaves the home page
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="carousel_container">
            <img
                src={images[currentIndex]}
                alt="gadgetshack promotional tech"
                className="carousel_image fade_animation"
                key={currentIndex} // logic: adding the key here forces react to rerender the img tag, triggering the fade animation again
            />
            <div className="carousel_overlay">
                <h1>Welcome to GadgetShack</h1>
                <p>Premium tech, unbeatable prices. Upgrade your life today.</p>
                <Link to="/shop" className="btn">
                    Shop Now
                </Link>
            </div>
        </div>
    );
};

export default HeroCarousel;