import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-native-ui";

export default function Login() {
  const { loginWithOAuth, createAuthSession, user, crossmintAuth } =
    useCrossmintAuth();
  const [email, setEmail] = useState("");
  const [emailId, setEmailId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (user != null) {
      router.push("/");
    }
  }, [user]);

  const sendOtp = async () => {
    setIsPending(true);
    const res = await crossmintAuth?.sendEmailOtp(email);
    setEmailId(res.emailId);
    setOtpSent(true);
    setIsPending(false);
  };

  const verifyOtp = async () => {
    setIsPending(true);
    const oneTimeSecret = await crossmintAuth?.confirmEmailOtp(
      email,
      emailId,
      otp
    );
    await createAuthSession(oneTimeSecret);
    setIsPending(false);
  };

  return (
    <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/crossmint-logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Wallets Quickstart</Text>
      <Text style={styles.subtitle}>
        Create and interact with Crossmint wallets
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => loginWithOAuth("google")}
      >
        <View style={styles.buttonIconContainer}>
          <Image
            source={require("../assets/images/google.png")}
            style={styles.googleIcon}
          />
        </View>
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
          Sign in with Google
        </Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="beatriz@paella.dev"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        editable={!otpSent}
      />

      {!otpSent ? (
        <TouchableOpacity
          style={styles.button}
          onPress={sendOtp}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP code"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            value={otp}
            onChangeText={setOtp}
          />
          <View style={styles.otpButtonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={verifyOtp}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setOtpSent(false)}
              disabled={isPending}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.poweredByContainer}>
        <Image
          source={require("../assets/images/secured-by-crossmint.png")}
          style={styles.poweredByIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 180,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  orContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    fontSize: 14,
    color: "#666",
  },
  poweredByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  poweredByIcon: {
    width: 400,
    height: 20,
    resizeMode: "contain",
  },
  otpButtonsContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#05b959",
    borderRadius: 8,
    width: "100%",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8E8E9",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  buttonTextSecondary: {
    color: "#000",
  },
  buttonIconContainer: {
    marginRight: 8,
  },
});
