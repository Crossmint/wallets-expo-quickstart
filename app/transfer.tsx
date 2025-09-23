import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Transfer() {
  const { wallet } = useWallet();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [explorerLink, setExplorerLink] = useState<string | null>(null);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const handleTransfer = useCallback(async () => {
    if (wallet == null || recipient == null || amount == null) {
      Alert.alert("Transfer", "Missing required fields");
      return;
    }

    try {
      setIsLoading(true);
      const txn = await wallet.send(recipient, "usdxm", amount.toString());
      setExplorerLink(txn.explorerLink);
      // Reset form after successful transfer
      setAmountInput("");
      setAmount(null);
      setRecipient("");
    } catch (error) {
      Alert.alert("Transfer Failed", `${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, recipient, amount]);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      extraScrollHeight={20}
    >
      <View>
        <Text style={styles.sectionTitle}>Transfer funds</Text>
        <Text style={styles.sectionSubtitle}>Send funds to another wallet</Text>

        <View style={styles.transferAmountCard}>
          <View style={styles.amountInputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amountInput}
              onChangeText={(value) => {
                setAmountInput(value);
                if (value === "") {
                  setAmount(null);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    setAmount(numValue);
                  }
                }
              }}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>
      </View>

      {explorerLink && !isLoading && (
        <TouchableOpacity
          style={styles.explorerLinkContainer}
          onPress={() => Linking.openURL(explorerLink)}
        >
          <Text style={styles.explorerLinkText}>→ View transaction</Text>
        </TouchableOpacity>
      )}

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Transfer to</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter wallet address"
          value={recipient}
          onChangeText={setRecipient}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (isLoading || !recipient || !amount) && styles.buttonDisabled,
          ]}
          onPress={handleTransfer}
          disabled={isLoading || !recipient || !amount}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Transfer</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
  },
  transferAmountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dollarSign: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
    flex: 1,
    paddingLeft: 4,
    backgroundColor: "transparent",
  },
  explorerLinkContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  explorerLinkText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  formSection: {
    width: "100%",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    width: "100%",
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
