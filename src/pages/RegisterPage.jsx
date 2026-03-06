import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// logic: creating the registration form for new users
const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        // logic: validating passwords match on the frontend first.
        if (password !== confirmPassword) {
            setMessage('passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (res.ok) {
                ////////////TESTING
                // console.log('TESTING: new user registered successfully');
                ////////////

                // logic: sending them to the login page so they can login and get their cookie.
                navigate('/login');
            } else {
                const errData = await res.json();
                setMessage(errData.message || 'registration failed');
            }
        } catch (err) {
            setMessage('network error. check server connection.');
        }
    };

    return (
        <div className="main_container">
            <div className="formBox">
                <h1>Register</h1>

                {message && <p className="out-of-stock-text">{message}</p>}

                <form onSubmit={submitHandler}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Register</button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;