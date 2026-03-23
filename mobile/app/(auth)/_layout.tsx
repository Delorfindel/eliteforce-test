import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#f6efe4"
        },
        headerTintColor: "#182328"
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Create account" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot password" }}
      />
      <Stack.Screen
        name="update-password"
        options={{ title: "Update password" }}
      />
    </Stack>
  );
}
