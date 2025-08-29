import {
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-native-ui";
import { StytchClient, StytchProvider } from "@stytch/react-native";


type ProvidersProps = {
  children: React.ReactNode;
};

export default function CrossmintProviders({ children }: ProvidersProps) {
  const apiKey = process.env.EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY;

  if (apiKey == null) {
    throw new Error("EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY is not set");
  }

  const stytchPublicToken = process.env.EXPO_PUBLIC_STYTCH_PUBLIC_TOKEN;

  if (stytchPublicToken == null) {
    throw new Error("EXPO_PUBLIC_STYTCH_PUBLIC_TOKEN is not set");
  }

  const stytch = new StytchClient(stytchPublicToken);
  return (
    <StytchProvider stytch={stytch}>
      <CrossmintProvider apiKey={apiKey}>
        <CrossmintWalletProvider>
          {children}
        </CrossmintWalletProvider>
      </CrossmintProvider>
    </StytchProvider>
  );
}
