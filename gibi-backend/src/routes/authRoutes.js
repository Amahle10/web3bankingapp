import express from "express";
import { register, loginEmailPassword, loginWithPin, setupPin } from "../controllers/authController.js";

const router = express.Router();

// User registration
router.post("/register", register);

// First-time login with email + password
router.post("/login-email-password", loginEmailPassword);

// Setup 5-digit PIN
router.post("/setup-pin", setupPin);

// Login using PIN only
router.post("/login-pin", loginWithPin);

export default router;
