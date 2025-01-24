import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ error: "Error querying the database" });

        if (data.length > 0) {
            bcrypt.compare(password, data[0].password, (err, response) => {
                if (response) {
                    const userDetails = {
                        name: data[0].name,
                        email: data[0].email,
                        profile_pic: data[0].profile_pic,
                    };

                    const token = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: "1d" });
                    res.cookie('token', token);
                    // Log user details and token to the console
                    console.log("User Details:", userDetails);

                    return res.json({
                        status: "success",
                        message: "User logged in successfully",
                        user: userDetails,
                        token: token
                    });
                } else {
                    return res.json({ status: "error", message: "Invalid credentials" });
                }
            });
        } else {
            return res.json({ status: "error", message: "No user found with that email" });
        }
    });
};
export const register = (req, res) => {
    const { name, email, password, role, profile_pic } = req.body;

    const sql = "INSERT INTO users (name, email, password, role, profile_pic) VALUES (?, ?, ?, ?, ?)";
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json({ error: "Error hashing password." });

        const values = [
            name,
            email,
            hash,
            role || 'admin',
            profile_pic || null,
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Email already exists." });
                }
                return res.json({ error: "Error inserting data." });
            }
            return res.json({ status: "success" });
        });
    });
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ status: 'Logged out' });
};
