import Deposit from "../models/deposit.js";
import User from "../models/user.js";

// Create a deposit request (user starts deposit)
export const createDeposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Create deposit record
    const deposit = await Deposit.create({
      user: req.user.id,
      amountRand: amount,
      amountGibi: amount, // 1 Gibi = 1 Rand for now
      status: "PENDING",
    });

    // Placeholder for Ozow payment URL
    const paymentUrl = `https://ozow.com/pay/${deposit._id}`;
    deposit.paymentUrl = paymentUrl;
    await deposit.save();

    res.json({ success: true, depositId: deposit._id, paymentUrl });
  } catch (err) {
    console.error("Create deposit error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Ozow webhook (called by Ozow when payment succeeds)
export const ozowWebhook = async (req, res) => {
  try {
    const { depositId, ozowTxId, status } = req.body;

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).send("Deposit not found");

    if (status === "SUCCESS") {
      deposit.status = "CONFIRMED";
      deposit.ozowTxId = ozowTxId;
      await deposit.save();

      // Update user balance
      const user = await User.findById(deposit.user);
      if (user) {
        user.balance = (user.balance || 0) + deposit.amountGibi;
        await user.save();
      }
    }

    res.send("OK");
  } catch (err) {
    console.error("Ozow webhook error:", err);
    res.status(500).send("Webhook error");
  }
};

// Mint tokens (simulated for now)
export const mintDeposit = async (req, res) => {
  try {
    const { depositId } = req.body;

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).json({ success: false, message: "Deposit not found" });
    if (deposit.status !== "CONFIRMED") return res.status(400).json({ success: false, message: "Deposit not confirmed" });

    const user = await User.findById(deposit.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Add to balance (simulate mint)
    user.balance = (user.balance || 0) + deposit.amountGibi;
    await user.save();

    deposit.status = "MINTED";
    await deposit.save();

    res.json({ success: true, message: "Deposit minted", newBalance: user.balance });
  } catch (err) {
    console.error("Mint error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDepositHistory = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ deposits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

