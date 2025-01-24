import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomInput from "./customInput.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import apiClient from "../apiClient.js";

function UsersTable({ onEdit }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/admin/get-user");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await apiClient.delete(`/admin/delete-users/${userToDelete}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete));
            setShowModal(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="pt-16 px-4 flex items-center justify-center pb-10">
            <div className="w-full max-w-3xl bg-backGround p-6 rounded-lg shadow-md">
                {/* Search Input */}
                <div className="mb-4">
                    <CustomInput
                        type="text"
                        placeholder="Search by Name"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-textColor">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 text-left">ID</th>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-2 px-4 text-center">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-2 px-4">{user.id}</td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">{user.role}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <button
                                            onClick={() => onEdit(user.id)}
                                            className="p-2 border-2 hover:bg-textColor hover:text-black rounded bg-backGround text-textColor transition-all"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(user.id)}
                                            className="p-2 border-2 hover:bg-textColor hover:text-black border-textColor rounded bg-backGround text-textColor transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

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

            {/* Confirmation Modal */}
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
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 50}}
                            transition={{duration: 0.3}}
                        >
                            <motion.h2
                                className="text-lg font-bold mb-4"
                                initial={{ opacity: 0 }}
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
                                Are you sure you want to delete this user? This action cannot be undone.
                            </motion.p>
                            <motion.div
                                className="flex justify-end gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded bg-primary text-black hover:bg-transparent transition-all border-2 border-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    No
                                </motion.button>
                                <motion.button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded bg-secondary text-white hover:bg-transparent transition-all border-2 border-secondary hover:text-black"
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


        </div>
    );
}

export default UsersTable;
