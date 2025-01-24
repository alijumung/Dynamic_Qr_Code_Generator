import React, { useState } from "react";
import axios from "axios";
import CustomInput from "./customInput.jsx";
import CustomSelect from "./customSelect.jsx";
import {AnimatePresence, motion} from "framer-motion";
import apiClient from "../apiClient.js";



function AddUser() {
    const options = ["Admin", "User", "Guest"];
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: options[2], // Default role
    });
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (option) => {
        setFormData((prev) => ({ ...prev, role: option }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("/admin/add-user", formData);

            setMessage(response.data.message);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: options[0],
            });
            if (response.data.Status === "Success") {
                setTimeout(() => {
                    window.location.reload(); // Refresh the page after 1 second
                }, 1000);
            }

        } catch (error) {
            setMessage(
                error.response?.data?.message || "An error occurred while creating the user."
            );
        }
    };

    return (
        <AnimatePresence>
        <motion.div className="pt-16 px-4 flex items-center justify-center" initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{delay: 0.1, duration: 0.5}}>
            <div className="flex items-center justify-between mt-10 text-center w-full max-w-2xl bg-backGround pb-7 px-5 pt-7 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-8 w-full">
                    <motion.h1 className="text-3xl text-textColor font-bold" initial={{opacity: 0, y: -20}}
                               animate={{opacity: 1, y: 0}}
                               exit={{opacity: 0, y: 20}}
                               transition={{delay: 0.2, duration: 0.5}}>Create a New User</motion.h1>

                    {/* Name Input */}
                    <motion.div initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{delay: 0.3, duration: 0.5}}>
                    <CustomInput
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your Name"
                    />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{delay: 0.4, duration: 0.5}}>
                    <CustomInput
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your Email"
                    />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{delay: 0.5, duration: 0.5}}>
                    <CustomInput
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your Password"
                    />
                    </motion.div>

                    {/* Role Select */}
                    <motion.div initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{delay: 0.6, duration: 0.5}}>
                    <CustomSelect options={options} onSelect={handleSelect} />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 20}}
                                transition={{delay: 0.7, duration: 0.5}}>
                    <button
                        type="submit"
                        className="w-1/3 font-bold bg-transparent border-secondary border-2 text-textColor p-2 rounded-md hover:bg-secondary transition duration-200"
                    >
                        Create a New User
                    </button>
                    </motion.div>

                    {/* Feedback Message */}
                    {message && (
                        <p className="mt-4 text-sm text-gray-700">{message}</p>
                    )}
                </form>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}

export default AddUser;
