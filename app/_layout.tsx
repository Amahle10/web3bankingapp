// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import { UserProvider } from "../src/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
