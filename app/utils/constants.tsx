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
    USDT: '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    sSOL: '0xadd6499a420f809bbebc0b22fbf68acb8c119023897f6ea801688e0d6e391af4',
    RAY: '0x91568baa8beb53db23eb3fb7f22c6e8bd303d103919e19733f2bb642d3e7987a',
    JUP: '0x0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996',
    // Add other assets here with their respective price feed IDs
  };