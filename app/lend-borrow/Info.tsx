'use client'

import { useAppContext } from "../context/AppContext";

const UserInformation = () => {

    const {
        
        userTotalDeposit,
        userTotalBorrow,
    } = useAppContext();


    return (
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Your Account Overview</h2>
        <div className="grid grid-cols-4 gap-4 p-4 rounded-lg text-center text-sm">
          <div className="flex flex-col items-center">
            <p className="font-medium text-gray-700">Total Borrowed</p>
            <p className="font-bold text-lg text-gray-900">${userTotalBorrow}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-medium text-gray-700">Total Supplied</p>
            <p className="font-bold text-lg text-gray-900">${userTotalDeposit}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-medium text-gray-700">Wallet Balance</p>
            <p className="font-bold text-lg text-gray-900">$800</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-medium text-gray-700">Borrowing Capacity</p>
            <p className="font-bold text-lg text-gray-900">75%</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserInformation;