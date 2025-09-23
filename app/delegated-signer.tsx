import {
  type DelegatedSigner,
  useWallet,
} from "@crossmint/client-sdk-react-native-ui";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

// We want to cache the signers so we don't have to fetch them every time we change tabs
let delegatedSignersCache: DelegatedSigner[] | null = null;

export default function DelegateSigners() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [delegatedSigners, setDelegatedSigners] = useState<DelegatedSigner[]>(
    delegatedSignersCache || []
  );
  const [newSigner, setNewSigner] = useState<string>("");

  useEffect(() => {
    const fetchDelegatedSigners = async () => {
      if (wallet != null) {
        const signers = await wallet.delegatedSigners();
        setDelegatedSigners(signers);
        delegatedSignersCache = signers;
      }
    };
    fetchDelegatedSigners();
  }, [wallet]);

  const addNewSigner = async () => {
    if (wallet == null) {
      Alert.alert("No wallet connected");
      return;
    }
    if (!newSigner) {
      Alert.alert(
        "Error adding delegated signer",
        "No signer provided, please enter a valid signer"
      );
      return;
    }
    try {
      setIsLoading(true);
      await wallet.addDelegatedSigner({ signer: newSigner });
      const signers = await wallet.delegatedSigners();
      setDelegatedSigners(signers);
    } catch (err) {
      Alert.alert("Error adding delegated signer", `${err}`);
    } finally {
      setNewSigner("");
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Delegated Signers</Text>
      <Text style={styles.sectionSubtitle}>
        Allow third parties to sign transactions on behalf of your wallet.{" "}
        <Text
          style={styles.learnMoreLink}
          onPress={() =>
            Linking.openURL(
              "https://docs.crossmint.com/wallets/advanced/delegated-keys"
            )
          }
        >
          Learn more
        </Text>
        .
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5YNmS1R9nNSCDzb5a7mMJ1dwK9UHeA"
        onChangeText={setNewSigner}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={addNewSigner}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {isLoading ? "Processing..." : "Add"}
          </Text>
        )}
      </TouchableOpacity>

      {/* List of delegated signers */}
      {delegatedSigners.length > 0 ? (
        <View style={styles.signersContainer}>
          <Text style={styles.signersTitle}>Registered signers</Text>
          <View style={styles.signersListContainer}>
            <View style={styles.signersList}>
              {delegatedSigners.map(({ signer }) => (
                <Text key={signer} style={styles.signerItem}>
                  {signer}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: "400",
  },
  learnMoreLink: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  signersContainer: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  signersTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  signersListContainer: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  signersList: {
    flexDirection: "column",
    gap: 4,
  },
  signerItem: {
    fontSize: 12,
    color: "#4b5563",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
