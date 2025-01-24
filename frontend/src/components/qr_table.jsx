import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CustomInput from "./customInput.jsx";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../apiClient.js";


function QRTable({ onEdit }) {
    const [qrCodes, setQrCodes] = useState([]);
    const [users, setUsers] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [userRole, setUserRole] = useState("");

    // Fetch user role
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get("/user", {
                    withCredentials: true,
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleOpenModal = (qrId) => {
        setDeleteId(qrId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiClient.delete(`/qr/delete/${deleteId}`);
            setQrCodes((prevQrCodes) => prevQrCodes.filter((qr) => qr.id !== deleteId));
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting QR code:", error);
            alert("Failed to delete the QR code. Please try again.");
        }
    };

    const fetchQRCodes = async () => {
        try {
            const response = await apiClient.get("/qr/get-all");
            setQrCodes(response.data);
        } catch (error) {
            console.error("Error fetching QR codes:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/admin/get-user");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchQRCodes();
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const getUserNameById = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : "Unknown";
    };

    const filteredQRCodes = qrCodes.filter((qr) =>
        qr.qr_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQRCodes.length / itemsPerPage);
    const paginatedQRCodes = filteredQRCodes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const handleDownload = async (qrId) => {
        const downloadFile = async (type) => {
            try {
                const response = await apiClient.get(`/qr/download/${qrId}/${type}`, {
                    responseType: "blob",
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `qr_code.${type}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (error) {
                console.error(`Error downloading ${type} file:`, error);
                alert(`Failed to download the ${type} file. Please try again.`);
            }
        };

        await downloadFile("png");
        await downloadFile("svg");
    };

    return (

        <motion.div className="pt-16 px-4 flex items-center justify-center pb-10" >
            <div className="w-full max-w-7xl bg-backGround p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <CustomInput
                        type="text"
                        placeholder="Search by QR Name"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 border rounded-md text-black"
                    />
                </div>

                <div className="overflow-x-auto">
                    <motion.table
                        className="min-w-full table-auto text-textColor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <thead>
                        <tr>
                            <th className="py-2 px-4 text-left">QR Name</th>
                            <th className="py-2 px-4 text-left">QR Link</th>
                            <th className="py-2 px-4 text-left">User Name</th>
                            <th className="py-2 px-4 text-left">QR Website</th>
                            <th className="py-2 px-4 text-left">Video</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedQRCodes.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-2 px-4 text-center">
                                    No QR codes found
                                </td>
                            </tr>
                        ) : (
                            paginatedQRCodes.map((qr) => (
                                <tr key={qr.id} className="border-b">
                                    <td className="py-2 px-4">{qr.qr_name}</td>
                                    <td className="py-2 px-4">
                                        <a
                                            href={qr.qr_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-textColor font-bold underline"
                                        >
                                            Click To View
                                        </a>
                                    </td>
                                    <td className="py-2 px-4">{getUserNameById(qr.qr_user)}</td>
                                    <td className="py-2 px-4">
                                        <a
                                            href={qr.qr_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-textColor font-bold underline"
                                        >
                                            View Website
                                        </a>
                                    </td>
                                    <td className="py-2 px-4">
                                        {qr.qr_video ? (
                                            <button
                                                onClick={() => {
                                                    setVideoPreview(qr.qr_video);
                                                    setShowVideoModal(true);
                                                }}
                                                className="text-textColor font-bold underline"
                                            >
                                                View Video
                                            </button>
                                        ) : (
                                            "No Video"
                                        )}
                                    </td>
                                    <td className="py-2 px-4 flex gap-2">
                                        {userRole !== "Guest" && (
                                            <>
                                                <button
                                                    onClick={() => onEdit(qr.id)}
                                                    className="p-2 border-2 hover:bg-textColor hover:text-black rounded bg-backGround text-textColor transition-all"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(qr.id)}
                                                    className="p-2 border-2 hover:bg-textColor hover:text-black rounded bg-backGround text-textColor transition-all"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDownload(qr.id)}
                                            className="p-2 border-2 hover:bg-textColor hover:text-black rounded bg-backGround text-textColor transition-all"
                                        >
                                            <FaDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </motion.table>
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4">
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-4 py-2 rounded-md mx-1 border-2 ${
                                        currentPage === pageNumber
                                            ? "bg-textColor text-black border-textColor"
                                            : "bg-transparent text-textColor hover:border-textColor"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

    <AnimatePresence>
        {showModal && (
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
            >
                <motion.div
                    className="bg-textColor rounded-lg p-6 w-full max-w-md"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.h2
                                className="text-lg font-bold mb-4"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Confirm Deletion
                            </motion.h2>
                            <motion.p
                                className="mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Are you sure you want to delete this QR code? This action cannot be undone.
                            </motion.p>
                            <motion.div
                                className="flex justify-end gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded bg-primary text-black hover:bg-transparent transition-all border-2 border-primary "
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No
                                </motion.button>
                                <motion.button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 rounded bg-secondary text-white hover:bg-transparent transition-all border-2 border-secondary  hover:text-black  "
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Yes
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



	    <AnimatePresence>
    {showVideoModal && (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-transparent rounded-lg p-4"
                style={{
                    maxWidth: "300px", // Matches the video max width
                    maxHeight: "250px", // Matches the video max height
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
            >
                <motion.button
                    onClick={() => setShowVideoModal(false)}
                    className="float-right text-white font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    X
                </motion.button>
                <motion.video
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${videoPreview}`}
                    controls
                    autoPlay
                    className="rounded-md"
                    style={{
                        maxHeight: "250px",
                        maxWidth: "300px",
                        width: "100%", // Keeps it responsive
                        height: "auto", // Maintains aspect ratio
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4 }}
                />
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>
	    </motion.div>

    );
}

export default QRTable;
