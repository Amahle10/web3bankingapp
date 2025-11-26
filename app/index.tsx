import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { UserContext } from "../src/context/UserContext";

export default function Index() {
  const { token, user, loadingUser } = useContext(UserContext);

  // Show loading indicator while checking token
  if (loadingUser) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  // if we have token & user -> go to tabs home
  if (token && user) return <Redirect href="/(tabs)/home" />;

  // else go to login (first screen)
  return <Redirect href="/login" />;
}
