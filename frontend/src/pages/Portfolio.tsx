import React from 'react';
import { motion } from 'framer-motion';
import { LineChart as LineChartIcon, Wallet, History } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

interface TokenBalance {
  token: string;
  balance: string;
  value: number;
}

const Portfolio = () => {
  const { authenticated, user, ready } = usePrivy();
  const [totalBalance, setTotalBalance] = React.useState<number>(0);
  const [balances, setBalances] = React.useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTokenBalances = async () => {
    if (!user?.wallet?.address) return;

    try {
      setIsLoading(true);
      setError(null);

      // Example: Fetch ETH balance
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_BASE_SEPOLIA_RPC_URL);
      const ethBalance = await provider.getBalance(user.wallet.address);
      const ethBalanceInEther = ethers.formatEther(ethBalance);

      // Example: Get ETH price from an API
      const ethPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const ethPriceData = await ethPriceResponse.json();
      const ethPrice = ethPriceData.ethereum.usd;

      const ethValue = parseFloat(ethBalanceInEther) * ethPrice;

      // Add more token balance fetching logic here
      const newBalances: TokenBalance[] = [
        {
          token: 'ETH',
          balance: ethBalanceInEther,
          value: ethValue
        }
      ];

      setBalances(newBalances);
      setTotalBalance(newBalances.reduce((acc, curr) => acc + curr.value, 0));
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to fetch portfolio data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchTokenBalances();
    }
  }, [authenticated, user?.wallet?.address]);

  if (!ready) {
    return (
      <div className="pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold">Please connect your wallet to view your portfolio</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Portfolio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold">
            {isLoading ? 'Loading...' : `$${totalBalance.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <LineChartIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Connected Wallet</h3>
          </div>
          <p className="text-sm font-mono">
            {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
          </p>
        </div>

        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Token Count</h3>
          </div>
          <p className="text-3xl font-bold">{balances.length}</p>
        </div>
      </motion.div>

      {/* Token List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary/50 p-6 rounded-lg mb-8"
      >
        <h3 className="text-xl font-semibold mb-6">Token Balances</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4">Token</th>
                <th className="pb-4">Balance</th>
                <th className="pb-4">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance, index) => (
                <tr key={balance.token} className="border-t border-border">
                  <td className="py-4">{balance.token}</td>
                  <td className="py-4">{parseFloat(balance.balance).toFixed(6)}</td>
                  <td className="py-4">${balance.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;