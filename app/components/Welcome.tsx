import { AiFillPlayCircle } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";  
import { BsInfoCircle } from "react-icons/bs";
import React from "react";

const companyCommonStyles = `
  min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] 
  flex justify-center items-center 
  border-[0.5px] border-gray-400 text-sm font-light text-white 
  hover:bg-gray-700 transition-all duration-300
`;

const Welcome = () => {
  
  
    return (
    <div className="flex w-full justify-center items-center  px-56">
      <div className="flex mf:flex-row flex-col items-start justify-between py-12 w-full max-w-7xl">
        {/* Left Section */}
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white font-bold text-gradient py-1">
          Grow Wealth <br /> with Lending on <br /> Solana
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
          Trustless, transparent, and accessible to everyone / everywhere. 
          </p>
          
          {/* Features Grid */}
          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10 gap-2">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Security</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Solana
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Web 3.0
            </div>
            <div className={companyCommonStyles}>Low Fees</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              High Speed
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
            <div className="grid grid-cols-2 gap-[8px] w-fit">
                {/* Square 1 */}
                <div className="flex flex-col justify-center items-center h-44 w-44 bg-yellow-400/80 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-black text-lg font-medium">APY</p>
                <p className="text-black text-2xl font-bold">~38%</p>
                </div>
                {/* Square 2 */}
                <div className="flex flex-col justify-center items-center h-44 w-44 bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-white text-lg font-medium">Borrowed</p>
                <p className="text-white text-2xl font-bold">$1.2M</p>
                </div>
                {/* Square 3 */}
                <div className="flex flex-col justify-center items-center h-44 w-44 bg-gradient-to-br from-gray-800 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-white text-lg font-medium">Supply</p>
                <p className="text-white text-2xl font-bold">$2.4M</p>
                </div>
                {/* Square 4 */}
                <div className="flex flex-col justify-center items-center h-44 w-44 bg-yellow-400/80 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-black text-lg font-medium">Max LTV</p>
                <p className="text-black text-2xl font-bold">75%</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;