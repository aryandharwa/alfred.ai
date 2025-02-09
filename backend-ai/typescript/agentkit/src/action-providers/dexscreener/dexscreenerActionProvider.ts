import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CreateAction } from "../actionDecorator";
import {
  GetLatestTokenProfilesInput,
  GetLatestTokenProfilesInputSchema,
  GetLatestTokenProfilesOutputSchema,
  GetLatestTokenBoostsInput,
  GetLatestTokenBoostsInputSchema,
  GetLatestTokenBoostsOutputSchema,
  GetTopTokenBoostsInput,
  GetTopTokenBoostsInputSchema,
  GetTopTokenBoostsOutputSchema,
  CheckTokenOrdersInput,
  CheckTokenOrdersInputSchema,
  CheckTokenOrdersOutputSchema,
  GetPairDetailsInput,
  GetPairDetailsInputSchema,
  GetPairDetailsOutputSchema,
} from "./schemas";

/**
 * Configuration options for DexScreener action provider
 */
export interface DexScreenerActionProviderConfig {
  baseUrl?: string;
}

/**
 * DexScreener action provider for interacting with DexScreener API
 */
export class DexScreenerActionProvider extends ActionProvider {
  private readonly baseUrl: string;

  constructor(config: DexScreenerActionProviderConfig = {}) {
    // Initialize with provider name and empty dependencies array
    super("dexscreener", []);
    this.baseUrl = config.baseUrl || "https://api.dexscreener.com";
  }

  /**
   * Get the latest token profiles from DexScreener
   * Rate limit: 60 requests per minute
   */
  @CreateAction({
    name: "get_latest_token_profiles",
    description: `
Get the latest token profiles from DexScreener.
Rate limit: 60 requests per minute

A successful response will return an array of token profiles with details like URL, chain ID, token address, etc.
A failure response will return an error message with the reason for failure.`,
    schema: GetLatestTokenProfilesInputSchema,
  })
  async getLatestTokenProfiles(
    _input: GetLatestTokenProfilesInput
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/token-profiles/latest/v1`, {
        method: "GET",
        headers: {}
      });

      if (!response.ok) {
        throw new Error(
          `DexScreener API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get latest token profiles: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the latest boosted tokens from DexScreener
   * Rate limit: 60 requests per minute
   */
  @CreateAction({
    name: "get_latest_token_boosts",
    description: `
Get the latest boosted tokens from DexScreener.
Rate limit: 60 requests per minute

A successful response will return an array of boosted tokens with details like URL, chain ID, token address, boost amount, etc.
A failure response will return an error message with the reason for failure.`,
    schema: GetLatestTokenBoostsInputSchema,
  })
  async getLatestTokenBoosts(
    _input: GetLatestTokenBoostsInput
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/token-boosts/latest/v1`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `DexScreener API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const parsedData = GetLatestTokenBoostsOutputSchema.parse(data);
      return JSON.stringify(parsedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get latest token boosts: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the tokens with most active boosts from DexScreener
   * Rate limit: 60 requests per minute
   */
  @CreateAction({
    name: "get_top_token_boosts",
    description: `
Get the tokens with most active boosts from DexScreener.
Rate limit: 60 requests per minute

A successful response will return an array of tokens sorted by active boost count.
A failure response will return an error message with the reason for failure.`,
    schema: GetTopTokenBoostsInputSchema,
  })
  async getTopTokenBoosts(
    _input: GetTopTokenBoostsInput
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/token-boosts/top/v1`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `DexScreener API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const parsedData = GetTopTokenBoostsOutputSchema.parse(data);
      return JSON.stringify(parsedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get top token boosts: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check orders paid for a specific token
   * Rate limit: 60 requests per minute
   */
  @CreateAction({
    name: "check_token_orders",
    description: `
Check orders paid for a specific token on DexScreener.
Rate limit: 60 requests per minute

Required parameters:
- chainId: The chain ID of the token (e.g., "solana")
- tokenAddress: The token address to check orders for

A successful response will return an array of orders with their status and payment details.
A failure response will return an error message with the reason for failure.`,
    schema: CheckTokenOrdersInputSchema,
  })
  async checkTokenOrders(
    input: CheckTokenOrdersInput
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/orders/v1/${input.chainId}/${input.tokenAddress}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `DexScreener API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const parsedData = CheckTokenOrdersOutputSchema.parse(data);
      return JSON.stringify(parsedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check token orders: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get pair details by chain and pair address
   * Rate limit: 300 requests per minute
   */
  @CreateAction({
    name: "get_pair_details",
    description: `
Get detailed information about one or multiple pairs by chain and pair address.
Rate limit: 300 requests per minute

Required parameters:
- chainId: The chain ID of the pair (e.g., "solana")
- pairId: The pair address to get details for

A successful response will return detailed information about the pair(s) including price, volume, liquidity, etc.
A failure response will return an error message with the reason for failure.`,
    schema: GetPairDetailsInputSchema,
  })
  async getPairDetails(
    input: GetPairDetailsInput
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/latest/dex/pairs/${input.chainId}/${input.pairId}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `DexScreener API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const parsedData = GetPairDetailsOutputSchema.parse(data);
      return JSON.stringify(parsedData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get pair details: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Checks if the DexScreener action provider supports the given network.
   * DexScreener actions don't depend on blockchain networks directly.
   */
  supportsNetwork(_network: Network): boolean {
    return true;
  }
}

/**
 * Factory function to create a new DexScreenerActionProvider instance.
 *
 * @param config - The configuration options for the DexScreenerActionProvider
 * @returns A new instance of DexScreenerActionProvider
 */
export const dexscreenerActionProvider = (config: DexScreenerActionProviderConfig = {}) =>
  new DexScreenerActionProvider(config); 