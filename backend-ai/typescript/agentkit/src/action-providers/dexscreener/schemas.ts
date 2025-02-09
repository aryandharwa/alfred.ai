import { z } from "zod";

/**
 * Link object schema for DexScreener token profile
 */
export const DexScreenerLinkSchema = z.object({
  type: z.string().optional(),
  label: z.string().optional(),
  url: z.string(),
}).passthrough();

/**
 * Response schema for DexScreener token profile
 */
export const DexScreenerTokenProfileSchema = z.object({
  url: z.string(),
  chainId: z.string(),
  tokenAddress: z.string(),
  icon: z.string().optional().nullable(),
  header: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  links: z.array(DexScreenerLinkSchema).optional().nullable(),
}).passthrough();

/**
 * Token boost schema for DexScreener
 */
export const DexScreenerTokenBoostSchema = z.object({
  url: z.string(),
  chainId: z.string(),
  tokenAddress: z.string(),
  amount: z.number(),
  totalAmount: z.number(),
  icon: z.string().optional().nullable(),
  header: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  links: z.array(DexScreenerLinkSchema).optional().nullable(),
}).passthrough();

/**
 * Order status schema for DexScreener
 */
export const DexScreenerOrderSchema = z.object({
  type: z.string().describe("Type of the order"),
  status: z.string().describe("Status of the order"),
  paymentTimestamp: z.number().describe("Timestamp of the payment"),
});

/**
 * Token info schema for pairs
 */
export const DexScreenerTokenInfoSchema = z.object({
  address: z.string().describe("Token address"),
  name: z.string().describe("Token name"),
  symbol: z.string().describe("Token symbol"),
});

/**
 * Transaction info schema for pairs
 */
export const DexScreenerTxnInfoSchema = z.record(
  z.object({
    buys: z.number().describe("Number of buy transactions"),
    sells: z.number().describe("Number of sell transactions"),
  })
);

/**
 * Website info schema for pairs
 */
export const DexScreenerWebsiteSchema = z.object({
  url: z.string().url().describe("Website URL"),
});

/**
 * Social info schema for pairs
 */
export const DexScreenerSocialSchema = z.object({
  platform: z.string().describe("Social media platform"),
  handle: z.string().describe("Social media handle"),
});

/**
 * Pair info schema for DexScreener
 */
export const DexScreenerPairSchema = z.object({
  chainId: z.string().describe("Chain ID"),
  dexId: z.string().describe("DEX identifier"),
  url: z.string().url().describe("Pair URL"),
  pairAddress: z.string().describe("Pair contract address"),
  labels: z.array(z.string()).describe("Labels associated with the pair"),
  baseToken: DexScreenerTokenInfoSchema.describe("Base token information"),
  quoteToken: DexScreenerTokenInfoSchema.describe("Quote token information"),
  priceNative: z.string().describe("Price in native token"),
  priceUsd: z.string().describe("Price in USD"),
  txns: DexScreenerTxnInfoSchema.describe("Transaction information"),
  volume: z.record(z.number()).describe("Volume information"),
  priceChange: z.record(z.number()).describe("Price change information"),
  liquidity: z.object({
    usd: z.number().describe("Liquidity in USD"),
    base: z.number().describe("Base token liquidity"),
    quote: z.number().describe("Quote token liquidity"),
  }).describe("Liquidity information"),
  fdv: z.number().describe("Fully diluted valuation"),
  marketCap: z.number().describe("Market capitalization"),
  pairCreatedAt: z.number().describe("Pair creation timestamp"),
  info: z.object({
    imageUrl: z.string().url().optional().describe("Token image URL"),
    websites: z.array(DexScreenerWebsiteSchema).describe("Associated websites"),
    socials: z.array(DexScreenerSocialSchema).describe("Social media links"),
  }).describe("Additional pair information"),
  boosts: z.object({
    active: z.number().describe("Number of active boosts"),
  }).describe("Boost information"),
});

// Input/Output schemas for actions

export const GetLatestTokenProfilesInputSchema = z
.object({})
.strip()
.describe("No input parameters required");

export const GetLatestTokenProfilesOutputSchema = z.array(DexScreenerTokenProfileSchema).describe(
  "Array of latest token profiles"
);

export const GetLatestTokenBoostsInputSchema = z.object({}).describe("No input parameters required");
export const GetLatestTokenBoostsOutputSchema = z.array(DexScreenerTokenBoostSchema).describe(
  "Array of latest token boosts"
);

export const GetTopTokenBoostsInputSchema = z.object({}).describe("No input parameters required");
export const GetTopTokenBoostsOutputSchema = z.array(DexScreenerTokenBoostSchema).describe(
  "Array of tokens with most active boosts"
);

export const CheckTokenOrdersInputSchema = z.object({
  chainId: z.string().describe("Chain ID of the token"),
  tokenAddress: z.string().describe("Token address to check orders for"),
});
export const CheckTokenOrdersOutputSchema = z.array(DexScreenerOrderSchema).describe(
  "Array of orders for the token"
);

export const GetPairDetailsInputSchema = z.object({
  chainId: z.string().describe("Chain ID of the pair"),
  pairId: z.string().describe("Pair address to get details for"),
});
export const GetPairDetailsOutputSchema = z.object({
  schemaVersion: z.string().describe("Schema version"),
  pairs: z.array(DexScreenerPairSchema).describe("Array of pair details"),
});

// Type exports
export type DexScreenerLink = z.infer<typeof DexScreenerLinkSchema>;
export type DexScreenerTokenProfile = z.infer<typeof DexScreenerTokenProfileSchema>;
export type DexScreenerTokenBoost = z.infer<typeof DexScreenerTokenBoostSchema>;
export type DexScreenerOrder = z.infer<typeof DexScreenerOrderSchema>;
export type DexScreenerPair = z.infer<typeof DexScreenerPairSchema>;

export type GetLatestTokenProfilesInput = z.infer<typeof GetLatestTokenProfilesInputSchema>;
export type GetLatestTokenProfilesOutput = z.infer<typeof GetLatestTokenProfilesOutputSchema>;

export type GetLatestTokenBoostsInput = z.infer<typeof GetLatestTokenBoostsInputSchema>;
export type GetLatestTokenBoostsOutput = z.infer<typeof GetLatestTokenBoostsOutputSchema>;

export type GetTopTokenBoostsInput = z.infer<typeof GetTopTokenBoostsInputSchema>;
export type GetTopTokenBoostsOutput = z.infer<typeof GetTopTokenBoostsOutputSchema>;

export type CheckTokenOrdersInput = z.infer<typeof CheckTokenOrdersInputSchema>;
export type CheckTokenOrdersOutput = z.infer<typeof CheckTokenOrdersOutputSchema>;

export type GetPairDetailsInput = z.infer<typeof GetPairDetailsInputSchema>;
export type GetPairDetailsOutput = z.infer<typeof GetPairDetailsOutputSchema>; 