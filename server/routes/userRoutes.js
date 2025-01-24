import express from 'express';
import { getUserInfo, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserInfo);
router.post('/update-profile', authMiddleware, (req, res, next) => {
    upload.single('profilePic')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ Error: err.message });
        }
        next();
    });
}, updateProfile);

export default router;
