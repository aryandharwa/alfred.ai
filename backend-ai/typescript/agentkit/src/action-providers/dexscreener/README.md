# DexScreener Action Provider

This action provider enables interaction with the DexScreener API to fetch token profiles and related information.

## Features

- Get latest token profiles (rate-limited to 60 requests per minute)

## Usage

```typescript
import { DexScreenerActionProvider } from "@coinbase/agentkit";

// Create a new instance of the provider
const provider = new DexScreenerActionProvider();

// Get the available actions
const actions = provider.getActions();

// Execute the getLatestTokenProfiles action
const profiles = await actions[0].execute({});
```

## Configuration

The provider accepts the following configuration options:

```typescript
interface DexScreenerActionProviderOptions {
  baseUrl?: string; // Optional custom base URL for the API
}
```

### Example with custom base URL

```typescript
const provider = new DexScreenerActionProvider({
  baseUrl: "https://custom.api.example.com",
});
```

## Available Actions

### getLatestTokenProfiles

Fetches the latest token profiles from DexScreener.

**Input**: Empty object (no parameters required)

**Output**: Array of token profiles with the following structure:

```typescript
interface TokenProfile {
  url: string;          // URL of the token profile
  chainId: string;      // Chain ID of the token
  tokenAddress: string; // Contract address of the token
  icon: string;         // Icon URL of the token
  header: string;       // Header image URL of the token
  description: string;  // Description of the token
  links: {
    type: string;       // Type of the link
    label: string;      // Label of the link
    url: string;        // URL of the link
  }[];
}
```

**Rate Limit**: 60 requests per minute

## Error Handling

The provider includes comprehensive error handling for:
- API request failures
- Rate limit exceeded
- Invalid response data
- Network issues

Errors are thrown with descriptive messages that can be caught and handled by the application. 