# Alfred - Combined CDP, Twitter & Farcaster AgentKit LangChain Extension Example

This example demonstrates an agent setup as a terminal style chatbot with access to CDP AgentKit actions, Twitter (X) API actions, and Farcaster API actions in a single interface.

## Ask the chatbot to engage in Web3 and Social Media ecosystems!

### Blockchain (CDP) Actions:
- "Transfer a portion of your ETH to a random address"
- "What is the price of BTC?"
- "Deploy an NFT that will go super viral!"
- "Deploy an ERC-20 token with total supply 1 billion"

### Twitter (X) Actions:
- "What are my account details?"
- "Please post a message to Twitter"
- "Please get my mentions"
- "Please post responses to my mentions"

### Farcaster Actions:
- "What are my Farcaster account details?"
- "Post a cast about Web3"
- "Get my recent casts"
- "Interact with trending casts"

## Prerequisites

### Checking Node Version

Before using the example, ensure that you have the correct version of Node.js installed. The example requires Node.js 18 or higher. You can check your Node version by running:

```bash
node --version
```

If you don't have the correct version, you can install it using [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install node
```

### Twitter Application Setup

1. Visit the Twitter (X) [Developer Portal](https://developer.x.com/en/portal/dashboard)
2. Navigate to your project
3. Navigate to your application
4. Edit "User authentication settings"
5. Set "App permissions" to "Read and write and Direct message"
6. Set "Type of App" to "Web App, Automated app or Bot"
7. Set "App info" urls
8. Save
9. Navigate to "Keys and tokens"
10. Regenerate all keys and tokens

### Farcaster Setup

1. Visit [Neynar](https://neynar.com/) to get started with Farcaster API
2. Create an account and get your API keys
3. Follow their documentation for additional setup steps

### API Keys

You'll need the following API keys:
- [CDP API Key](https://portal.cdp.coinbase.com/access/api)
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)
- [Twitter (X) API Keys](https://developer.x.com/en/portal/dashboard)
- [Farcaster API Keys](https://neynar.com/)

Once you have them, rename the `.env-local` file to `.env` and make sure you set the API keys to their corresponding environment variables:

CDP Related:
- "CDP_API_KEY_NAME"
- "CDP_API_KEY_PRIVATE_KEY"
- "OPENAI_API_KEY"

Twitter Related:
- "TWITTER_ACCESS_TOKEN"
- "TWITTER_ACCESS_TOKEN_SECRET"
- "TWITTER_API_KEY"
- "TWITTER_API_SECRET"

Farcaster Related:
- "FARCASTER_API_KEY"
- "FARCASTER_MNEMONIC"

Optional:
- "NETWORK_ID" (defaults to base-sepolia if not set)

## Running the example

From the root directory, run:

```bash
npm install
npm run build
```

This will install the dependencies and build the packages locally. The chatbot example uses the local `@coinbase/agentkit-langchain` and `@coinbase/agentkit` packages. If you make changes to the packages, you can run `npm run build` from root again to rebuild the packages, and your changes will be reflected in the chatbot example.

Now from the `typescript/examples/alfred` directory, run:

```bash
npm start
```

Select either:
1. "chat mode" - For interactive conversations
2. "auto mode" - For autonomous operation

The agent can now perform blockchain operations, Twitter interactions, and Farcaster interactions all in the same conversation!

## License

Apache-2.0 