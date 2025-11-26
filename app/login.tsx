// app/login.tsx
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { loginEmailPasswordApi, setupPinApi, loginPinApi } from "../src/api/auth";
import { UserContext } from "../src/context/UserContext";

export default function Login() {
  const router = useRouter();
  const { setToken, loadUserProfile } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // first-time password
  const [pin, setPin] = useState(""); // pin input
  const [stage, setStage] = useState<"email" | "createPin" | "pinLogin">("email");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      const { ok, data, text } = await loginEmailPasswordApi(email, password);
      if (!ok) {
        Alert.alert("Error", (data?.message ?? text ?? "Login failed").toString());
        return;
      }
      // backend returns needPinSetup boolean
      if (data.needPinSetup) {
        setUserId(data.userId);
        setStage("createPin");
      } else {
        // Already has PIN: server should also return token
        if (data.token) {
          await setToken(data.token);
          await loadUserProfile(data.token);
          router.replace("/(tabs)/home");
        } else {
          // If server doesn't return token for this route, move to pinLogin
          setStage("pinLogin");
        }
      }
    } catch (e) {
      Alert.alert("Error", "Network error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePin = async () => {
    if (!userId) return Alert.alert("Error", "Missing userId");
    if (pin.length !== 5) return Alert.alert("Error", "PIN must be 5 digits");
    setLoading(true);
    try {
      const { ok, data, text } = await setupPinApi(userId, pin);
      if (!ok) {
        Alert.alert("Error", (data?.message ?? text ?? "Failed to set PIN").toString());
        return;
      }
      Alert.alert("Success", "PIN created. Please log in with PIN.");
      setStage("pinLogin");
      setPassword("");
    } catch (e) {
      Alert.alert("Error", "Network error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async () => {
    if (pin.length !== 5) return Alert.alert("Error", "PIN must be 5 digits");
    setLoading(true);
    try {
      const { ok, data, text } = await loginPinApi(email, pin);
      if (!ok) {
        Alert.alert("Error", (data?.message ?? text ?? "Pin login failed").toString());
        return;
      }
      if (data.token) {
        await setToken(data.token);
        await loadUserProfile(data.token);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", "No token returned");
      }
    } catch (e) {
      Alert.alert("Error", "Network error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginBottom: 12 }} />}

      {stage === "email" && (
        <>
          <Text style={styles.title}>Sign in</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
          <Button title="Continue" onPress={handleEmailLogin} />
        </>
      )}

      {stage === "createPin" && (
        <>
          <Text style={styles.title}>Create a 5-digit PIN</Text>
          <TextInput placeholder="Enter 5-digit PIN" value={pin} onChangeText={setPin} style={styles.input} keyboardType="numeric" maxLength={5} secureTextEntry />
          <Button title="Set PIN" onPress={handleCreatePin} />
        </>
      )}

      {stage === "pinLogin" && (
        <>
          <Text style={styles.title}>Login with PIN</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="5-digit PIN" value={pin} onChangeText={setPin} style={styles.input} keyboardType="numeric" secureTextEntry maxLength={5} />
          <Button title="Login with PIN" onPress={handlePinLogin} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 18, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 12 }
});
