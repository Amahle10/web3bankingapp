import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";
import crypto from "crypto";

// JWT generator
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });

    const wallet = ethers.Wallet.createRandom();
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(process.env.SECRET_KEY, "utf-8").slice(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encryptedPK = cipher.update(wallet.privateKey, "utf8", "hex");
    encryptedPK += cipher.final("hex");
    const encryptedData = iv.toString("hex") + ":" + encryptedPK;

    const user = await User.create({
      name,
      email,
      password,
      walletAddress: wallet.address,
      encryptedPrivateKey: encryptedData,
    });

    res.json({ success: true, userId: user._id, walletAddress: user.walletAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login email + password
export const loginEmailPassword = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  // Make sure matchPassword is defined in user model
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const needPinSetup = !user.pin;
  res.json({ success: true, token: generateToken(user._id), needPinSetup, userId: user._id });
};

// Setup PIN
export const setupPin = async (req, res) => {
  const { userId, pin } = req.body;
  if (!pin || pin.length !== 5)
    return res.status(400).json({ success: false, message: "PIN must be 5 digits" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.pin = await bcrypt.hash(pin, 10);
  await user.save();

  res.json({ success: true, message: "PIN created successfully" });
};

// Login with PIN
export const loginWithPin = async (req, res) => {
  const { email, pin } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const pinMatch = await bcrypt.compare(pin, user.pin || "");
  if (!pinMatch) return res.status(401).json({ success: false, message: "Invalid PIN" });

  res.json({ success: true, token: generateToken(user._id), userId: user._id });
};
