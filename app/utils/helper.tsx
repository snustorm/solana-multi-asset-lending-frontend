import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

export const mockWallet = () => {
    return {};
}

export const shortenPk = (pk: PublicKey | string, chars = 5) => {
    const pkStr = typeof pk === "object" && "toBase58" in pk? pk.toBase58() : pk;
    return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
};

export const confirmTx = async (txHash: string | undefined, connection: Connection) => {
    if (!txHash) {
      throw new Error("Transaction hash is undefined");
    }
    const blockhashInfo = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: blockhashInfo.blockhash,
      lastValidBlockHeight: blockhashInfo.lastValidBlockHeight, // Correct capitalization
      signature: txHash, // Guaranteed to be a string now
    });
  };

export const formatCurrency = (value: number) => {
    const factAmount = value / 1_000_000_000; // Scale down to fact_amount
    
    if (factAmount >= 1_000_000) {
      return `${(factAmount / 1_000_000).toFixed(1)}m`; // Format as millions
    } else if (factAmount >= 1_000) {
      return `${(factAmount / 1_000).toFixed(1)}k`; // Format as thousands
    } else {
      return factAmount.toFixed(2); // Default format with 2 decimals
    }
  };

  