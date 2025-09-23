<div align="center">
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/8b617791-cd37-4a5a-8695-a7c9018b7c70" />
<br>
<br>
<h1>Wallets Expo Quickstart</h1>

<div align="center">
<a href="https://docs.crossmint.com/introduction/platform/wallets">Docs</a> | <a href="https://crossmint.com/quickstarts">See all quickstarts</a>
</div>
</div>

## Introduction

Create and interact with Crossmint wallets. This quickstart uses Crossmint Auth and uses your email as a signer for that wallet.

**Learn how to:**

- Create a wallet
- View its balance for USDXM (USDXM is a test stablecoin by Crossmint) and native tokens
- View wallet transaction activity
- Send USDXM or native tokens to another wallet
- Add delegated signers to allow third parties to sign transactions on behalf of your wallet

## Setup

1. Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/crossmint/wallets-expo-quickstart.git && cd wallets-expo-quickstart
```

2. Install all dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up the environment variables:

```bash
cp .env.template .env
```

4. Set up your Crossmint client API key:

   a. Create a developer account in the Crossmint [Staging Console](https://staging.crossmint.com/console). Open that link, sign in, and accept the dialog to continue.

   b. Get the **client API key** from the overview page of your project.

5. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key

# Check all supported chains: https://docs.crossmint.com/introduction/supported-chains
EXPO_PUBLIC_CHAIN=your_chain // optional, default is solana
```

6. Run the app:

```bash
npx expo run:ios && npx expo run:android
```

## Using in production

1. Create a [production API key](https://docs.crossmint.com/introduction/platform/api-keys/client-side).

2. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key
```
