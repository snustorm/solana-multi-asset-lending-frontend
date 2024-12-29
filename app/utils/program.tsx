import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from "@solana/web3.js";
import { priceFeedMap } from './constants'; 
import type { Lending2 } from "./lending2";  
import IDL from "./lending2.json"; 


import {
    USER_SEED,
    USER_TOKEN_SEED,
    BANK_TOKEN_ACCOUNT_SEED,
    PROGRAM_ID,
} from "./constants";

import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

export const getProgram = (connection: Connection, wallet: AnchorWallet | null) => {
    const provider = new AnchorProvider(
      connection,
      wallet || {
        publicKey: new PublicKey("11111111111111111111111111111111"), // Dummy public key
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      },
      {
        commitment: "confirmed",
      }
    );
    // @ts-expect-error: Lending2 type is missing properties required by Idl, but it is functional in this context.
    const program = new Program<Lending2>(IDL as Idl, provider);
  
    return program;
  };

export const getUserAddress = (signer: PublicKey): PublicKey => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(USER_SEED),
            signer.toBuffer(),
        ], 
        PROGRAM_ID
    )[0];
};

export const getUserTokenAccountAddress = (payer: PublicKey, mint: PublicKey) : PublicKey => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(USER_TOKEN_SEED),
            payer.toBuffer(),
            mint.toBuffer(), 
        ],
        PROGRAM_ID)[0];
}

export const getBankAccountAddress = (mint: PublicKey) : PublicKey=> {
    return PublicKey.findProgramAddressSync(
        [
            mint.toBuffer(),
        ],
        PROGRAM_ID)[0]
}

export const getBankTokenAccountAddress = (mint: PublicKey) : PublicKey=> {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(BANK_TOKEN_ACCOUNT_SEED),
            mint.toBuffer(),
        ],
        PROGRAM_ID)[0]
}

export const getAllAssetPrices = async (): Promise<Record<string, number>> => {
    try {
      // Initialize the PriceServiceConnection with the Hermes URL
      const connection = new PriceServiceConnection("https://hermes.pyth.network");
  
      // Get all the price feed IDs from the priceFeedMap
      const priceIds = Object.values(priceFeedMap);
  
      // Fetch the latest prices for all the given price IDs
      const currentPrices = await connection.getLatestPriceFeeds(priceIds);

      // Initialize an empty object to store asset prices
      const assetPrices: Record<string, number> = {};
  
      // Iterate through the price feed map to fetch and convert prices
      Object.entries(priceFeedMap).forEach(([assetName, feedId], index) => {
        
        console.log(feedId);
        if (currentPrices && currentPrices[index]) {
          const feed = currentPrices[index];
          const priceStruct = feed.getPriceNoOlderThan(200); // Fetch recent price
          if (priceStruct && priceStruct.price && priceStruct.expo !== undefined) {
            // Convert price to real value
            const realPrice = parseFloat(priceStruct.price) * Math.pow(10, priceStruct.expo);
            assetPrices[assetName] = realPrice; // Use the asset name as the key
          } else {
                                                                               console.warn(`Incomplete price data for asset: ${assetName}`);
          }
        } else {
          console.warn(`Price feed n                                ot available for asset: ${assetName}`);
        }
      });
  
      console.log("Fetched all asset prices:", assetPrices);
      return assetPrices;
    } catch (error) {
      console.error("Error fetching all asset prices:", error);
      throw new Error("Failed to fetch all asset prices.");
    }
  };