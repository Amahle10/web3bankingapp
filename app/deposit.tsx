import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { UserContext } from "../src/context/UserContext";

export default function DepositScreen() {
  const { user, deposit } = useContext(UserContext);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Deposit");

  const handleDeposit = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid number greater than 0.");
      return;
    }

    deposit(numAmount, description);
    Alert.alert("Success", `Deposited ${numAmount} coins`);
    setAmount("");
    setDescription("Deposit");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Deposit Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Deposit" onPress={handleDeposit} />

      <View style={styles.info}>
        <Text style={styles.infoText}>Your Wallet: {user?.walletAddress ?? "Not loaded"}</Text>
        <Text style={styles.infoText}>Current Balance: {user?.balance ?? 0}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
  info: { marginTop: 32, alignItems: "center" },
  infoText: { fontSize: 16, fontWeight: "500" },
});
