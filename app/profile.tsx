// app/profile.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { UserContext } from "../src/context/UserContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={{ fontSize: 18, marginTop: 12 }}>{user?.name}</Text>
      <Text style={{ color: "#666", marginTop: 6 }}>{user?.email}</Text>
      <Button title="Logout" onPress={async () => { await logout(); router.replace("/login"); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700" }
});
