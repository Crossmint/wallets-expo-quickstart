import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Redirect } from "expo-router";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";
import * as Linking from "expo-linking";
import Balance from "./balance";
import Transfer from "./transfer";
import DelegatedSigners from "./delegated-signer";
import ActivityComponent from "./activity";
import Logout from "./logout";
import Wallet from "./wallet";
import OTPModal from "../components/otp-modal";
import { useOTPVerification } from "../hooks/use-otp-verification";

export default function Index() {
  const { createAuthSession, status } = useCrossmintAuth();
  const url = Linking.useLinkingURL();
  const [activeTab, setActiveTab] = useState<TabKey>("wallet");

  // OTP verification hook
  const {
    isVerifyingOTP,
    otpCode,
    isVerifyingCode,
    setOtpCode,
    handleVerifyOTP,
    handleCancelOTP,
  } = useOTPVerification();

  useEffect(() => {
    if (url != null) {
      createAuthSession(url);
    }
  }, [url, createAuthSession]);

  if (status === "initializing") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === "logged-out") {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/images/crossmint-icon.png")}
              style={styles.icon}
            />
          </View>
          <Logout />
        </View>
        <Wallet />
      </View>

      <View style={styles.tabsContainer}>
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={(tab) => setActiveTab(tab as TabKey)}
        />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <View style={styles.scrollContent}>
            {activeTab === "wallet" && <Balance />}
            {activeTab === "transfer" && <Transfer />}
            {activeTab === "activity" && <ActivityComponent />}
            {activeTab === "signers" && <DelegatedSigners />}
          </View>
        </View>
      </View>
      <OTPModal
        visible={isVerifyingOTP}
        otpCode={otpCode}
        isVerifying={isVerifyingCode}
        onOtpCodeChange={setOtpCode}
        onVerifyOTP={handleVerifyOTP}
        onCancel={handleCancelOTP}
      />
    </SafeAreaView>
  );
}

type TabItem = {
  key: string;
  label: string;
};

const TABS: TabItem[] = [
  { key: "wallet", label: "Balance" },
  { key: "transfer", label: "Transfer" },
  { key: "activity", label: "Activity" },
  { key: "signers", label: "Signers" },
];

type TabKey = "wallet" | "transfer" | "activity" | "signers";

function TabNavigation({
  tabs,
  activeTab,
  onTabPress,
}: {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}) {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabPress(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "visible",
  },
  scrollContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },

  headerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 16,
    backgroundColor: "#f8fafc",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#1e293b",
  },
  tabText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
