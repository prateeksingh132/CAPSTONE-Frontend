import { Navigate, Outlet } from 'react-router-dom';

// logic: making a wrapper component to protect routes that require a user to be logged in (like checkout).
export const PrivateRoute = () => {
    // logic: checking localstorage for the user profile. 
    // the actual jwt token is securely handled by the browser's httponly cookie, so we just store the non-sensitive profile here.
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    ////////////TESTING
    // console.log('TESTING: private route guard checked user:', userInfo?.username);
    ////////////

    // logic: if they are logged in, i wanna render the child component (outlet). if not, bounce them to the login page.
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

// logic: making a strict wrapper specifically for admin-only routes (like the recharts dashboard).
export const AdminRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    ////////////TESTING
    // console.log('TESTING: admin route guard checked role:', userInfo?.role);
    ////////////

    return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};