import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#f6efe4"
        },
        headerTintColor: "#182328",
        sceneStyle: {
          backgroundColor: "#f6efe4"
        },
        tabBarActiveTintColor: "#b2502d",
        tabBarInactiveTintColor: "#6b7680",
        tabBarStyle: {
          backgroundColor: "#fffaf3",
          borderTopColor: "#e7d7c3"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="home-variant" size={size} />
          ),
          title: "Accueil"
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="magnify" size={size} />
          ),
          title: "Recherche"
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="calendar-clock" size={size} />
          ),
          title: "Bookings"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="account-circle" size={size} />
          ),
          title: "Profile"
        }}
      />
    </Tabs>
  );
}
