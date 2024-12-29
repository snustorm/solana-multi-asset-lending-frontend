'use client'

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { mintData } from "../utils/constants";
import { PublicKey } from "@solana/web3.js";
import Lottie from 'react-lottie';
import withdrawAni from "../../public/animation/withdraw.json";
import { UserAsset } from "../context/AppContext";

const UserAssets = () => {
  const { fetchUserAssets, withdraw, repay } = useAppContext(); // Fetch function and withdraw method from context

//   interface Asset {
//     icon: string;
//     name: string;
//     price: string;
//     amount: string;
//     value: string;
//     id: string; // Assuming each asset has a unique ID for withdraw operations
//   }

  const [supplyAssets, setSupplyAssets] = useState<UserAsset[]>([]);
  const [borrowAssets, setBorrowAssets] = useState<UserAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<UserAsset | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawSuccessModal, setshowWithdrawSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");

  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState("");
  const [showRepaySuccessModal, setshowRepaySuccessModal] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const { supply, borrow } = await fetchUserAssets();
        setSupplyAssets(supply);
        setBorrowAssets(borrow);
      } catch (error) {
        console.error("Error loading user assets:", error);
      } finally {
        console.log("User assets loaded successfully.");
      }
    };

    loadAssets();
  }, [fetchUserAssets]);

  const openWithdrawModal = (asset: UserAsset) => {
    setSelectedAsset(asset);
    setWithdrawAmount(asset.amount); 
    setShowWithdrawModal(true);
  };

  const openRepayModal = (asset: UserAsset) => {
    setSelectedAsset(asset);
    setRepayAmount(asset.amount); 
    setShowRepayModal(true);
  };

  const closeWithdrawSuccessModal = () => {
    setshowWithdrawSuccessModal(false);
  }

  const closeRepaySuccessModal = () => {
    setshowRepaySuccessModal(false);
  }

  const handleWithdraw = async () => {
    
    if (!selectedAsset) return;

    try {
      const amount = withdrawAmount;
      const name = selectedAsset.name;
      const mint = mintData[name];
      const mintPublicKey = new PublicKey(mint);

      const txHash = await withdraw(name, Number(amount), mintPublicKey); 

      setTxHash(txHash); 
      setShowWithdrawModal(false);
      setshowWithdrawSuccessModal(true);

      // Refresh assets after withdrawal
      const { supply } = await fetchUserAssets();
      setSupplyAssets(supply);

    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };


  const handleRepay = async () => {
    
    if (!selectedAsset) return;

    try {
      const amount = repayAmount;
      const name = selectedAsset.name;
      const mint = mintData[name];
      const mintPublicKey = new PublicKey(mint);

      console.log("Repaying:", name, amount, mintPublicKey.toBase58());
      const txHash = await repay(name, Number(amount), mintPublicKey); 

      setTxHash(txHash); 
      setShowRepayModal(false);
      setshowRepaySuccessModal(true);

      // Refresh assets after withdrawal
      const { borrow } = await fetchUserAssets();
      setBorrowAssets(borrow);

    } catch (error) {
      console.error("Repay failed:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8 grid grid-cols-2 gap-6 px-20">
    

      {/* Supply Assets */}
      <div className="relative p-4 border border-gray-300 rounded-lg bg-white">
        <span className="absolute -top-3 left-3 bg-white px-2 text-sm font-bold text-gray-500">
          Supply Assets
        </span>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="pb-2">Asset</th>
              <th className="pb-2 w-3/5 text-right pr-4">Amount</th>
              <th className="pb-2 w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {supplyAssets.length > 0 ? (
              supplyAssets.map((asset, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`/token-icon/${asset.icon}`}
                        alt={asset.name}
                        className="w-10 h-10 rounded-full mr-1"
                      />
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right pr-4">
                    <p>{asset.amount}</p>
                    <p className="text-sm text-gray-500">{asset.value}</p>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => openWithdrawModal(asset)}
                      className="text-white px-3 py-1 text-xs rounded border border-transparent hover:opacity-90"
                      style={{ backgroundColor: "#15be75" }}
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-center text-gray-500" colSpan={3}>
                  No supply assets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Borrow Assets */}
      <div className="relative p-4 border border-gray-300 rounded-lg bg-white">
        <span className="absolute -top-3 right-3 bg-white px-2 text-sm font-bold text-gray-500">
          Borrow Assets
        </span>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="pb-2">Asset</th>
              <th className="pb-2 w-3/5 text-right pr-4">Amount</th>
              <th className="pb-2 w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowAssets.length > 0 ? (
              borrowAssets.map((asset, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`/token-icon/${asset.icon}`}
                        alt={asset.name}
                        className="w-10 h-10 rounded-full mr-1"
                      />
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right pr-4">
                    <p>{asset.amount}</p>
                    <p className="text-sm text-gray-500">{asset.value}</p>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => openRepayModal(asset)}
                      className="text-black px-3 py-1 text-xs rounded border border-transparent hover:opacity-90"
                      style={{ backgroundColor: "#fcd303" }}
                    >
                      Repay
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-center text-gray-500" colSpan={3}>
                  No supply assets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Borrow table structure remains unchanged */}
      </div>




        {/* Withdraw Modal */}
        {showWithdrawModal && selectedAsset && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowWithdrawModal(false)} // Close modal on outside click
        >
            <div
            className="bg-white p-6 rounded-lg shadow-md w-96 relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inside click
            >
            <h2 className="text-lg font-bold mb-4">Withdraw {selectedAsset.name}</h2>
            <div className="flex items-center gap-4 mb-4">
                <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="flex-grow border border-gray-300 p-3 rounded-lg text-lg"
                placeholder="Enter amount"
                />
                <button
                onClick={() => setWithdrawAmount(selectedAsset.amount)} // Withdraw all logic
                className="py-1 px-3 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 text-sm"
                >
                Withdraw All
                </button>
            </div>
            

            {/* Dynamic Message */}
            <div className="text-gray-900 font-bold text-sm mb-6">
                You will receive:{" "}
                <span className="font-semibold text-green-600 ">
                {withdrawAmount || "0"} {selectedAsset.name}
                </span>
            </div>

            <div className="flex justify-end">
                <button
                onClick={handleWithdraw}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                Withdraw
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Success Modal */}
      {showWithdrawSuccessModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Success !</h3>
            
            {/* Lottie Animation */}
            <Lottie
                options={{
                animationData: withdrawAni,
                loop: false,  // Animation will play once and stop
                autoplay: true, // Play animation automatically
                }}
                height={300}
                width={300}
            />
            
            <p className="text-center text-md font-semibold text-gray-700">
                You have successfully withdraw {withdrawAmount} {selectedAsset?.name}.
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
                onClick={closeWithdrawSuccessModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-300"
                >
                Got it
                </button>
            </div>
            </div>
        </div>
        )}



        {/* Repay Modal */}
        {showRepayModal && selectedAsset && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowRepayModal(false)} // Close modal on outside click
        >
            <div
            className="bg-white p-6 rounded-lg shadow-md w-96 relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inside click
            >
            <h2 className="text-lg font-bold mb-4">Repay {selectedAsset.name}</h2>
            <div className="flex items-center gap-4 mb-4">
                <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="flex-grow border border-gray-300 p-3 rounded-lg text-lg"
                placeholder="Enter amount"
                />
                <button
                onClick={() => setRepayAmount(selectedAsset.amount)} // Withdraw all logic
                className="py-1 px-3 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 text-sm"
                >
                Repay Full
                </button>
            </div>
            

            {/* Repay Dynamic Message */}
            <div className="text-gray-900 font-bold text-sm mb-6">
                You will repay:{" "}
                <span className="font-semibold text-green-600 ">
                {repayAmount || "0"} {selectedAsset.name}
                </span>
            </div>

            <div className="flex justify-end">
                <button
                onClick={handleRepay}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                >
                Repay
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Repay Success Modal */}
      {showRepaySuccessModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Success !</h3>
            
            {/* Lottie Animation */}
            <Lottie
                options={{
                animationData: withdrawAni,
                loop: false,  // Animation will play once and stop
                autoplay: true, // Play animation automatically
                }}
                height={300}
                width={300}
            />
            
            <p className="text-center text-md font-semibold text-gray-700">
                You have successfully withdraw {repayAmount} {selectedAsset?.name}.
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
                onClick={closeRepaySuccessModal}
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

export default UserAssets;