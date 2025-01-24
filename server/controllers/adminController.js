import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const addUser = (req, res) => {
    const { name, email, password, role, profile_pic } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check if the user already exists
    const checkUserSQL = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserSQL, [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Error checking user existence." });

        if (result.length > 0) {
            return res.status(409).json({ error: "Email already exists." });
        }

        // Hash the password
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) return res.status(500).json({ error: "Error hashing password." });

            // Insert the new user
            const insertUserSQL =
                "INSERT INTO users (name, email, password, role, profile_pic) VALUES (?, ?, ?, ?, ?)";
            const values = [
                name,
                email,
                hashedPassword,
                role || "guest", // Default role is 'guest'
                profile_pic || '/uploads/profiles/default.png', // Default profile_pic is null
            ];

            db.query(insertUserSQL, values, (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).json({ error: "Error inserting user into database." });
                }

                return res.status(201).json({ Status: "Success", message: "User created successfully." });
            });
        });
    });
};

export const getUsers = (req, res) => {
    const { id } = req.params;  // This will fetch the id from the route parameters

    if (id) {
        // Fetch a specific user by ID
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching user by ID." });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: "User not found." });
            }

            return res.status(200).json(result[0]);  // Send the first user found (user by ID)
        });
    } else {
        // Fetch all users
        const sql = "SELECT * FROM users";
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching users." });
            }
            return res.status(200).json(result);  // Send the result (list of users)
        });
    }
};


export const deleteUser = (req, res) => {
    const userId = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Error deleting user." });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json({ status: "success", message: "User deleted successfully." });
    });
};
export const editUser = (req, res) => {
    const { name, email, password, role } = req.body; // Assuming you are sending these values from your form
    const { id } = req.params;

    // Check if any required fields are missing
    if (!name || !email || !role) {
        return res.status(400).json({ error: "Name, email, and role are required fields." });
    }

    // SQL query to update user
    const sql = `
        UPDATE users
        SET name = ?, email = ?, password = ?, role = ?
        WHERE id = ?
    `;
    const values = [name, email, password, role, id]; // Ensure you're passing values in the correct order

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: "Error updating user." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(201).json({ Status: "Success",  message: "User updated successfully." });
    });
};


