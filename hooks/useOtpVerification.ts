import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useWalletEmailSigner } from "@crossmint/client-sdk-react-native-ui";

export function useOTPVerification() {
  const { needsAuth, sendEmailWithOtp, verifyOtp } = useWalletEmailSigner();

  // OTP verification states
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  useEffect(() => {
    const handleNeedsAuth = async () => {
      if (needsAuth) {
        try {
          await sendEmailWithOtp();
          setIsVerifyingOTP(true);
        } catch (error) {
          Alert.alert("Error", `Failed to send OTP email: ${error}`);
        }
      }
    };

    handleNeedsAuth();
  }, [needsAuth, sendEmailWithOtp]);

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    try {
      setIsVerifyingCode(true);
      await verifyOtp(otpCode);
      setIsVerifyingOTP(false);
      setOtpCode("");
    } catch (error) {
      Alert.alert("Error", `Failed to verify OTP: ${error}`);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleCancelOTP = () => {
    setIsVerifyingOTP(false);
    setOtpCode("");
  };

  return {
    // States
    isVerifyingOTP,
    otpCode,
    isVerifyingCode,

    // Actions
    setOtpCode,
    handleVerifyOTP,
    handleCancelOTP,
  };
}
