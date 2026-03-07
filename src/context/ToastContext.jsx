import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

// logic: i am creating a global context provider so any component in my app can create a popup message without prop drilling.
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '' });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });

        // logic: automatically hide the toast after 3 seconds so the user doesnt have to manually close it.
        setTimeout(() => {
            setToast({ message: '', type: '' });
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ toast, showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

// logic: building a custom hook so my other components can just call useToast().
export const useToast = () => useContext(ToastContext);