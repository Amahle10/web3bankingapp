import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


// Default route
app.get("/", (req, res) => {
  res.send("Gibi backend running...");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/deposits", depositRoutes);

app.use("/api/wallet", walletRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
