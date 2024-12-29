'use client';
import dynamic from "next/dynamic";

// Dynamically import components with SSR disabled
const UserInformation = dynamic(() => import("./Info"), { ssr: false });
const UserAssets = dynamic(() => import("./Assets"), { ssr: false });
const Pools = dynamic(() => import("./Pools"), { ssr: false });

const LendingBorrowingPage = () => {
    return (
        <div className="min-h-screen px-56 py-4 text-gray-900 mt-5 mb-20">
            {/* First Section - User Information */}
            <UserInformation />

            {/* Second Section - User Assets */}
            <UserAssets />

            {/* Third Section - Available Pools */}
            <Pools />
        </div>
    );
};

export default LendingBorrowingPage;