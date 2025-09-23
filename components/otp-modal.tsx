import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";

interface OTPModalProps {
  visible: boolean;
  otpCode: string;
  isVerifying: boolean;
  onOtpCodeChange: (code: string) => void;
  onVerifyOTP: () => void;
  onCancel: () => void;
}

export default function OTPModal({
  visible,
  otpCode,
  isVerifying,
  onOtpCodeChange,
  onVerifyOTP,
  onCancel,
}: OTPModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Approve Transaction</Text>
            <Text style={styles.modalSubtitle}>
              Enter the verification code sent to your email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter 9-digit code"
              value={otpCode}
              onChangeText={onOtpCodeChange}
              keyboardType="number-pad"
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerifying && styles.buttonDisabled,
              ]}
              onPress={onVerifyOTP}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isVerifying}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
  },
  verifyButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
