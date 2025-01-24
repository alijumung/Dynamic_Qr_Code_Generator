import React, { useState } from 'react';
import axios from 'axios';
import apiClient from "../apiClient.js";


function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(''); // State to handle error messages
    const [loading, setLoading] = useState(false); // State to manage loading status

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

    apiClient.post('/register', values)
            .then((res) => {
                console.log(res);
                setLoading(false);
                // Handle successful registration (e.g., redirect to login or home page)
            })
            .catch((err) => {
                console.error(err);
                setError('Registration failed! Please try again.'); // Set error message
                setLoading(false);
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-textColor mb-6">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-textColor">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={values.name}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                            className="w-full p-4 border border-secondary rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-textColor">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className="w-full p-4 border border-secondary rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-textColor">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className="w-full p-4 border border-secondary rounded-md"
                        />
                    </div>

                    {/* Display error message if exists */}
                    {error && <h2 className="text-red-500 text-center">{error}</h2>}

                    <button
                        type="submit"
                        className="w-full font-bold bg-transparent border-secondary border-2 text-textColor p-4 rounded-md hover:bg-secondary transition duration-200"
                        disabled={loading} // Disable button during loading
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
