import React, { useState, useEffect } from "react";
import CustomInput from "./customInput.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";;
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import apiClient from "../apiClient.js";

function QrAdd() {
    const [qrName, setQrName] = useState("");
    const [qrLink, setQrLink] = useState("");
    const [qr_not,setQrNot] = useState("");
    const [qrVideo, setQrVideo] = useState(null);
    const [qrPreview, setQrPreview] = useState(""); // QR preview URL
    const [userId, setUserId] = useState(null);
    const [qr_author, setQrAuthor] = useState("");
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null); // For video preview
    const [qrPngPath, setQrPngPath] = useState(""); // Store PNG path
    const [qrSvgPath, setQrSvgPath] = useState(""); // Store JPG path
    const [qrPagePath, setQrPagePath] = useState(""); // Store the URL of the generated HTML page
    const [isGenerating, setIsGenerating] = useState(false); // State to track if QR code is being generated
    const [progress, setProgress] = useState(0); // Progress bar state
    const [isConfettiVisible, setIsConfettiVisible] = useState(false); // State to trigger confetti
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        // Disable scrolling during confetti animation


        // Fetch user data
        apiClient
            .get("/user", { withCredentials: true })
            .then((res) => {
                if (res.data.Status === "Success") {
                    setUserId(res.data.id); // Set the user's ID
                } else {
                    console.log(res.data.Status);
                }
            })
            .catch((err) => {
                console.error("Error fetching user info:", err);
            });

        return () => {
            document.body.style.overflow = 'auto'; // Ensure scrolling is re-enabled when component unmounts
        };
    }, [isConfettiVisible]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrVideo(file); // Store the selected file for the QR code
            setVideoPreviewUrl(URL.createObjectURL(file)); // Set video preview URL
        } else {
            setQrVideo(null);
            setVideoPreviewUrl(null); // Reset video preview when no file is selected
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);

        if (!userId) {
            toast.error("User ID not found. Please try again.");
            setIsGenerating(false); // Reset generating state
            return;
        }

        const formData = new FormData();
        formData.append("qr_name", qrName);
        formData.append("qr_link", qrLink);
        formData.append("qr_user", userId);
        formData.append("qr_not", qr_not);
        formData.append("qr_author", qr_author);
        if (qrVideo) formData.append("qr_video", qrVideo);

        setProgress(20);

        try {
            const response = await apiClient.post(
                "/qr/add",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    },
                }
            );
            toast.success(response.data.message);

            setQrPreview(response.data.qrPngPath);
            setQrPngPath(response.data.qrPngPath);
            setQrSvgPath(response.data.qrSvgPath);
            setQrPagePath(response.data.qrPagePath);

            setVideoPreviewUrl(null);
            setProgress(100);
            setIsConfettiVisible(true);

            setTimeout(() => {
                setIsConfettiVisible(false);
            }, 4000);

            setIsGenerated(true); // Set to true after generation
        } catch (error) {
            console.error("Error creating QR code:", error);
            toast.error("Error creating QR code.");
            setProgress(0);
        } finally {
            setIsGenerating(true); // Ensure generating state is result
            setIsGenerated(true);
        }
    };


    const downloadQRCode = async (url, fileName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    return (
        <div  className={`pt-16 px-6 flex items-center justify-center pb-12 transition-all ${isGenerating ? "items-start justify-start" : "items-center justify-center"}`}>
            {/* Confetti - Absolutely positioned */}
            {isConfettiVisible && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    gravity={0.1}
                    numberOfPieces={1000}
                    recycle={false}
                    initialVelocityY={30}
                    colors={['#ff0', '#ff6347', '#4caf50', '#2196f3']}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                />
            )}

            <motion.div
                initial={{ scale: isGenerating ? 1 : 1.1, opacity: 1 }}
                animate={{
                    scale: isGenerating ? 1 : 1.1,
                    opacity: isGenerating ? 1 : 1,
                    y: isGenerating ? 0 : "-50%",
                }}
                transition={{ duration: 1.0}}
            />

            <div className="flex flex-col md:flex-row items-center justify-between mt-10 w-full max-w-3xl bg-backGround pb-10 px-8 pt-10 rounded-lg shadow-lg relative">
                <AnimatePresence>
                    <motion.form
                        onSubmit={handleSubmit}
                        className={`space-y-8 w-full transition-all ${isGenerated ? 'md:w-2/3' : ''}`}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 1}}
                    >
                        <motion.h1 className="text-4xl font-bold text-textColor mb-8" initial={{opacity: 0, y: -20}}
                                   animate={{opacity: 1, y: 0}}
                                   exit={{opacity: 0, y: 20}}
                                   transition={{delay: 0.1, duration: 0.5}}
                        >Create A QR Code
                        </motion.h1>

                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.2, duration: 0.5}}
                        >

                            <CustomInput
                                name="qr_name"
                                type="text"
                                placeholder="QR Name"
                                value={qrName}
                                onChange={(e) => setQrName(e.target.value)}
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

                            <CustomInput
                                name="qr_author"
                                type="text"
                                placeholder="QR Author"
                                value={qr_author}
                                onChange={(e) => setQrAuthor(e.target.value)}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{delay: 0.3, duration: 0.5}}
                        >
                            <CustomInput
                                name="qr_link"
                                type="url"
                                placeholder="QR Link"
                                value={qrLink}
                                onChange={(e) => setQrLink(e.target.value)}
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
                                value={qr_not}
                                onChange={(e) => setQrNot(e.target.value)}
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
                            <div className="mb-4">
                                <input
                                    type="file"
                                    accept="video/*"
                                    name="qr_video"
                                    onChange={handleFileChange}
                                    className="block border-2 w-full px-4 py-2 border-textColor text-textColor rounded-md"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Video Preview - Only show when video file is selected */}
                        <AnimatePresence>
                            {videoPreviewUrl && (
                                <motion.div
                                    initial={{maxHeight: 0, opacity: 0}}
                                    animate={{maxHeight: 300, opacity: 1}}
                                    exit={{maxHeight: 0, opacity: 0}}
                                    transition={{
                                        duration: 1,
                                        ease: "easeInOut",
                                    }}
                                    className="mb-4 overflow-hidden"
                                >
                                    <video
                                        controls
                                        className="rounded-md border-2"
                                        style={{
                                            maxHeight: "250px",
                                            maxWidth: "300px",
                                            width: "100%", // Allows responsiveness while maintaining the max width
                                            height: "auto", // Keeps the aspect ratio intact
                                        }}
                                        src={videoPreviewUrl}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress Bar */}
                        {isGenerating && (
                            <div className="mb-4 w-full">
                                <motion.div
                                    className="bg-primary h-2 rounded-full"
                                    initial={{width: 0}}
                                    animate={{width: `${progress}%`}}
                                    transition={{duration: 0.5}}
                                />
                            </div>
                        )}
                        <motion.div className="space-y-4"
                                    initial={{opacity: 0, y: -20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 20}}
                                    transition={{delay: 0.5, duration: 0.5}}>
                            {!isGenerating ? (
                                <button
                                    type="submit"
                                    className="w-1/2 font-bold bg-transparent border-secondary border-2 text-xl text-textColor py-3 rounded-md hover:bg-secondary transition duration-200"
                                    disabled={isGenerating} // Disable while generating
                                >
                                    {isGenerating ? "Generating..." : "Generate a QR Code"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="w-1/2 font-bold bg-green-500 border-green-500 border-2 text-xl text-white py-3 rounded-md hover:bg-transparent transition duration-200"
                                    onClick={() => window.location.reload()} // Reload the page to reset the form
                                >
                                    Create New QR Code
                                </button>
                            )}
                        </motion.div>

                    </motion.form>
                </AnimatePresence>

                {/* QR Code Preview */}
                <div className="flex flex-col items-center justify-center mt-10 pl-4 md:mt-0 ">
                    {qrPreview && (
                        <motion.div
                            initial={{opacity: 0, scale: 0.8}} // Start slightly smaller and transparent
                            animate={{opacity: 1, scale: 1}} // Scale in and fade in
                            transition={{duration: 0.5}} // Smooth animation
                            className="flex flex-col items-center"
                        >
                            <img
                                src={qrPreview}
                                alt="QR Preview"
                                className="w-52 h-52 mb-6 rounded shadow-md"
                            />

                            {/* Staggered Buttons */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {opacity: 0},
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.3, // Stagger the animation of child elements
                                        },
                                    },
                                }}
                                className="flex flex-col space-y-4 w-full"
                            >
                                <motion.button
                                    variants={{
                                        hidden: {opacity: 0, y: 20},
                                        visible: {opacity: 1, y: 0},
                                    }}
                                    className="w-full md:w-auto font-bold bg-secondary border-secondary border-2 text-textColor py-2 px-4 rounded-md hover:bg-transparent transition duration-200 text-center"
                                    onClick={() => downloadQRCode(qrPngPath, "qr-code.png")}
                                >
                                    Download PNG
                                </motion.button>

                                <motion.button
                                    variants={{
                                        hidden: {opacity: 0, y: 20},
                                        visible: {opacity: 1, y: 0},
                                    }}
                                    className="w-full md:w-auto font-bold bg-primary border-primary border-2 text-textColor py-2 px-4 rounded-md hover:bg-transparent transition duration-200 text-center"
                                    onClick={() => downloadQRCode(qrSvgPath, "qr-code.svg")}
                                >
                                    Download SVG
                                </motion.button>

                                {qrPagePath && (
                                    <motion.button
                                        variants={{
                                            hidden: {opacity: 0, y: 20},
                                            visible: {opacity: 1, y: 0},
                                        }}
                                        className="w-full md:w-auto font-bold bg-green-500 border-green-500 border-2 text-white py-2 px-4 rounded-md hover:bg-transparent transition duration-200 text-center"
                                        onClick={() => window.open(qrPagePath, "_blank")}
                                    >
                                        View QR Page
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default QrAdd;
