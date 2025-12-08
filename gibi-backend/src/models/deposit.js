import mongoose from "mongoose";

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amountRand: {
      type: Number,
      required: true,
    },

    amountGibi: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "MINTED", "FAILED"],
      default: "PENDING",
    },

    paymentUrl: String,
    ozowTxId: String,
    tokenTxHash: String,
  },
  { timestamps: true }
);

export default mongoose.model("Deposit", depositSchema);
