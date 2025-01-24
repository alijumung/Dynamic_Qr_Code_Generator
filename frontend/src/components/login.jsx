import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomInput from "./customInput.jsx";
import {AnimatePresence, motion} from "framer-motion";
import apiClient from "../apiClient.js";


function Login() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!values.email || !values.password) {
            setError("Both fields are required.");
            return;
        }

        setLoading(true);
        setError(null);

        apiClient.post('/auth/login', values, {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res.data);
                if (res.data.status === 'success') {
                    navigate('/qr-generation');
                    console.log("going to qr");
                } else {
                    setError('Invalid credentials. Please try again.');
                }
            })
            .catch((err) => {
                console.error(err);
                setError('Something went wrong. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <AnimatePresence>
        <motion.div className="pt-16 px-4 flex items-center justify-center"  initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{delay: 0.1, duration: 0.5}}>
            <div
                className="flex items-center justify-between mt-10 w-full max-w-lg bg-backGround pb-7 px-5 pt-7 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-8 w-full">
                    <CustomInput
                        name="email"
                        label="E-mail Address"
                        type="email"
                        value={values.email}
                        onChange={(e) => setValues({...values, email: e.target.value})}
                        placeholder="Enter your email"
                    />

                    <CustomInput
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={(e) => setValues({...values, password: e.target.value})}
                        placeholder="Enter your password"
                    />
                    <button
                        type="submit"
                        className="w-1/3 font-bold bg-transparent border-secondary border-2 text-xl text-textColor p-2 rounded-md hover:bg-secondary transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Log In'}
                    </button>

                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </div>

        </motion.div>
        </AnimatePresence>

    );
}

export default Login;
