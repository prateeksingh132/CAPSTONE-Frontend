import { Component } from 'react';
import { Link } from 'react-router-dom';

// building error boundary to wrap the routes
// the idea is that if a component randomly crashes, this boundary catches it so the whole screen doesnt just crash and freeze.
// https://github.com/alan2207/bulletproof-react
// https://www.youtube.com/watch?v=_FuDMEgIy7I
// https://www.youtube.com/watch?v=DNYXgtZBRPE

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // logic: updating state so the next render shows the fallback ui instead of a blank screen.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        ////////////TESTING
        console.error('TESTING: error boundary caught a crash:', error, errorInfo);
        ////////////
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fallback_container">
                    <h1 className="out-of-stock-text">Something went wrong.</h1>
                    <p>the application crashed. please click below to refresh.</p>
                    {/* logic: resetting the error state if the user clicks reload */}
                    <Link
                        to="/"
                        className="btn btn-secondary"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Reload App
                    </Link>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;