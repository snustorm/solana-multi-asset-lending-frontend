"use client";

import { useState } from "react";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";


export default function Mint() {
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  // State for associated token account generation
  const [tokenMint, setTokenMint] = useState<string>('');
  const [tokenOwner, setTokenOwner] = useState<string>('');
  const [ataMessage, setAtaMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // State for quick minting
  const [quickMintTokenMint, setQuickMintTokenMint] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [quickMintAmount, setQuickMintAmount] = useState('');
  const [quickMintMessage, setQuickMintMessage] = useState(''); 
  const [quickMintLoading, setQuickMintLoading] = useState(false);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const handleMint = async () => {
    if (!publicKey || !connection ) {
      setError("Wallet is not connected.");
      return;
    }
  
    try {
  
        const mint = Keypair.generate();

        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction();

        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: mint.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mint.publicKey,
                0,
                publicKey,
                publicKey,
                TOKEN_PROGRAM_ID
            )
        );

        sendTransaction(transaction, connection, {
            signers: [mint],
          }).then(() => {
            setMintAddress(mint.publicKey.toString());
          });
          setError(null);
        } catch (err) {
            console.error(err);
            setError("An error occurred while minting the token.");
        }
  };

  const handleGenerateAta = async () => {
    if (!publicKey || !wallet || !wallet.publicKey) {
      setAtaMessage("Connect your wallet first!");
      return;
    }
    if (!tokenMint || !tokenOwner) {
      setAtaMessage("Please fill in both Token Mint and Token Account Owner.");
      return;
    }
  
    try {
      setAtaMessage(null);
      setLoading(true);
  
      const mintPublicKey = new PublicKey(tokenMint);
      const ownerPublicKey = new PublicKey(tokenOwner);
  
      // Derive the ATA address
      const ataAddress = await getAssociatedTokenAddress(mintPublicKey, ownerPublicKey);
  
      console.log("ATA address:", ataAddress.toBase58());
  
      // Check if the ATA already exists
      const accountInfo = await connection.getAccountInfo(ataAddress);
      if (!accountInfo) {
        console.log(
          `Creating ATA for mint ${mintPublicKey.toBase58()} and owner ${ownerPublicKey.toBase58()}`
        );
  
        // Create the ATA for the user if it doesn't already exist
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey, // Payer (wallet public key)
            ataAddress, // Associated token account address
            ownerPublicKey, // Token owner
            mintPublicKey // Token mint address
          )
        );
  
        // Fetch the latest blockhash and prepare the transaction
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
  
        // Sign the transaction with the wallet
        if (!wallet.signTransaction) {
          throw new Error("Wallet does not support transaction signing.");
        }
  
        const signedTransaction = await wallet.signTransaction(transaction);
  
        // Send the transaction
        const txId = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction({
          signature: txId,
          blockhash,
          lastValidBlockHeight,
        });
  
        console.log(`ATA created: ${ataAddress.toBase58()}`);
        setAtaMessage(`ATA created successfully: ${ataAddress.toBase58()}`);
      } else {
        console.log(`ATA already exists: ${ataAddress.toBase58()}`);
        setAtaMessage(`ATA already exists: ${ataAddress.toBase58()}`);
      }
    } catch (error) {
      console.error("Error generating ATA:", error);
      setAtaMessage("Failed to create Associated Token Account.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMint = async () => {
    
    if (!wallet?.publicKey) {
      setQuickMintMessage('Connect your wallet first!');
      return;
    }
  
    if (!quickMintTokenMint || !recipientAddress || !quickMintAmount) {
      setQuickMintMessage('All fields are required.');
      return;
    }
  
    try {
      setQuickMintMessage("");
      setQuickMintLoading(true);
  
      const mintPublicKey = new PublicKey(quickMintTokenMint);
      const recipientPublicKey = new PublicKey(recipientAddress);
      const amount = new BN(quickMintAmount);
      const adjustedAmount = amount.mul(new BN(10 ** 9));

  
      const ataAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
  
      const mintInstruction = createMintToInstruction(
        mintPublicKey,        // Token mint
        ataAddress,   // Recipient ATA
        wallet.publicKey,     // Mint authority
        adjustedAmount.toNumber()     // Amount to mint
      );
  
      const transaction = new Transaction().add(mintInstruction);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
  
      setQuickMintMessage(`Successfully minted ${quickMintAmount} tokens to ${recipientAddress}`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      setQuickMintMessage('Failed to mint tokens.');
    } finally {
      setQuickMintLoading(false);
    }
  };


  
  return (
    <div className="min-h-screen  text-gray-900 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10">
          Mint SPL Tokens
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Card 1: Create Mint */}
          <div className=" shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create Mint</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use your connected wallet to create a new SPL token mint.
            </p>
            <button
              onClick={handleMint}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Mint New Token
            </button>
  
            {mintAddress && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-500">Mint successful!</p>
                <p className="text-xs break-words mt-2">
                  Token Mint Address: <br />
                  <span className="text-blue-500">{mintAddress}</span>
                </p>
              </div>
            )}
  
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          </div>
  
          {/* Card 2: Create ATA */}
          <div className=" shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create Associated Token Account</h2>
            <p className="text-sm text-gray-600 mb-4">
              Generate an Associated Token Account (ATA) for a specific SPL token.
            </p>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Token Mint
              </label>
              <input
                type="text"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter token mint address"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Token Account Owner
              </label>
              <input
                type="text"
                value={tokenOwner}
                onChange={(e) => setTokenOwner(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner public key"
              />
            </div>
  
            {ataMessage && (
              <p
                className={`text-sm mt-4 ${
                  ataMessage.includes("success")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {ataMessage}
              </p>
            )}
  
            <button
              onClick={handleGenerateAta}
              className={`w-full mt-4 py-2 bg-green-500 text-white rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate ATA"}
            </button>
          </div>
  
          {/* Card 3: Quick Mint */}
          <div className=" shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Quick Mint</h2>
            <p className="text-sm text-gray-600 mb-4">
              Quickly mint tokens to a specific wallet address.
            </p>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Token Mint
              </label>
              <input
                type="text"
                value={quickMintTokenMint}
                onChange={(e) => setQuickMintTokenMint(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter token mint address"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipient public key"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Amount
              </label>
              <input
                type="number"
                value={quickMintAmount}
                onChange={(e) => setQuickMintAmount(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount to mint"
              />
            </div>
  
            {quickMintMessage && (
              <p
                className={`text-sm mt-4 text-center ${
                  quickMintMessage.toLowerCase().includes("success")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {quickMintMessage}
              </p>
            )}
  
            <button
              onClick={handleQuickMint}
              className={`w-full mt-4 py-2 bg-purple-500 text-white rounded-md ${
                quickMintLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-600"
              }`}
              disabled={quickMintLoading}
            >
              {quickMintLoading ? "Minting..." : "Mint Tokens"}
            </button>
          </div>


           
        </div>
      </main>
    </div>
  );
}