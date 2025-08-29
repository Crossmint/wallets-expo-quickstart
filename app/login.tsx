import React from "react";
import {
  useStytch,
  StytchUI,
  RNUIProducts,
  OTPMethods,
} from "@stytch/react-native";

export default function Login() {
  const config = {
    productConfig: {
      products: [RNUIProducts.otp],
      otpOptions: {
        methods: [OTPMethods.WhatsApp, OTPMethods.SMS],
        expirationMinutes: 10,
      },
    },
  } as any;

  const stytch = useStytch();

  return <StytchUI client={stytch} config={config}></StytchUI>;
}
