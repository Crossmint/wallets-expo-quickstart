import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function Wallet() {
  const { wallet } = useWallet();

  const copyAddress = async () => {
    if (wallet?.address) {
      await Clipboard.setStringAsync(wallet.address);
      Alert.alert("Address copied to clipboard");
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (!wallet) return null;

  return (
    <View style={styles.container}>
      {/* Your wallet details */}
      <View style={styles.walletDetailsSection}>
        <Text style={styles.sectionTitle}>Your wallet</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.addressRow}>
              <Text style={styles.walletAddress}>
                {formatWalletAddress(wallet.address)}
              </Text>
              <TouchableOpacity onPress={copyAddress} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={14} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.ownerChainContainer}>
            <View style={styles.ownerItem}>
              <Text style={styles.infoLabel}>Owner</Text>
              <Text style={styles.infoValue}>
                {wallet?.owner?.replace(/^[^:]*:/, "") || "Current User"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.chainItem}>
              <Text style={styles.infoLabel}>Chain</Text>
              <Text style={styles.infoValue}>{wallet?.chain}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  walletDetailsSection: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
    fontWeight: "500",
  },
  detailsContainer: {
    alignItems: "center",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  ownerChainContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  ownerItem: {
    alignItems: "center",
    flex: 2.2,
  },
  chainItem: {
    alignItems: "center",
    flex: 0.8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 12,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyButton: {
    padding: 4,
  },
  walletAddress: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
});
