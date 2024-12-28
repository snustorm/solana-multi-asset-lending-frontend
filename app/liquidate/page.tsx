'use client';

import React, { useState } from "react";

const LiquidatePage = () => {
    const [unhealthyAccounts, setUnhealthyAccounts] = React.useState<UnhealthyAccount[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  interface UnhealthyAccount {
    address: string;
    collateral: string;
    borrow: string;
    healthFactor: number;
  }

  const mockData = [
    {
      address: "0x1234...abcd",
      collateral: "500 SOL",
      borrow: "2500 USDC",
      healthFactor: 0.85,
    },
    {
      address: "0x5678...efgh",
      collateral: "1000 SOL",
      borrow: "5000 USDT",
      healthFactor: 0.95,
    },
    {
      address: "0x9abc...ijkl",
      collateral: "300 SOL",
      borrow: "1500 USDC",
      healthFactor: 0.65,
    },
  ];

  const fetchUnhealthyAccounts = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        
        setUnhealthyAccounts(mockData);
        setIsLoading(false);
      }, 1000); // Simulate network delay
    } catch (error) {
      console.error("Failed to fetch unhealthy accounts", error);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUnhealthyAccounts();
  }, []);

  const handleLiquidateClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen px-56 py-4 text-gray-900 mt-5 mb-20">
      {/* Role Information */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 mb-6">
        <p className="font-bold">Role:</p>
        <p>You are a liquidator. Your role is to identify and liquidate unhealthy accounts.</p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={fetchUnhealthyAccounts}
          className={`flex items-center gap-2 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-100 transition ${
            isLoading ? "opacity-50 pointer-events-none" : ""
          }`}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.93 4.93a10.11 10.11 0 0114.14 0c3.93 3.92 3.93 10.25 0 14.18M14 10l4 4m0 0l-4 4m4-4H10"
            />
          </svg>
          {isLoading ? "Refreshing..." : "Refresh Accounts"}
        </button>
      </div>

      {/* Unhealthy Accounts Table */}
      <div className="relative p-6 border border-gray-300 rounded-lg bg-white">
        <span className="absolute -top-3 left-3 bg-white px-2 text-sm font-bold text-gray-500">
          Unhealthy Accounts: {unhealthyAccounts.length}
        </span>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="pb-2">Account</th>
              <th className="pb-2 pl-4">Collateral</th>
              <th className="pb-2 pl-4">Borrow</th>
              <th className="pb-2 pl-4">Health Factor</th>
              <th className="pb-2 pl-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {unhealthyAccounts.length > 0 ? (
              unhealthyAccounts.map((account, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-4 text-gray-800">{account.address}</td>
                  <td className="py-4 pl-4">{account.collateral}</td>
                  <td className="py-4 pl-4">{account.borrow}</td>
                  <td
                    className={`py-4 pl-4 ${
                      account.healthFactor < 1
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {account.healthFactor.toFixed(2)}
                  </td>
                  <td className="py-4 pl-4">
                  <button
                    onClick={handleLiquidateClick}
                    className="bg-red-500 text-white py-1 px-4 text-sm rounded hover:bg-red-600 transition"
                    >
                    Liquidate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No unhealthy accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              The liquidation system is in the final testing phase and will be available soon.
            </p>
            <button
              onClick={closeModal}
              className="border border-red-500 text-red-500 py-1 px-4 text-sm rounded hover:bg-red-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidatePage;