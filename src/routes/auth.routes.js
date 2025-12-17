import express from "express";
import { loginStudent , loginAdmin, forgotPassword, resetPassword } from "../controllers/auth.controllers.js";

const router = express.Router();
router.post("/login", loginStudent);
// Admin login
router.post("/admin-login", loginAdmin);
router.post("/forgot-password", forgotPassword);
// Reset password (from email link)
router.post("/reset-password/:token", resetPassword);
export default router;
