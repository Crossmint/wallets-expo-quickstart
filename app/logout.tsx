import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import { Ionicons } from "@expo/vector-icons";

export default function Logout() {
  const { logout } = useCrossmintAuth();
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Logout</Text>
      <Ionicons name="log-out-outline" size={16} color="#64748b" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(100, 116, 139, 0.1)",
  },
  logoutText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
});
