const UserAssets = () => {
    const supplyAssets = [
      { name: "USDC", price: "$1.00", amount: "1000", value: "$1000", icon: "usdc.png" },
      { name: "USDT", price: "$1.00", amount: "500", value: "$500", icon: "usdt.png" },
      { name: "SOL", price: "$30.00", amount: "10", value: "$300", icon: "sol.png" },
      { name: "sSOL", price: "$32.00", amount: "5", value: "$160", icon: "sSol.png" },
    ];
  
    const borrowAssets = [
      { name: "USDC", price: "$1.00", amount: "400", value: "$400", icon: "usdc.png" },
      { name: "USDT", price: "$1.00", amount: "200", value: "$200", icon: "usdt.png" },
      { name: "SOL", price: "$30.00", amount: "2", value: "$60", icon: "sol.png" },
      { name: "sSOL", price: "$32.00", amount: "3", value: "$96", icon: "sSol.png" },
    ];
  
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
              {supplyAssets.map((asset, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {/* Display token icon */}
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
                      className="text-white px-3 py-1 text-xs rounded border border-transparent hover:opacity-90"
                      style={{ backgroundColor: "#15be75" }}
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))}
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
              {borrowAssets.map((asset, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {/* Display token icon */}
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
                      className="text-black  px-3 py-1 text-xs rounded border border-transparent hover:opacity-90"
                      style={{ backgroundColor: "#fcd303" }}
                    >
                      Repay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default UserAssets;