import express from "express";
import { protect } from "../middleware/auth.js";
import { createDeposit, ozowWebhook, mintDeposit, getDepositHistory} from "../controllers/depositController.js";

const router = express.Router();

// User initiates deposit
router.post("/create", protect, createDeposit);

// Ozow callback (public route)
router.post("/ozow/webhook", ozowWebhook);

// Mint simulation (protected)
router.post("/mint", protect, mintDeposit);
router.get("/history", protect, getDepositHistory);

export default router;
