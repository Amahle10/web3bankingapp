import User from "../models/user.js";

// Get user profile with full data
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -pin -__v");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
