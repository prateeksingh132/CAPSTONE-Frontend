// goal: building a reusable ui component for pending network requests.
// the idea is that instead of manually typing loading text everywhere, i just drop this component in for a clean ui.
const Loader = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;