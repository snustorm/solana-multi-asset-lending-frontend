'use client'

import { AnchorWallet, useAnchorWallet, useConnection, useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import 'rpc-websockets/dist/lib/client';
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { BN, } from "@project-serum/anchor";
import { Wallet } from "@coral-xyz/anchor";
import { getProgram, getUserAddress, getUserTokenAccountAddress, getBankTokenAccountAddress, getBankAccountAddress } from "../utils/program";
import { confirmTx } from "../utils/helper";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { priceFeedMap, PROGRAM_ID, SOL_MINT, SOL_PRICE_FEED_ID, USDC_MINT, USDC_PRICE_FEED_ID } from "../utils/constants";
import { AccountLayout, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { Connection } from "@solana/web3.js";
//import { PythSolanaReceiver } from '@pythnetwork/pyth-solana-receiver';

interface AppContextType {
  connected: boolean;
  publicKey: string | null;
  program: any | null;
  userTotalDeposit: number;
  userTotalBorrow: number;
  connection: Connection;
  wallet: AnchorWallet | undefined;
  initPool: () => Promise<void>;
  deposit: (name: string, amount: number, mint: PublicKey) => Promise<void>;
  init_user_token_account: (name: string, mint: PublicKey) => Promise<void>;
  borrow: (amount: number, mint: PublicKey) => Promise<void>;
  withdraw: (amount: number, mint: PublicKey) => Promise<void>;
}

// Create the context with a default value of `undefined` for optional types
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [userTotalDeposit, setUserTotalDeposit] = useState(0);
  const [userTotalBorrow, setUserTotalBorrow] = useState(0);


  const [userAddress, setUserAddress] = useState<PublicKey | null>(null);

  const [usdcBankAccount, setUsdcBankAccount] = useState<PublicKey | null>(null);
  const [solBankAccount, setSolBankAccount] = useState<PublicKey | null>(null);
  const [usdcBankTokenAccount, setUsdcBankTokenAccount] = useState<PublicKey | null>(null);
  const [solBankTokenAccount, setSolBankTokenAccount] = useState<PublicKey | null>(null);    

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
    }
  }, [program]);


  const updateUserAccountState = async () => {
    if (!program || !wallet?.publicKey) return;

    try {
      const userAddress = getUserAddress(wallet.publicKey);
      const userAccount = await program.account.user.fetchNullable(userAddress);
      setUserAddress(userAddress);

     const usdcBankAccount = getBankAccountAddress(USDC_MINT);
     const solBankAccount = getBankAccountAddress(SOL_MINT);
     const usdcBankTokenAccount = getBankTokenAccountAddress(USDC_MINT);
     const solBankTokenAccount = getBankTokenAccountAddress(SOL_MINT);

     console.log('USDC Bank Account', usdcBankAccount.toString());
     console.log('SOL Bank Account', solBankAccount.toString());
     console.log('USDC Bank Token Account', usdcBankTokenAccount.toString());
     console.log('SOL Bank Token Account', solBankTokenAccount.toString());
     
     setUsdcBankAccount(usdcBankAccount);
     setSolBankAccount(solBankAccount);
     setUsdcBankTokenAccount(usdcBankTokenAccount);
     setSolBankTokenAccount(solBankTokenAccount);


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
  
  const deposit = async (name: string, amount: number, mint: PublicKey) => {
    console.log("Attempting to deposit...");

    // Ensure required parameters and accounts are available
    if (!program || !wallet?.publicKey || !userAddress) {
        console.error("Missing required parameters or wallet address.");
        return;
    }

    // Dynamically retrieve price feed and bank accounts
    const priceFeedAccount = getPriceFeedAccount(name);
    if (!priceFeedAccount) {
        console.error(`Failed to retrieve price feed account for ${name}.`);
        return;
    }

    const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mint);
    const bankAccount = getBankAccountAddress(mint);
    const bankTokenAccount = getBankTokenAccountAddress(mint);

    // Ensure all required accounts are valid
    if (!userTokenAccount || !bankAccount || !bankTokenAccount) {
        console.error("Missing one or more required accounts.");
        return;
    }

    console.log("Preparing transaction...");

    try {
        // Prepare and send the transaction
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

        console.log("Deposit successful!");

        // Optional: Add success notification (toast, alert, etc.)
        // toast.success("Deposit successful!");

    } catch (err) {
        console.error("Error depositing:", err);

        // Optional: Add error notification (toast, alert, etc.)
        // toast.error("Failed to deposit.");
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
          (new BN(8000), new BN(5000), USDC_PRICE_FEED_ID)
          .accounts({
            signer: wallet.publicKey,
            mint: USDC_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc({ commitment: 'confirmed' });
    
        console.log('Create USDC Bank Account', initUSDCBankTx);

        const initSOLBankTx = await program.methods
          .initBank(new BN(8000), new BN(5000), SOL_PRICE_FEED_ID)
          .accounts({
            signer: wallet.publicKey,
            mint: SOL_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc({ commitment: 'confirmed' });
    
        console.log('Create SOL Bank Account', initSOLBankTx);

        // const amount = 10_000;
        // const mintSOLTx = await mintTo(
        //   // @ts-ignores
        //   banksClient,
        //   signer,
        //   mintSOL,
        //   solBankTokenAccount,
        //   signer,
        //   amount
        // );

        // Update state or display confirmation
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