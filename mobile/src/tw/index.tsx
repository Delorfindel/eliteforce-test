import { Link as RouterLink } from "expo-router";
import { cssInterop } from "nativewind";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

export { Pressable, ScrollView, Text, TextInput, View };

export const Link = cssInterop(RouterLink, {
  className: "style"
});
