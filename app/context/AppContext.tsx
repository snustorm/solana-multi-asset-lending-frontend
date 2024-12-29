'use client'

import { AnchorWallet, useAnchorWallet, useConnection, useWallet} from "@solana/wallet-adapter-react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import 'rpc-websockets/dist/lib/client';
import { PublicKey } from "@solana/web3.js";
import { BN, Program, } from "@project-serum/anchor";
import { Wallet } from "@coral-xyz/anchor";
import { getProgram, getUserAddress, getUserTokenAccountAddress, getBankTokenAccountAddress, getBankAccountAddress, getAllAssetPrices } from "../utils/program";
import { confirmTx, formatCurrency } from "../utils/helper";
import { Assets, priceFeedMap} from "../utils/constants";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
import { mintData } from "../utils/constants";
import { Lending2 } from "../utils/lending2";

interface AppContextType {
    connected: boolean;
    publicKey: string | null;
    // @ts-expect-error: Lending2 type is missing properties required by Idl, but it is functional in this context.
    program: Program<Lending2> | null;
    userTotalDeposit: number;
    userTotalBorrow: number;
    connection: Connection;
    wallet: AnchorWallet | undefined;
    updatedPoolData: PoolInfo[];

    //onChain functions
    initPool: () => Promise<void>;
    init_user_token_account: (name: string, mint: PublicKey) => Promise<void>;
    fetchUserAssets: () =>  Promise<{ supply: UserAsset[]; borrow: UserAsset[] }>;
    deposit: (name: string, amount: number, mint: PublicKey) => Promise<string>;
    borrow: (name: string, amount: number, mint: PublicKey) => Promise<string>;
    withdraw: (name: string, amount: number, mint: PublicKey) => Promise<string>;
    repay: (name: string, amount: number, mint: PublicKey) => Promise<string>;
    
}

export type UserAsset = {
    name: string;
    icon: string;
    price: string; // Formatted as a string, e.g., "$12.34"
    amount: string; // Formatted as a string, e.g., "1,000.00"
    value: string; // Formatted as a string, e.g., "$12,340.00"
  };

type PoolInfo = {
    totalSupply: string; 
    totalBorrow: string; 
    utilization: string;
  };

// Create the context with a default value of `undefined` for optional types
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [userTotalDeposit, setUserTotalDeposit] = useState(0);
  const [userTotalBorrow, setUserTotalBorrow] = useState(0);
  const [userAddress, setUserAddress] = useState<PublicKey | null>(null);
  const [updatedPoolData, setUpdatedPoolData] = useState<PoolInfo[]>([]);

  const [assetPrices, setAssetPrices] = useState<Record<string, number>>({});
  // Use useMemo to get the program if connected
  const program = useMemo(() => {
    return getProgram(connection, connected && wallet ? wallet : null);
  }, [connection, wallet, connected]);

  useEffect(() => {
    if(program) {
        updateBankData();
    }

    if (program && wallet?.publicKey) {
      updateUserAccountState();
    }
  }, [program]);


  const updateUserAccountState = async () => {
    if (!program || !wallet?.publicKey) return;

    try {
      const userAddress = getUserAddress(wallet.publicKey);
      const userAccount = await program.account.user.fetchNullable(userAddress);
      setUserAddress(userAddress);

      if (userAccount) {
        console.log("userAccount.totalDepositValue.toNumber():", userAccount.totalDepositValue.toNumber());
        setUserTotalDeposit(userAccount.totalDepositValue.toNumber());
        console.log("userAccount.totalBorrowValue.toNumber():", userAccount.totalBorrowValue.toString());
        setUserTotalBorrow(userAccount.totalBorrowValue.toNumber());
      } else {
        setUserTotalDeposit(0);
        setUserTotalBorrow(0);
      }
     
      const assetPrice = await getAllAssetPrices();
      setAssetPrices(assetPrice);
    } catch (err) {
      console.error("Error fetching user account:", err);
    }
  };

