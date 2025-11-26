// app/(tabs)/home.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { UserContext } from "../../src/context/UserContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Gibi Wallet</Text>
          <Text style={styles.appVersion}>v1.0.0</Text>
          <Text style={styles.appTagline}>Smart, Secure & Fast Fintech</Text>
        </View>

        {/* Big greeting */}
        <Text style={styles.bigHi}>Hi {user?.name ?? "User"}</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        {/* Quick action buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.btn} onPress={() => router.push("/profile")}>
            <Ionicons name="person-circle-outline" size={24} color="#E0E0E0" style={{ marginBottom: 6 }} />
            <Text style={styles.btnText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => router.push("/settings")}>
            <Ionicons name="settings-outline" size={24} color="#E0E0E0" style={{ marginBottom: 6 }} />
            <Text style={styles.btnText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => router.push("/wallet")}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#E0E0E0" style={{ marginBottom: 6 }} />
            <Text style={styles.btnText}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => router.push("/transact")}>
            <Ionicons name="send-outline" size={24} color="#E0E0E0" style={{ marginBottom: 6 }} />
            <Text style={styles.btnText}>Transact</Text>
          </TouchableOpacity>
        </View>

        {/* AI Assistant Info */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AI Assistance</Text>
          <Text style={styles.footerText}>
            Gibi AI helps you manage your finances, provides smart suggestions, 
            and keeps your wallet secure. Available 24/7.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F3D3E", // deep blue-green metallic
  },
  appInfo: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#E0E0E0",
  },
  appVersion: {
    fontSize: 14,
    color: "#A0A0A0",
    marginTop: 2,
  },
  appTagline: {
    fontSize: 16,
    color: "#00FFD5",
    marginTop: 4,
    fontWeight: "600",
  },
  bigHi: {
    fontSize: 36,
    fontWeight: "900",
    color: "#E0E0E0",
    textShadowColor: "#00FFD5",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#A0A0A0",
    marginTop: 8,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  quickActions: {
    marginHorizontal: 20,
    flexDirection: "column",
  },
  btn: {
    backgroundColor: "#1F7C7A", // teal metallic
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#00FFD5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  btnText: {
    color: "#E0E0E0",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#1A4F4F",
    borderRadius: 12,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00FFD5",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
  },
});
