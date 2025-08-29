<div align="center">
<img width="200" alt="Image" src="https://github.com/user-attachments/assets/8b617791-cd37-4a5a-8695-a7c9018b7c70" />
<br>
<br>
<h1>Wallets Expo Quickstart with Stytch</h1>

<div align="center">
<a href="https://docs.crossmint.com/introduction/platform/wallets">Docs</a> | <a href="https://crossmint.com/quickstarts">See all quickstarts</a>
</div>
</div>

## Introduction

Create and interact with Crossmint wallets. This quickstart uses [Stytch Auth](https://stytch.com/) and uses your phone number as a signer for that wallet.

**Learn how to:**
- Create a wallet
- View its balance for SOL and SPL tokens
- Send a transaction
- Add delegated signers to allow third parties to sign transactions on behalf of your wallet

## Setup

1. Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/crossmint/wallets-expo-quickstart.git && cd wallets-expo-quickstart
git fetch --all
git checkout stytch-auth
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

5. Create a Stytch project, enable a frontend SDK and get the public token for it.
```bash
EXPO_PUBLIC_STYTCH_PUBLIC_TOKEN=your_public_token
```

6. On your Stytch SDK configuration enable the `Authorized bundle & application IDs` and add the following:

```bash
com.crossmint.wallets
```
 
7. In the Crossmint console go to [API keys](https://console.crossmint.com/api-keys) and [set third party authentication](https://docs.crossmint.com/introduction/platform/api-keys/jwt-authentication#third-party-authentication) to `Stytch` with your Stytch public token.


8. Run the app:

```bash
npx expo run:ios && npx expo run:android
```


## Using in production

1. Create a [production API key](https://docs.crossmint.com/introduction/platform/api-keys/client-side).

2. Add the API key to the `.env` file.

```bash
EXPO_PUBLIC_CLIENT_CROSSMINT_API_KEY=your_api_key
```

3. Set up Stytch for production and repeat steps 5 and 6 above in your production environment.