const fetchUserAssets = async () : Promise<{ supply: UserAsset[]; borrow: UserAsset[] }> => {
    
    if (!program || !wallet?.publicKey) {
        throw new Error("Missing required parameters or wallet address.");
    }

    console.log("Fetching user assets...");

    try {
      // Initialize empty arrays for supply and borrow assets
      const supplyAssets = [];
      const borrowAssets = [];
  
      for (const asset of Assets) {
        const mintPublicKey = new PublicKey(asset.mint);
  
        const userTokenAccountAddress = await getUserTokenAccountAddress(wallet.publicKey, mintPublicKey);
  
        // Fetch the user token account data (skip if it doesn't exist)
        const userTokenAccount = await program.account.userTokenAccount.fetchNullable(userTokenAccountAddress);
        
        if (!userTokenAccount) continue;
  
        const { depositAmount, borrowedAmount } = userTokenAccount;
  
        if (depositAmount.toNumber() > 0) {
          const amount = depositAmount.toNumber() / 1_000_000_000; 
          const price = assetPrices[asset.name];
          const value = amount * price; 
          supplyAssets.push({
            name: asset.name,
            icon: asset.icon,
            price: `$${price.toFixed(2)}`, 
            amount: amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Format amount with commas
            value: value.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          });
        }
  
        // Add to borrow assets if borrowedAmount > 0
        if (borrowedAmount.toNumber() > 0) {
          const amount = borrowedAmount.toNumber() / 1_000_000_000;
          const price = assetPrices[asset.name];
          const value = amount * price; 
          borrowAssets.push({
            name: asset.name,
            icon: asset.icon,
            price: `$${price.toFixed(2)}`,
            amount: amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Format amount with commas
            value: value.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          });
        }
      }
      return { supply: supplyAssets, borrow: borrowAssets };
    } catch (error) {
      console.error("Error fetching user assets:", error);
      throw new Error("Failed to fetch user assets.");
    }
  };


  const updateBankData = async () => {
    if (!program) return;

    console.log("Updating bank data...");

    const PoolData: PoolInfo[] = [];

    for (const [ticker, mintAddress] of Object.entries(mintData)) {
      try {
        const mintPublicKey = new PublicKey(mintAddress);
        const bankAddress = await getBankAccountAddress(mintPublicKey);
        const bankAccount = await program.account.bank.fetch(bankAddress);

        // Map fetched data to Pool fields
        const totalDeposits = bankAccount.totalDeposits.toNumber();
        const totalBorrowed = bankAccount.totalBorrowed.toNumber();
        const utilization = (totalBorrowed / totalDeposits) * 100;
  
        PoolData.push({
          totalSupply: formatCurrency(totalDeposits),
          totalBorrow: formatCurrency(totalBorrowed),
          utilization: `${utilization.toFixed(2)}%`,
        });
      } catch (err) {
        console.error(`Failed to fetch data for ${ticker}:`, err);
      }
    }
    setUpdatedPoolData(PoolData);
  };



  const getPriceFeedAccount = (name: string): string | null => {
    const priceFeedId = priceFeedMap[name];
    if (!priceFeedId) {
      console.error(`Price feed not found for asset: ${name}`);
      return null;
    }
  
    // Assuming `pythSolanaReceiver` is already initialized
    const pythSolanaReceiver = new PythSolanaReceiver({
      connection,
      wallet: wallet as Wallet,
    });
  
    return pythSolanaReceiver.getPriceFeedAccountAddress(0, priceFeedId).toBase58();
  };



  const init_user_token_account = async (name: string, mint: PublicKey) => {

    if (!program || !wallet?.publicKey || !userAddress) return;
    
    const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);

    const tx = await program.methods
            .initUserTokenAccount(name, mint)
            .accounts({
                signer: wallet.publicKey,
                mint,
                // @ts-expect-error: userTokenAccount type is missing properties required by Idl, but it is functional in this context.
                userTokenAccount: userTokenAccount,
            })
            .rpc();

      await confirmTx(tx, connection);
  }
  
  const deposit = async (name: string, amount: number, mint: PublicKey): Promise<string> => {
    console.log("Attempting to deposit...");

    console.log("Deposit amount: ", amount);

    if (!program || !wallet?.publicKey || !userAddress) {
        throw new Error("Missing required parameters or wallet address.");
    }

    // Dynamically retrieve price feed and bank accounts
    const priceFeedAccount = getPriceFeedAccount(name);
    console.log("priceFeedAccount", priceFeedAccount);
    
    if (!priceFeedAccount) {
        throw new Error(`Failed to retrieve price feed account for ${name}.`);
    }

    const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
    const bankAccount = getBankAccountAddress(mint);
    const bankTokenAccount = getBankTokenAccountAddress(mint);

    if (!userTokenAccount || !bankAccount || !bankTokenAccount) {
        throw new Error("Missing one or more required accounts.");
    }

    console.log("Preparing transaction...");


    try {
        const tx = await program.methods
            .deposit(new BN(amount))
            .accounts({
                signer: wallet.publicKey,
                mint,
                // @ts-expect-error: userAccount type is missing properties required by Idl, but it is functional in this context.
                userAccount: userAddress,
                bank: bankAccount,
                bankTokenAccount: bankTokenAccount,
                userTokenAccount: userTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                priceUpdate: priceFeedAccount,
            })
            .rpc();

        // Confirm the transaction
        await confirmTx(tx, connection);

        // Update the user account state
        await updateUserAccountState();

        console.log("Deposit successful! Transaction Hash:", tx);
        return tx; // Return the transaction hash
    } catch (err) {
        console.error("Error during deposit:", err);
        throw new Error("Failed to complete the deposit.");
    }
};

