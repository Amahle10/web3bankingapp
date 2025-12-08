import User from "../models/user.js";
import Transaction from "../models/transaction.js";

// Get user balance
export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, balance: user.balance || 0, wallet: user.walletAddress });
  } catch (err) {
    console.error("getBalance error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send funds to another wallet
export const sendFunds = async (req, res) => {
  const { to, amount } = req.body;
  if (!to || !amount)
    return res.status(400).json({ success: false, message: "Missing parameters" });

  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ walletAddress: to });

    if (!sender || !receiver)
      return res.status(404).json({ success: false, message: "Sender or receiver not found" });
    if (sender.balance < amount)
      return res.status(400).json({ success: false, message: "Insufficient balance" });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const tx = await Transaction.create({
      from: sender.walletAddress,
      to: receiver.walletAddress,
      amount,
    });

    res.json({ success: true, transaction: tx });
  } catch (err) {
    console.error("sendFunds error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const transactions = await Transaction.find({
      $or: [{ from: user.walletAddress }, { to: user.walletAddress }],
    }).sort({ createdAt: -1 }); // make sure your Transaction schema has createdAt

    res.json({ success: true, transactions });
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
