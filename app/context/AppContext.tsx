'use client'

import { AnchorWallet, useAnchorWallet, useConnection, useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import 'rpc-websockets/dist/lib/client';
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN, } from "@project-serum/anchor";
import { Wallet } from "@coral-xyz/anchor";
import { getProgram, getUserAddress, getUserTokenAccountAddress, getBankTokenAccountAddress, getBankAccountAddress } from "../utils/program";
import { confirmTx, formatCurrency } from "../utils/helper";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { priceFeedMap, PROGRAM_ID, SOL_MINT, SOL_PRICE_FEED_ID, USDC_MINT, } from "../utils/constants";
import { AccountLayout, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
import { mintData } from "../lend-borrow/utils/mintData";

interface AppContextType {
  connected: boolean;
  publicKey: string | null;
  program: any | null;
  userTotalDeposit: number;
  userTotalBorrow: number;
  connection: Connection;
  wallet: AnchorWallet | undefined;
  updatedPoolData: PoolInfo[];
  initPool: () => Promise<void>;
  deposit: (name: string, amount: number, mint: PublicKey) => Promise<string>;
  init_user_token_account: (name: string, mint: PublicKey) => Promise<void>;
  borrow: (amount: number, mint: PublicKey) => Promise<void>;
  withdraw: (amount: number, mint: PublicKey) => Promise<void>;
}

type PoolInfo = {
    totalSupply: string; // Dynamic
    totalBorrow: string; // Dynamic
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

  // Use useMemo to get the program if connected
  const program = useMemo(() => {
    if (connected && wallet) {
      return getProgram(connection, wallet);
    }
    return null; // Ensure null is returned when wallet or connection is unavailable
  }, [connection, wallet, connected]);

  useEffect(() => {
    if (program && wallet?.publicKey) {
      updateUserAccountState();
      updateBankData();
    }
  }, [program]);


  const updateUserAccountState = async () => {
    if (!program || !wallet?.publicKey) return;

    try {
      const userAddress = getUserAddress(wallet.publicKey);
      const userAccount = await program.account.user.fetchNullable(userAddress);
      setUserAddress(userAddress);

      if (userAccount) {
        setUserTotalDeposit(userAccount.totalDepositValue.toNumber() / 1000 );
        setUserTotalBorrow(userAccount.totalBorrowValue.toNumber()/ 1000 );
      } else {
        setUserTotalDeposit(0);
        setUserTotalBorrow(0);
      }

      console.log("userTotalDeposit:", userTotalDeposit);
      console.log("userTotalBorrow:", userTotalBorrow);

    } catch (err) {
      console.error("Error fetching user account:", err);
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
        console.log("Bank Address: ", bankAddress.toBase58());
        const bankAccount = await program.account.bank.fetch(bankAddress);

        // Map fetched data to Pool fields
        const totalDeposits = bankAccount.totalDeposits.toNumber();
        const totalBorrowed = bankAccount.totalBorrowed.toNumber();
        const utilization = (totalBorrowed / totalDeposits) * 100;
        console.log("Total Deposits: ", totalDeposits);
        console.log("Total Borrowed: ", totalBorrowed);

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

    console.log("Mint: ", mint.toBase58()); 
    const tx = await program.methods
            .initUserTokenAccount(name, mint)
            .accounts({
                signer: wallet.publicKey,
                mint,
                userTokenAccount: userTokenAccount,
            })
            .rpc();

      await confirmTx(tx, connection);
  }
  
  const deposit = async (name: string, amount: number, mint: PublicKey): Promise<string> => {
    console.log("Attempting to deposit...");

    if (!program || !wallet?.publicKey || !userAddress) {
        throw new Error("Missing required parameters or wallet address.");
    }

    // Dynamically retrieve price feed and bank accounts
    const priceFeedAccount = getPriceFeedAccount(name);
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

  const borrow = async (amount: number, mint: PublicKey) => {
    if (!program || !wallet?.publicKey) return;

    try {
      const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
      const bankTokenAccount = getBankTokenAccountAddress(mint);

      const tx = await program.methods
        .borrow(new BN(amount * LAMPORTS_PER_SOL))
        .accounts({
          user: userAddress,
          userTokenAccount,
          bankTokenAccount,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await confirmTx(tx, connection);
      await updateUserAccountState();
      // toast.success("Borrow successful!");
    } catch (err) {
      console.error("Error borrowing:", err);
      // toast.error("Failed to borrow.");
    }
  };

  const withdraw = async (amount: number, mint: PublicKey) => {
    if (!program || !wallet?.publicKey) return;

    try {
      const userAddress = getUserAddress(wallet.publicKey);
      const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
      const bankTokenAccount = getBankTokenAccountAddress(mint);

      const tx = await program.methods
        .withdraw(
            new BN(amount * LAMPORTS_PER_SOL
            ))
        .accounts({
          signer:  wallet.publicKey,
          userTokenAccount,
          bankTokenAccount,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await confirmTx(tx, connection);
      await updateUserAccountState();
      // toast.success("Withdrawal successful!");
    } catch (err) {
      console.error("Error withdrawing:", err);
      // toast.error("Failed to withdraw.");
    }
  };




  const initPool = async () => {
    
    
    if (!program || !wallet?.publicKey) {
        console.error("Wallet or program not available.");
        return;
    }

    try {
       const initUSDCBankTx = await program.methods.initBank
          (new BN(8000), new BN(5000), priceFeedMap.USDT)
          .accounts({
            signer: wallet.publicKey,
            mint: mintData.USDT,
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
        program,
        userTotalDeposit,
        userTotalBorrow,
        connection,
        wallet,
        updatedPoolData,
        initPool,
        deposit,
        init_user_token_account,
        borrow,
        withdraw,
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