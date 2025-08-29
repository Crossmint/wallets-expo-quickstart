import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStytch } from "@stytch/react-native";

export default function Logout() {
  const stytch = useStytch();

  const logout = useCallback(() => {
    stytch.session.revoke();
  }, [stytch]);
  
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Logout</Text>
      <Ionicons name="log-out-outline" size={16} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoutText: {
    fontSize: 14,
    color: "#666",
  },
});
