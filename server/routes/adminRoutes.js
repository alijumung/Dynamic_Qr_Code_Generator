import express from 'express';
import { addUser, deleteUser, getUsers, editUser } from '../controllers/adminController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/add-user', authMiddleware, addUser);
router.get('/get-user/:id', authMiddleware, getUsers);  // Updated route to fetch user by ID
router.get('/get-user', authMiddleware, getUsers);  // Route to fetch all users

router.delete('/delete-users/:id', authMiddleware, deleteUser);
router.put('/edit-user/:id', authMiddleware, editUser);

export default router;
