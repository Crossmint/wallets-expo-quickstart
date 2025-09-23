import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useWallet, useCrossmint } from "@crossmint/client-sdk-react-native-ui";
import Tooltip from "../components/tooltip";
import { useBalanceInterval } from "@/hooks/useBalanceInterval";

const formatBalance = (amount: string) => {
  return Number.parseFloat(amount).toFixed(2);
};

export default function Balance() {
  const { wallet } = useWallet();
  const {
    crossmint: { apiKey, jwt },
  } = useCrossmint();
  const [isFunding, setIsFunding] = useState(false);
  const { balances, triggerManualRefresh, isManualRefreshing } =
    useBalanceInterval();

  const handleFund = async () => {
    if (!wallet) {
      return;
    }
    if (apiKey.includes("_production_")) {
      Alert.alert("Crossmint faucet is not available in production.");
      return;
    }

    setIsFunding(true);
    try {
      const fundingAmount = 10;
      const response = await fetch(
        `https://staging.crossmint.com/api/v1-alpha2/wallets/${wallet.address}/balances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            amount: fundingAmount,
            token: "usdxm",
            chain: wallet.chain,
          }),
        }
      );

      if (response != null && !response.ok) {
        Alert.alert("Failed to get USDXM", response.statusText);
        return;
      }

      Alert.alert(
        "Success",
        `Added $${fundingAmount} USDXM to your wallet! Balance will update momentarily.`
      );
    } catch (error) {
      Alert.alert("Error", `Error getting test USDXM: ${error}`);
    } finally {
      setIsFunding(false);
    }
  };

  const usdxmToken = balances?.tokens.find((token) => token.symbol === "usdxm");
  const usdxmBalance = formatBalance(usdxmToken?.amount || "0");

  if (wallet == null) {
    return (
      <View style={styles.container}>
        <Text>Loading wallet information...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isManualRefreshing}
          onRefresh={triggerManualRefresh}
          tintColor="#05b959"
        />
      }
    >
      {/* Featured USDXM Balance Card */}
      <View style={styles.featuredBalanceCard}>
        <View style={styles.featuredTokenHeader}>
          <View style={styles.featuredIconContainer}>
            <Image
              source={require("../assets/images/usdxm.png")}
              style={styles.featuredTokenIcon}
            />
          </View>
          <Text style={styles.featuredTokenLabel}>USDXM balance</Text>
          <Tooltip content="USDXM is a test stablecoin">
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>i</Text>
            </View>
          </Tooltip>
        </View>
        <Text style={styles.featuredBalance}>$ {usdxmBalance}</Text>
        <TouchableOpacity
          style={[
            styles.addMoneyButton,
            isFunding && styles.addMoneyButtonDisabled,
          ]}
          onPress={handleFund}
          disabled={isFunding}
        >
          {isFunding ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.addMoneyButtonText}>Adding money...</Text>
            </View>
          ) : (
            <Text style={styles.addMoneyButtonText}>Add money</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.refreshNote}>
          Balance will update automatically. Pull down to refresh manually.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  featuredBalanceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuredTokenHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featuredIconContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  featuredTokenIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  featuredTokenLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIconText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  featuredBalance: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  addMoneyButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  addMoneyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  addMoneyButtonDisabled: {
    backgroundColor: "#94a3b8",
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshNote: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
