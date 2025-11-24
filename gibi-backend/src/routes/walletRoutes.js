import express from "express";
import { protect } from "../middleware/auth.js";
import { getBalance, sendFunds, getTransactions } from "../controllers/walletController.js";

const router = express.Router();

router.get("/balance", protect, getBalance);
router.post("/send", protect, sendFunds);
router.get("/transactions", protect, getTransactions);

export default router;
