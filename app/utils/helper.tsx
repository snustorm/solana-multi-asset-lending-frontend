import { PublicKey } from "@solana/web3.js";


export const mockWallet = () => {
    return {};
}

export const shortenPk = (pk: PublicKey | String, chars = 5) => {
    const pkStr = typeof pk === "object" && "toBase58" in pk? pk.toBase58() : pk;
    return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
};

export const confirmTx = async (txHash: String | undefined, connection: any) => {
    const blockhasInfo = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: blockhasInfo.blockhash,
        LastValidBlockHeight: blockhasInfo.LastValidBlockHeight,
        signature: txHash,
    })
}

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

  