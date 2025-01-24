import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CustomInput from "./customInput.jsx";
import apiClient from "../apiClient.js";

function QrEdit({ QrId, onCancel }) {
    const [formData, setFormData] = useState({
        qr_name: "",
        qr_link: "",
        qr_not: "",
        qr_author: "",
        qr_video: null, // No initial video as it should be a file upload
    });
    const [message, setMessage] = useState("");

    // Fetch the QR code data when the component mounts or QrId changes
    useEffect(() => {
        const fetchQRData = async () => {
            try {
                const response = await apiClient.get(`/qr/get-all/${QrId}`);
                if (response.data && response.data.length > 0) {
                    setFormData({
                        qr_name: response.data[0].qr_name || "",
                        qr_link: response.data[0].qr_link || "",
                        qr_not: response.data[0].qr_not || "",
                        qr_author: response.data[0].qr_author || "",
                        qr_video: null,
                    });
                }
            } catch (error) {
                console.error("Error fetching QR data:", error);
                setMessage("Failed to fetch QR code details.");
            }
        };

        if (QrId) fetchQRData();
    }, [QrId]);

    // Handle changes to input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection for qr_video
    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, qr_video: e.target.files[0] }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("qr_name", formData.qr_name);
        formDataToSubmit.append("qr_link", formData.qr_link);
        formDataToSubmit.append("qr_not", formData.qr_not);
        formDataToSubmit.append("qr_author", formData.qr_author);
        if (formData.qr_video) {
            formDataToSubmit.append("qr_video", formData.qr_video);
        }

        try {
            const response = await apiClient.post(
                `/qr/edit/${QrId}`, // Ensure QrId is defined
                formDataToSubmit,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure proper headers
                    },
                }
            );

            setMessage(response.data.message || "QR code updated successfully.");
            if (response.data.Status === "Success") {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Error Response:", error.response?.data);
            setMessage(
                error.response?.data?.error || "An error occurred while updating the QR code."
            );
        }
    };

    return (
        <div className="pt-16 px-6 flex items-center justify-center pb-12 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between mt-10 w-full max-w-3xl bg-backGround pb-10 px-8 pt-10 rounded-lg shadow-lg relative">
                <AnimatePresence>
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-8 w-full"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 1}}
                    >
                        <motion.h1
                            className="text-4xl font-bold text-textColor mb-8"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.2, duration: 0.5}}
                        >
                            Edit QR Code
                        </motion.h1>

                        {/* QR Name Input */}
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.4, duration: 0.5}}
                        >
                            <CustomInput
                                name="qr_name"
                                type="text"
                                placeholder="QR Name"
                                value={formData.qr_name}
                                onChange={handleInputChange}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.4, duration: 0.5}}
                        >
                            <CustomInput
                                name="qr_author"
                                type="text"
                                placeholder="QR Author"
                                value={formData.qr_author}
                                onChange={handleInputChange}
                                required
                            />
                        </motion.div>

                        {/* QR Link Input */}
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.6, duration: 0.5}}
                        >
                            <CustomInput
                                name="qr_link"
                                type="url"
                                placeholder="QR Link"
                                value={formData.qr_link}
                                onChange={handleInputChange}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.2, duration: 0.5}}
                        >

                            <textarea
                                className="w-full text-textColor p-3 border-2 border-textColor bg-transparent rounded-lg transition-all focus:outline-none focus:bg-backGround"
                                name="qr_not"
                                type="textarea"
                                placeholder="QR Note"
                                value={formData.qr_not}
                                onChange={handleInputChange}
                                required
                            />
                        </motion.div>

                        {/* Custom File Input */}
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.8, duration: 0.5}}
                        >
                            <input
                                id="qr_video"
                                name="qr_video"
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="block border-2 w-full px-4 py-2 border-textColor text-textColor rounded-md"
                            />
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex space-x-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 1, duration: 0.5}}
                        >
                            <button
                                type="submit"
                                className="w-1/2 font-bold bg-transparent border-secondary border-2 text-xl text-textColor py-3 rounded-md hover:bg-secondary transition duration-200"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="w-1/2 font-bold bg-transparent border-2 border-primary text-xl text-textColor py-3 rounded-md hover:bg-primary transition duration-200"
                            >
                                Cancel
                            </button>
                        </motion.div>

                        {/* Optional Message */}
                        {message && (
                            <motion.p
                                className="text-sm text-gray-700 mt-2"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{delay: 1.2, duration: 0.5}}
                            >
                                {message}
                            </motion.p>
                        )}
                    </motion.form>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default QrEdit;
