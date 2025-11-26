// app/(tabs)/wallet.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { UserContext } from "../../src/context/UserContext";
import { LineChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";

export default function Wallet() {
  const { user } = useContext(UserContext);

  const transactions = user?.transactions || [];
  const balanceHistory = user?.balanceHistory || [];

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      Alert.alert("Copied!", "Wallet address copied to clipboard.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wallet</Text>

      {/* Wallet Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Wallet Address</Text>
        <TouchableOpacity onPress={copyAddress}>
          <Text selectable style={styles.address}>{user?.walletAddress ?? "—"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>{user?.balance ?? 0} BGC</Text>
      </View>

      {/* Analytics */}
      <View style={styles.analytics}>
        <Text style={styles.sectionTitle}>Balance Analytics</Text>
        {balanceHistory.length > 0 ? (
          <LineChart
            style={styles.chart}
            data={balanceHistory}
            svg={{ stroke: "#00FFD5", strokeWidth: 3 }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveMonotoneX}
          >
            <Grid />
          </LineChart>
        ) : (
          <Text style={styles.emptyText}>No analytics data yet</Text>
        )}
      </View>

      {/* Transaction History */}
      <View style={styles.transactions}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.txCard}>
                <Text style={styles.txDesc}>{item.description}</Text>
                <Text style={styles.txAmount}>{item.amount} BGC</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No transactions yet</Text>
        )}
      </View>

      <Text style={styles.footer}>
        Keep your wallet secure. Tap the address to copy it.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#0F3D3E" },
  title: { fontSize: 28, fontWeight: "900", color: "#E0E0E0", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#1F7C7A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: { color: "#A0A0A0", fontSize: 14, fontWeight: "600", marginTop: 12 },
  address: { color: "#E0E0E0", fontSize: 16, fontWeight: "700", marginTop: 4 },
  balance: { color: "#00FFD5", fontSize: 28, fontWeight: "900", marginTop: 6 },
  analytics: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#E0E0E0", marginBottom: 10 },
  chart: { height: 120, borderRadius: 12 },
  transactions: { flex: 1 },
  txCard: {
    backgroundColor: "#1F7C7A",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  txDesc: { color: "#E0E0E0", fontWeight: "600" },
  txAmount: { color: "#00FFD5", fontWeight: "900" },
  emptyText: { color: "#A0A0A0", fontStyle: "italic", textAlign: "center", marginVertical: 20 },
  footer: { color: "#A0A0A0", fontSize: 12, marginTop: 20, textAlign: "center" },
});
