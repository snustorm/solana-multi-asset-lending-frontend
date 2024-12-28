'use client'


import UserInformation from "./Info";
import UserAssets from "./Assets";
import Pools from "./Pools";

const LendingBorrowingPage = () => {

    // const {
    //     initPool,
    // } = useAppContext();


    return (
      <div className="min-h-screen px-56 py-4 text-gray-900 mt-5 mb-20">
        {/* First Section - User Information */}
        <UserInformation />

        {/* Second Section - User Assets */}
        <UserAssets />

        {/* Third Section - Available Pools */}
        <Pools />

        {/* <button
            className="button-style m-40"
             onClick={initPool}
            >
             Create Pool   
        </button> */}
      </div>
    );
  };
  
  export default LendingBorrowingPage;