import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios"; // Import axios to make API calls
import AddUser from "./addUser.jsx";
import UsersTable from "./usersTable.jsx";
import EditUser from "./editUser.jsx";
import apiClient from "../apiClient.js";


function Admin() {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Assuming you have a way to identify the logged-in user (e.g., via session or JWT token)
        apiClient
            .get("/user", { withCredentials: true }) // Make sure your request includes authentication details if needed
            .then((response) => {
                const user = response.data;
                setCurrentUserRole(user.role); // Set the user's role

                // Redirect if user is not Admin
                if (user.role !== "Admin") {
                    navigate("/"); // Redirect to home page or another page
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                navigate("/"); // Redirect in case of error
            });
    }, [navigate]);

    // Switch to edit mode
    const handleEdit = (userId) => {
        setSelectedUser(userId);
        setIsEditing(true);
    };

    // Cancel edit mode and return to add form
    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedUser(null);
    };

    return (
        <>
            {isEditing ? (
                <EditUser userId={selectedUser} onCancel={handleCancelEdit} />
            ) : (
                <AddUser />
            )}
            <UsersTable onEdit={handleEdit} />
        </>
    );
}

export default Admin;
