import {
  CrossmintAuthProvider,
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-native-ui";

type ProvidersProps = {
  children: React.ReactNode;
};

const chain = (process.env.EXPO_PUBLIC_CHAIN ?? "solana") as any;

export default function CrossmintProviders({ children }: ProvidersProps) {
  const apiKey = process.env.EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY;
  if (apiKey == null) {
    throw new Error("EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY is not set");
  }

  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: chain,
            signer: {
              type: "email",
            },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
