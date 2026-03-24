import React from "react";
import { ActivityIndicator } from "react-native";

type SpinnerProps = {
  size?: "small" | "large";
  color?: string;
};

export function Spinner({
  size = "small",
  color = "#0E7051"
}: SpinnerProps) {
  return <ActivityIndicator color={color} size={size} />;
}
