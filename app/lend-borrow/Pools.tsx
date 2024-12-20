import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { PublicKey } from "@solana/web3.js";
import { mintData } from "./utils/mintData";
import { getUserTokenAccountAddress } from "../utils/program";
import Lottie from 'react-lottie';
import animationData from '../../public/animation/deposit.json'; 

type Pool = {
    name: string;
    ticker: string;
    icon: string;
    totalSupply: string;
    totalBorrow: string;
    supplyApy: string;
    borrowApy: string;
    utilization: string;
  };

const Pools = () => {
    const {
        connection,
        wallet,
        deposit,
        init_user_token_account,
    } = useAppContext();

    const poolData: Pool[] = [
        {
            name: "Solana",
            ticker: "SOL",
            icon: "sol.png",
            totalSupply: "2.1m",
            totalBorrow: "1.1m",
            supplyApy: "4.5%",
            borrowApy: "8.0%",
            utilization: "50%",
          },
          {
            name: "Tether",
            ticker: "USDT",
            icon: "usdt.png",
            totalSupply: "$1.5m",
            totalBorrow: "740k",
            supplyApy: "4.0%",
            borrowApy: "7.5%",
            utilization: "50%",
          },
          {
            name: "USD Coin",
            ticker: "USDC",
            icon: "usdc.png",
            totalSupply: "2.5m",
            totalBorrow: "1.2m",
            supplyApy: "5.0%",
            borrowApy: "9.0%",
            utilization: "48%",
          },
          {
            name: "Solayer SOL",
            ticker: "sSOL",
            icon: "sSol.png",
            totalSupply: "2.5m",
            totalBorrow: "1.2m",
            supplyApy: "5.0%",
            borrowApy: "9.0%",
            utilization: "48%",
          },
          {
            name: "Raydium",
            ticker: "RAY",
            icon: "ray.png",
            totalSupply: "2.5m",
            totalBorrow: "1.2m",
            supplyApy: "5.0%",
            borrowApy: "9.0%",
            utilization: "48%",
          },
          {
            name: "Jupiter",
            ticker: "JUP",
            icon: "jup.png",
            totalSupply: "2.5m",
            totalBorrow: "1.2m",
            supplyApy: "5.0%",
            borrowApy: "9.0%",
            utilization: "48%",
          },
    ];

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null); // Selected pool data
  const [depositAmount, setDepositAmount] = useState(""); // User-entered deposit amount
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState('');


  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDepositSuccessful, setIsDepositSuccessful] = useState(false);

// Function to trigger success modal on successful deposit
    const showSuccessModal = () => {
        setIsDepositSuccessful(true);
        setIsSuccessModalOpen(true);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setIsDepositSuccessful(false); 
    };


  // Open modal and set selected pool
  const openModal = (pool: Pool) => {
    setSelectedPool(pool);
    setIsModalOpen(true);
  };

  // Close modal and clear input
  const closeModal = () => {
    setIsModalOpen(false);
    setDepositAmount("");
    setSelectedPool(null);
  };

  // Handle deposit amount change
  const handleDepositAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(event.target.value);
  };

  // Submit deposit logic (to be implemented)
  const handleDeposit = async () => {
   
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0 || !wallet) {
      setError("Please enter a valid amount.");
      return;
    }
  
    // Get the pool's token name (e.g., SOL in "SOL/USDC")
    const poolTokenName = selectedPool?.ticker;
  
    if (!poolTokenName) {
      setError("Invalid pool selected.");
      return;
    }
  
    // Ensure mint is a valid PublicKey
    const mint = mintData[poolTokenName];
    if (!mint) {
      setError("Invalid pool selected.");
      return;
    }
  
    try {
      const mintPublicKey = new PublicKey(mint); // Convert to PublicKey if it's a string
  
      // Check if the user token account already exists
      const userTokenAccount = getUserTokenAccountAddress(wallet.publicKey, mintPublicKey);
  
      const accountInfo = await connection.getAccountInfo(userTokenAccount);
  
      // If the account doesn't exist, initialize it
      if (!accountInfo) {
        console.log("User token account not found. Initializing...");
        await init_user_token_account(poolTokenName, mintPublicKey);
      }
  
      console.log(`Depositing ${depositAmount} to ${selectedPool?.name} with mint ${mintPublicKey.toBase58()}`);
      
      await deposit(
            poolTokenName, 
            Number(depositAmount) * 1_000, 
            mintPublicKey
        );
  
      closeModal(); // Close the modal after deposit
      setIsSuccessModalOpen(true); // Show success modal
    } catch (err) {
      console.error("Error during deposit:", err);
      setError("An error occurred while processing the deposit.");
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8 ">
      <h2 className="text-3xl font-bold mb-4">Available Assets</h2>
    <div className="relative p-6 border border-gray-300 rounded-lg bg-white mt-8 pb-20">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm font-bold text-gray-500">
        Total Assets: {poolData.length}
      </span>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-700">
            <th className="pb-2">Assets</th>
            <th className="pb-2 pl-4">Supply</th>
            <th className="pb-2 pl-4">Borrow</th>
            <th className="pb-2 pl-4">Supply APR</th>
            <th className="pb-2 pl-4">Borrow APR</th>
            <th className="pb-2">Util</th>
            <th className="pb-2 pl-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {poolData.map((pool, index) => (
            <tr key={index} className="border-t border-gray-200 text-right">
              <td className="py-4 flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <img
                    src={`/token-icon/${pool.icon}`}  // Just one icon for each token
                    alt={pool.name}
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                </div>
                <div className="ml-2">
                  <div className="text-md font-semibold text-left">{pool.ticker}</div>
                  <div className="text-xs text-gray-500 text-left">{pool.name}</div>
                </div>
              </td>
              <td className="py-2">{pool.totalSupply}</td>
              <td className="py-2">{pool.totalBorrow}</td>
              <td className="py-2 pr-4">{pool.supplyApy}</td>
              <td className="py-2 pr-4">{pool.borrowApy}</td>
              <td className="py-2">{pool.utilization}</td>
              <td className="py-2 text-center">
                <button
                  onClick={() => openModal(pool)}
                  className="border border-gray-400 text-gray-700 py-1 px-4 text-sm rounded hover:bg-gray-100 transition"
                >
                  Lend
                </button>
                <button className="border border-yellow-400 bg-[#fcd303] text-yellow-900 py-1 px-4 text-sm rounded ml-2 hover:bg-[#fcd303cc] transition">
                  Borrow
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="items-center justify-center text-center font-bold text-gray-700 py-10">
        More assets are coming...
      </div>
    </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              Deposit {selectedPool?.ticker}
            </h3>
            <input
              type="text"
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
                setError(""); // Clear error on input change
              }}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}


    {isSuccessModalOpen && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Success !</h3>
        
        {/* Lottie Animation */}
        <Lottie
            options={{
            animationData,
            loop: false,  // Animation will play once and stop
            autoplay: true, // Play animation automatically
            }}
            height={300}
            width={300}
        />
        
        <p className="text-center text-md font-semibold text-gray-700">
            You have successfully deposited 1 USDC.
            <a 
            href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline ml-1"
            >
            Read More
            </a>
        </p>

        <div className="mt-4 flex justify-end">
            <button
            onClick={closeSuccessModal}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-300"
            >
            Got it
            </button>
        </div>
        </div>
    </div>
    )}
    </div>
  );
};

export default Pools;