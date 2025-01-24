import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// Backend API function
export const getUserInfo = (req, res) => {
    const sql = "SELECT id, name, email, role, profile_pic FROM users WHERE email = ?";
    db.query(sql, [req.user.email], (err, data) => {
        if (err) return res.status(500).json({ Error: "Error fetching user data" });
        if (data.length > 0) return res.json({ Status: "Success", ...data[0] });
        return res.status(404).json({ Error: "User not found" });
    });
};
export const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if a new profile picture is provided
    const profilePic = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    try {
        // Hash password if provided
        let hashedPassword = undefined;
        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Build dynamic SQL query based on provided fields
        let sql = `UPDATE users SET `;
        const values = [];

        if (name) {
            sql += `name = ?, `;
            values.push(name);
        }
        if (email) {
            sql += `email = ?, `;
            values.push(email);
        }
        if (profilePic) {
            sql += `profile_pic = ?, `;
            values.push(profilePic);
        }
        if (hashedPassword) {
            sql += `password = ?, `;
            values.push(hashedPassword);
        }

        // Remove trailing comma and space
        sql = sql.slice(0, -2);

        // Add WHERE clause
        sql += ` WHERE email = ?`;
        values.push(req.user.email);

        // Execute query
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ Error: "Database error occurred" });
            }

            if (result.affectedRows > 0) {
                return res.json({ Status: "Success", Message: "Profile updated successfully" });
            } else {
                return res.status(404).json({ Error: "User not found or no changes made" });
            }
        });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ Error: "An error occurred while updating the profile" });
    }
};

