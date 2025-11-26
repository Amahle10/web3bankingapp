// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet", tabBarIcon: ({ color, size }) => <MaterialIcons name="account-balance-wallet" size={size} color={color} /> }} />
      <Tabs.Screen name="transact" options={{ title: "Transact", tabBarIcon: ({ color, size }) => <MaterialIcons name="send" size={size} color={color} /> }} />
      <Tabs.Screen name="aichatbot" options={{ title: "AI", tabBarIcon: ({ color, size }) => <MaterialIcons name="smartphone" size={size} color={color} /> }} />
    </Tabs>
  );
}
