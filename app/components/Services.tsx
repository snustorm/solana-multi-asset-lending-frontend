import React from "react";

const Services = () => {
  return (
    <div className="w-full max-w-7xl m-16 px-56">
      <h2 className="text-4xl font-bold text-white text-center mb-12">
        Our Services
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Decentralized Lending
          </h3>
          <p className="text-gray-300 text-sm">
            Seamlessly lend your assets and earn attractive returns in a
            trustless environment.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Borrowing Made Simple
          </h3>
          <p className="text-gray-300 text-sm">
            Access funds instantly by using your crypto as collateral with
            competitive interest rates.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Real-Time Analytics
          </h3>
          <p className="text-gray-300 text-sm">
            Stay updated with real-time data on supply, borrowing, and market
            trends.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Secure Transactions
          </h3>
          <p className="text-gray-300 text-sm">
            All transactions are protected with the highest level of blockchain
            security.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Low Fees
          </h3>
          <p className="text-gray-300 text-sm">
            Enjoy some of the lowest transaction fees in the industry with
            Solana fast network.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center h-44 w-full bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Seamless Integration
          </h3>
          <p className="text-gray-300 text-sm">
            Easily integrate our protocol into your existing financial
            workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;