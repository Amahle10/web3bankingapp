import User from "../models/user.js";

export const getUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, user });
};
