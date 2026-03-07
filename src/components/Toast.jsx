import { useToast } from '../context/ToastContext.jsx';

// logic: building the actual ui component for the toast that will float at the top of the screen.
const Toast = () => {
    const { toast } = useToast();

    // logic: if there is no message in the global state, returning null so it stays invisible.
    if (!toast.message) return null;

    ////////////TESTING
    // console.log(`TESTING: Toast fired: ${toast.message} (${toast.type})`);
    ////////////

    return (
        // logic: dynamically injecting the type class (success or error) to change the background color.
        <div className={`toast_container toast_${toast.type}`}>
            <p className="toast_message">{toast.message}</p>
        </div>
    );
};

export default Toast;