// app/(tabs)/settings.tsx
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { UserContext } from "../src/context/UserContext";

export default function Settings() {
  const { language, setLanguage, theme, setTheme } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    Alert.alert("Language Changed", `App language set to ${lang}`);
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    setTheme(newTheme);
    Alert.alert("Theme Changed", `App theme set to ${newTheme}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.sectionTitle}>Language</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.optionBtn, language === "en" && styles.selectedOption]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text style={styles.optionText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, language === "zu" && styles.selectedOption]}
          onPress={() => handleLanguageChange("zu")}
        >
          <Text style={styles.optionText}>isiZulu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <Text style={styles.sectionTitle}>Security</Text>
      <TouchableOpacity style={styles.optionBtn} onPress={() => Alert.alert("Change PIN", "Feature coming soon")}>
        <Text style={styles.optionText}>Change PIN</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Support</Text>
      <TouchableOpacity style={styles.optionBtn} onPress={() => Alert.alert("Contact Support", "Feature coming soon")}>
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionBtn} onPress={() => Alert.alert("About", "Gibi Wallet v1.0.0")}>
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F3D3E",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00FFD5",
    marginTop: 20,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: "#1A4F4F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: "#00FFD5",
  },
  optionText: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "600",
  },
});