const borrow = async (name: string, amount: number, mint: PublicKey): Promise<string> => {
    if (!program || !wallet?.publicKey) {
        throw new Error("Missing required parameters or wallet address.");
    }

    const priceFeedAccount = getPriceFeedAccount(name);
    console.log("priceFeedAccount", priceFeedAccount);
    if (!priceFeedAccount) {
        throw new Error(`Failed to retrieve price feed account for ${name}.`);
    }

    console.log(`Attempting to borrow...${name}`);

    try {
        const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
        const bankAccount = getBankAccountAddress(mint);
        const bankTokenAccount = getBankTokenAccountAddress(mint);

        console.log("go on chain");
        console.log("borrow amount", amount);

        const tx = await program.methods
            .borrow(new BN(amount))
            .accounts({
                signer: wallet.publicKey,
                mintBorrow: mint,
                // @ts-expect-error: userAccount type is missing properties required by Idl, but it is functional in this context.
                userAccount: userAddress,
                bankBorrow: bankAccount,
                bankTokenAccount: bankTokenAccount,
                userTokenAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
                priceUpdate: priceFeedAccount,
            })
            .rpc();

        await confirmTx(tx, connection);
        await updateUserAccountState();
        return tx;
    } catch (err) {
        console.error("Error borrowing:", err);
        toast.error("Failed to borrow.");
        throw err; 
    }
};

  const withdraw = async (name: string, amount: number, mint: PublicKey): Promise<string> => {
    
    
    if (!program || !wallet?.publicKey) {
        throw new Error("Missing required parameters or wallet address.");
    }

    const priceFeedAccount = getPriceFeedAccount(name);
    console.log("priceFeedAccount", priceFeedAccount);
    if (!priceFeedAccount) {
        throw new Error(`Failed to retrieve price feed account for ${name}.`);
    }

    console.log(`Attempting to withdraw...${name}`);

    try {
      
      const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
      const bankAccount = getBankAccountAddress(mint);
      const bankTokenAccount = getBankTokenAccountAddress(mint);

      const tx = await program.methods
        .withdraw(
            new BN(amount))
        .accounts({
          signer: wallet.publicKey,
          mint: mint,
          // @ts-expect-error: userAccount type is missing properties required by Idl, but it is functional in this context.
          userAccount: userAddress,
          userTokenAccount: userTokenAccount,
          bank: bankAccount,
          bankTokenAccount: bankTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          priceUpdate: priceFeedAccount,

        })
        .rpc();

        console.log("🎊Withdraw successful! Transaction Hash:", tx);
      

        await confirmTx(tx, connection);
        await updateUserAccountState();
        return tx;
    } catch (err) {
        console.error("Error withdrawing:", err);
        toast.error("Failed to withdraw.");
        throw err; 
    }
  };

  
  const repay = async (name: string, amount: number, mint: PublicKey): Promise<string> => {
    
    if (!program || !wallet?.publicKey) {
        throw new Error("Missing required parameters or wallet address.");
    }

    const priceFeedAccount = getPriceFeedAccount(name);
    console.log("priceFeedAccount", priceFeedAccount);
    if (!priceFeedAccount) {
        throw new Error(`Failed to retrieve price feed account for ${name}.`);
    }

    console.log(`Attempting to repay...${name}`);

    try {
      
      const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
      const bankAccount = getBankAccountAddress(mint);
      const bankTokenAccount = getBankTokenAccountAddress(mint);

      console.log("amount", amount);

      const tx = await program.methods
        .repay(new BN(amount))
        .accounts({
          signer: wallet.publicKey,
          mint: mint,
          // @ts-expect-error: userAccount type is missing properties required by Idl, but it is functional in this context.
          userAccount: userAddress,
          userTokenAccount: userTokenAccount,
          bank: bankAccount,
          bankTokenAccount: bankTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          priceUpdate: priceFeedAccount,
        })
        .rpc({ commitment: "confirmed", skipPreflight: true });

        console.log("Repay successful! Transaction Hash:", tx);
        await confirmTx(tx, connection);
        await updateUserAccountState();
        return tx;
    } catch (err) {
        console.error("Error repaying:", err);
        toast.error("Failed to repay.");
        throw err; 
    }
  };

  const initPool = async () => {
    
    if (!program || !wallet?.publicKey) {
        console.error("Wallet or program not available.");
        return;
    }

    try {
       const initUSDCBankTx = await program.methods.initBank
          (new BN(8000), new BN(5000), priceFeedMap.RAY)
          .accounts({
            signer: wallet.publicKey,
            mint: mintData.RAY,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc({ commitment: 'confirmed' });
    
        console.log('Success, Create Bank Account', initUSDCBankTx);

    } catch (err) {
        console.error("Error initializing pools:", err);
    }
    };

  return (
    <AppContext.Provider
      value={{
        connected,
        publicKey: publicKey ? publicKey.toBase58() : null,
        // @ts-expect-error: Lending2 type is missing properties required by Idl, but it is functional in this context.
        program,
        userTotalDeposit,
        userTotalBorrow,
        connection,
        wallet,
        updatedPoolData,
        fetchUserAssets,
        initPool,
        deposit,
        init_user_token_account,
        borrow,
        withdraw,
        repay,        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};



// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};