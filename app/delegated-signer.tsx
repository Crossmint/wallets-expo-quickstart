import { useWallet } from "@crossmint/client-sdk-react-native-ui";
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

const SIGNER_TYPES = ["device", "external-wallet"] as const;
type SignerType = (typeof SIGNER_TYPES)[number];

function getSignerLocator(s: any): string {
  if (typeof s === "string") return s;
  return s.locator ?? JSON.stringify(s);
}

function formatSignerLabel(s: any): string {
  const loc = getSignerLocator(s);
  const [type] = loc.split(":");
  const rest = loc.slice(type.length + 1);
  if (!rest) return loc;
  if (rest.length > 20)
    return `${type}: ${rest.slice(0, 8)}...${rest.slice(-8)}`;
  return `${type}: ${rest}`;
}

// We want to cache the signers so we don't have to fetch them every time we change tabs
let signersCache: any[] | null = null;

export default function Signers() {
  const { wallet, createDeviceSigner } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [signers, setSigners] = useState<any[]>(signersCache || []);
  const [signerType, setSignerType] = useState<SignerType>("device");
  const [externalAddress, setExternalAddress] = useState("");
  const [selectedSigner, setSelectedSigner] = useState<any>(null);
  const [selectedLocator, setSelectedLocator] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [recoveryNeeded, setRecoveryNeeded] = useState<boolean | null>(null);

  const loadSigners = async () => {
    if (wallet != null) {
      const result = await wallet.signers();
      setSigners(result ?? []);
      signersCache = result ?? [];
    }
  };

  useEffect(() => {
    loadSigners();
  }, [wallet]);

  const selectSigner = (s: any) => {
    const locator = getSignerLocator(s);
    setSelectedSigner(s);
    setSelectedLocator(locator);
  };

  const handleUseSigner = async () => {
    if (wallet == null) return;
    setStatusMessage("");
    try {
      if (!selectedSigner?.type) {
        setStatusMessage("Select a registered signer first");
        return;
      }
      const { status: _s, ...config } = selectedSigner;
      await wallet.useSigner(config as any);
      setStatusMessage(
        `Active signer: ${selectedSigner.type} (${selectedSigner.locator})`
      );
    } catch (e: any) {
      setStatusMessage(`useSigner error: ${e.message ?? e}`);
    }
  };

  const handleAddSigner = async () => {
    if (wallet == null) {
      Alert.alert("No wallet connected");
      return;
    }
    try {
      setIsLoading(true);
      setStatusMessage("");
      let signer: any;
      if (signerType === "device") {
        const descriptor = await createDeviceSigner?.();
        if (!descriptor) throw new Error("createDeviceSigner not available");
        signer = descriptor;
      } else {
        if (!externalAddress) {
          Alert.alert(
            "Error adding signer",
            "No address provided, please enter a valid wallet address"
          );
          return;
        }
        signer = { type: "external-wallet", address: externalAddress };
      }
      await wallet.addSigner(signer as any);
      setStatusMessage(`Added ${signerType} signer`);
      setExternalAddress("");
      await loadSigners();
    } catch (err: any) {
      Alert.alert("Error adding signer", `${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkRecovery = () => {
    if (!wallet) return;
    setRecoveryNeeded(wallet.needsRecovery());
  };

  const handleRecover = async () => {
    if (!wallet) return;
    setStatusMessage("");
    try {
      await wallet.recover();
      setStatusMessage("Recovery complete");
      setRecoveryNeeded(false);
    } catch (e: any) {
      setStatusMessage(`Recovery error: ${e.message ?? e}`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Signers</Text>
      <Text style={styles.sectionSubtitle}>
        Manage signers that can sign transactions on behalf of your wallet.{" "}
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

      {/* Registered Signers List */}
      <View style={styles.signersContainer}>
        <View style={styles.signersSectionHeader}>
          <Text style={styles.signersTitle}>Registered signers</Text>
          <TouchableOpacity onPress={loadSigners}>
            <Text style={styles.refreshLink}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Recovery signer */}
        {wallet &&
          (() => {
            const recovery = (wallet as any).recovery;
            if (!recovery) return null;
            const locator = getSignerLocator(recovery);
            const isSelected = locator === selectedLocator;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedSigner(recovery);
                  setSelectedLocator(locator);
                }}
                style={[
                  styles.signerItem,
                  styles.recoverySignerItem,
                  isSelected && styles.selectedSignerItem,
                ]}
              >
                <Text style={styles.signerItemLabel}>
                  {formatSignerLabel(recovery)} (recovery)
                </Text>
                <Text style={styles.signerItemLocator}>{locator}</Text>
              </TouchableOpacity>
            );
          })()}

        {/* Operational signers */}
        {signers.length === 0 && (
          <Text style={styles.emptySignersText}>No signers loaded</Text>
        )}
        {signers.map((s, i) => {
          const locator = getSignerLocator(s);
          const isSelected = locator === selectedLocator;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => selectSigner(s)}
              style={[
                styles.signerItem,
                isSelected && styles.selectedSignerItem,
              ]}
            >
              <Text style={styles.signerItemLabel}>
                {formatSignerLabel(s)}
              </Text>
              <Text style={styles.signerItemLocator}>{locator}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Use Signer */}
      <View style={styles.useSignerSection}>
        <Text style={styles.subsectionTitle}>Use Signer</Text>
        <Text style={styles.subsectionDescription}>
          Tap a registered signer above to select it.
        </Text>
        <View style={styles.selectedSignerDisplay}>
          <Text
            style={[
              styles.selectedSignerText,
              !selectedLocator && styles.selectedSignerPlaceholder,
            ]}
          >
            {selectedLocator || "No signer selected"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, !selectedLocator && styles.buttonDisabled]}
          onPress={handleUseSigner}
          disabled={!selectedLocator}
        >
          <Text style={styles.buttonText}>Use Signer</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Add Signer */}
      <Text style={styles.subsectionTitle}>Add New Signer</Text>
      <Text style={styles.subsectionDescription}>
        Create and register a new signer on this wallet.
      </Text>
      <View style={styles.signerTypeSelector}>
        {SIGNER_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => {
              setSignerType(t);
              setExternalAddress("");
            }}
            style={[
              styles.signerTypeButton,
              signerType === t && styles.signerTypeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.signerTypeButtonText,
                signerType === t && styles.signerTypeButtonTextActive,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {signerType === "external-wallet" && (
        <TextInput
          style={styles.input}
          placeholder="Wallet address (e.g. 0x1234...)"
          value={externalAddress}
          onChangeText={setExternalAddress}
          autoCapitalize="none"
        />
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleAddSigner}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Add Signer</Text>
        )}
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Recovery */}
      <Text style={styles.subsectionTitle}>Recovery</Text>
      <View style={styles.recoveryButtonsRow}>
        <TouchableOpacity
          style={[styles.recoveryButton, styles.recoveryCheckButton]}
          onPress={checkRecovery}
        >
          <Text style={styles.recoveryCheckButtonText}>Check</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.recoveryButton, styles.button]}
          onPress={handleRecover}
        >
          <Text style={styles.buttonText}>Recover</Text>
        </TouchableOpacity>
      </View>
      {recoveryNeeded !== null && (
        <Text style={styles.recoveryStatus}>
          Needs recovery: {recoveryNeeded ? "Yes" : "No"}
        </Text>
      )}

      {/* Status Message */}
      {statusMessage !== "" && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    backgroundColor: "#fff",
  },
  signersContainer: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  signersSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  signersTitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  refreshLink: {
    color: "#05b959",
    fontWeight: "500",
    fontSize: 14,
  },
  signerItem: {
    padding: 8,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recoverySignerItem: {
    backgroundColor: "#FFF7ED",
    borderColor: "#F59E0B",
  },
  selectedSignerItem: {
    backgroundColor: "#e8fae6",
    borderColor: "#05b959",
  },
  signerItemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
  signerItemLocator: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 1,
  },
  emptySignersText: {
    fontSize: 12,
    color: "#6b7280",
  },
  useSignerSection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  subsectionDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },
  selectedSignerDisplay: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedSignerText: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  selectedSignerPlaceholder: {
    color: "#9ca3af",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  signerTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  signerTypeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  signerTypeButtonActive: {
    backgroundColor: "#1e293b",
    borderColor: "#1e293b",
  },
  signerTypeButtonText: {
    fontSize: 12,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  signerTypeButtonTextActive: {
    color: "#fff",
  },
  recoveryButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  recoveryButton: {
    flex: 1,
  },
  recoveryCheckButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recoveryCheckButtonText: {
    fontWeight: "500",
    color: "#0f172a",
  },
  recoveryStatus: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
  },
  statusContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#0f172a",
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
