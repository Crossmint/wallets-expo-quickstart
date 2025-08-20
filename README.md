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

Create and interact with Crossmint wallets using Crossmint Auth to handle user authentication.

**Learn how to:**
- Create a wallet
- View its balance for SOL and SPL tokens
- Send a transaction
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
```

6. Run the app:

```bash
npx expo run:ios && npx expo run:android
```


## Using in production

1. Create a [production API key](https://docs.crossmint.com/introduction/platform/api-keys/client-side).

2. **Important**: Add your mobile app identifiers to the production API key:
   - For iOS: Add your bundle ID (e.g., `com.company.appname`)
   - For Android: Add your package name (e.g., `com.company.appname`)
   
   This step is critical as production enforces mobile app identifier whitelisting strictly, unlike staging. Failure to whitelist your app identifiers will cause requests to fail silently in production.

3. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key
```

For detailed instructions on mobile app identifier setup, see the [Mobile App Identifiers documentation](https://docs.crossmint.com/introduction/platform/api-keys/client-side#mobile-app-identifiers).
