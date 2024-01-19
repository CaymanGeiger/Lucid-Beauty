"use client"
import React, { useState } from 'react';



const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginResponse, setLoginResponse] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setLoginResponse(`Login successful: ${JSON.stringify(data)}`);
            } else {
                setLoginResponse(`Login failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            setLoginResponse(`Login error: ${error}`);
        }
    };


    const logout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setLoginResponse(`Logout successful`);
            } else {
                setLoginResponse(`Logout failed`);
            }
        } catch (error) {
            setLoginResponse(`Logout error: ${error}`);
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                {loginResponse && <p>{loginResponse}</p>}
            </div>
            <button onClick={() => logout()}>
                Logout
            </button>
        </div>
    );
};

export default Login;
