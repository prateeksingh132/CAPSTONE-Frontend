import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// logic: building the login page, users can get authenticated and get their httponly cookie.
// https://github.com/bradtraversy/proshop-v2
// https://github.com/betheashvin/mern-secure-auth

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {

        e.preventDefault();

        try {
            // logic: sending the credentials to my backend proxy.
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();

                ////////////TESTING
                // console.log('TESTING: user logged in successfully:', data);
                ////////////

                // logic: redirecting the user to the shop page after successful login.
                navigate('/shop');
            } else {
                const errData = await res.json();
                setErrorMsg(errData.message || 'invalid credentials');
            }
        } catch (err) {
            setErrorMsg('network error. check server connection.');
        }
    };

    return (
        <div className="main_container">
            <div className="formBox">
                <h1>Sign In</h1>

                {/* logic: conditionally showing errors using my out-of-stock-text class for red styling. */}
                {errorMsg && <p className="out-of-stock-text">{errorMsg}</p>}

                <form onSubmit={submitHandler}>
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
                    <button type="submit" className="btn">Sign In</button>
                </form>

                <p>
                    New Customer? <Link to="/register">Register Here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;