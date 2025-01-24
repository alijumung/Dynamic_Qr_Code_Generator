import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomInput from "./customInput.jsx";
import {AnimatePresence, motion} from "framer-motion";
import apiClient from "../apiClient.js";

function Settings() {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [profilePicPreview, setProfilePicPreview] = useState('');
    const [messages, setMessages] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        apiClient
            .get('/user', { withCredentials: true })
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setProfilePic(`${import.meta.env.VITE_API_BASE_URL}${res.data.profile_pic}`);
                } else {
                    setAuth(false);
                    navigate('/login');
                }
            })
            .catch(err => {
                console.error("Error fetching user info:", err);
                navigate('/login');
            });
    }, [navigate]);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        console.log("Save button clicked"); // Debug log

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);

        if (document.getElementById("file-input").files[0]) {
            formData.append('profilePic', document.getElementById("file-input").files[0]);
        }

        if (password.trim() !== '') {
            formData.append('password', password);
        }

        try {
            console.log("Sending data:", formData); // Debug log
            const res = await apiClient.post('/user/update-profile', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Response received:", res.data); // Debug log
            if (res.data.Status === "Success") {
                setStatus('success');
                setMessages("Profile updated successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setStatus('error');
                setMessages(res.data.Message || "An error occurred while updating the profile.");
            }
        } catch (err) {
            console.error("Error updating profile:", err); // Debug log
            setStatus('error');
            setMessages("An error occurred while updating the profile.");
        }
    };


    return (
        <AnimatePresence>
        <motion.div className="pt-16 px-6 flex items-center justify-center pb-12" initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{delay: 0.1, duration: 0.5}}>
            <div className="flex flex-col md:flex-row items-center justify-between mt-10 w-full max-w-3xl bg-backGround pb-10 px-8 pt-10 rounded-lg shadow-lg">

                {/* Form Section */}
                <form onSubmit={handleSave} className="space-y-8 w-full md:w-2/3">
                    <h1 className="text-4xl font-bold text-textColor mb-8">Edit Profile</h1>

                    <CustomInput
                        name="name"
                        type="text"
                        placeholder="Update your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <CustomInput
                        name="email"
                        type="email"
                        placeholder="Update your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <CustomInput
                        name="password"
                        type="password"
                        placeholder="Update your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-1/2 font-bold bg-transparent border-secondary border-2 text-xl text-textColor py-3 rounded-md hover:bg-secondary transition duration-200"
                    >
                        Save
                    </button>

                    {/* Status Message */}
                    {messages && (
                        <p
                            className={`mt-4 text-lg font-medium ${
                                status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {messages}
                        </p>
                    )}
                </form>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center justify-center mt-10 md:mt-0 md:ml-10">
                    <img
                        src={profilePicPreview || profilePic}
                        alt="Profile Preview"
                        className="w-52 h-52 rounded-full mb-6 shadow-md"
                    />

                    <input
                        type="file"
                        name="profilePic"
                        onChange={handleProfilePicChange}
                        id="file-input"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('file-input').click()}
                        className="w-full md:w-auto font-bold bg-primary border-primary border-2 text-textColor py-2 px-4 rounded-md hover:bg-transparent transition duration-200 text-center"
                    >
                        Upload Profile Picture
                    </button>
                </div>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}

export default Settings;
