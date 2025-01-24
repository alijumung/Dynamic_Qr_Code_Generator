import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import QrRoutes from "./routes/qrRoutes.js";


// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Environment Variables
dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created.");
}

// Initialize Express App
const app = express();

// Middleware for CORS
app.use(cors({
    origin: ['https://stories.deepart.com.tr', 'http://localhost:5173'], // Allow only specific domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
    credentials: true, // Allow cookies to be sent
}));

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Serve uploads directory
app.use('/uploads', express.static(uploadsDir));

// Database Connection
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    } else {
        console.log("Database connected.");
    }
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);
app.use('/qr', QrRoutes);

// Default Route or 404 Handling
app.use((req, res) => {
    res.status(404).json({ Error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ Error: "An unexpected error occurred" });
});

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage: ${JSON.stringify(memoryUsage)}`);
}, 60000); // Log memory usage every 60 seconds
// Start Server
const PORT = process.env.PORT || 8000;
app.listen(8000, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

