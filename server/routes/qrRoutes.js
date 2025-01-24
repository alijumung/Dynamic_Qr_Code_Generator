import express from "express";
import { QrAdd, serveDynamicQRContent, getAllQRCodes, deleteQR, downloadQRCode, QrEdit } from "../controllers/qrController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Specific routes should be defined before dynamic ones
router.post("/add", authMiddleware, QrAdd);
router.get("/get-all", authMiddleware, getAllQRCodes);
router.get("/get-all/:id", authMiddleware, getAllQRCodes);


router.delete("/delete/:id", authMiddleware, deleteQR);
router.get('/download/:qrId/:type', authMiddleware, downloadQRCode)
router.post("/edit/:id", authMiddleware, QrEdit);
router.get("/:identifier", serveDynamicQRContent);


export default router;
