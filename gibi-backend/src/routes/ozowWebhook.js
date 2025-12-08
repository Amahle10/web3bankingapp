export const ozowWebhook = async (req, res) => {
  try {
    const { depositId, ozowTxId, status } = req.body;

    const deposit = await Deposit.findById(depositId);
    if (!deposit) return res.status(404).send("Deposit not found");

    if (status === "SUCCESS") {
      deposit.status = "CONFIRMED";
      deposit.ozowTxId = ozowTxId;
      await deposit.save();
    }

    res.send("OK");
  } catch (err) {
    console.error("Ozow webhook error:", err);
    res.status(500).send("Webhook error");
  }
};
