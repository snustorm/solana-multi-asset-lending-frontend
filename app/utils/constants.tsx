import { PublicKey } from '@solana/web3.js';

export const USER_SEED = "user";
export const BANK_TOKEN_ACCOUNT_SEED = "treasury";
export const USER_TOKEN_SEED = "user-token";

export const PROGRAM_ID = new PublicKey(
    "FYFjEBY8QnmqR1H9QMEJHDUap4VKfBWW8C3XYr8R8JNs"
);

export const SOL_PRICE_FEED_ID =
'0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

export const USDC_PRICE_FEED_ID =
'0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a';  

export const USDC_MINT = new PublicKey(
    "7FWtEtVqnzsMS3y5sKsexV2SWBnzwLPwUzrAdxEHYaeV"
);

export const SOL_MINT = new PublicKey(
    "GC2F2Z4o1J4c4FYKnDhdjAxoD3MoH9tVDjhvkz5AWNgd"
);


export const priceFeedMap: Record<string, string> = {
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    USDC: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
    // Add other assets here with their respective price feed IDs
  };