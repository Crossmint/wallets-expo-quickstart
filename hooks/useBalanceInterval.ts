import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Balances, useWallet } from "@crossmint/client-sdk-react-native-ui";

export function useBalanceInterval({
  interval = 5000,
}: { interval?: number } = {}) {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balances | undefined>(undefined);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const fetchAndSetBalances = useCallback(
    async (manual = false) => {
      try {
        if (manual) {
          setIsManualRefreshing(true);
        }
        const updatedBalances = await wallet?.balances(["usdxm"]);
        const currentUsdxmBalance = balances?.tokens.find(
          (token) => token.symbol === "usdxm"
        )?.amount;
        const updatedUsdxmBalance = updatedBalances?.tokens.find(
          (token) => token.symbol === "usdxm"
        )?.amount;
        if (currentUsdxmBalance !== updatedUsdxmBalance) {
          setBalances(updatedBalances);
        }
      } catch (error) {
        Alert.alert("Error fetching balances", `${error}`);
      } finally {
        if (manual) {
          setIsManualRefreshing(false);
        }
      }
    },
    [wallet, balances]
  );

  useEffect(() => {
    const intervalRef = setInterval(() => {
      fetchAndSetBalances();
    }, interval);
    return () => clearInterval(intervalRef);
  }, [wallet, balances, interval, fetchAndSetBalances]);

  useEffect(() => {
    fetchAndSetBalances();
  }, [wallet]);

  return {
    balances,
    setBalances,
    triggerManualRefresh: () => fetchAndSetBalances(true),
    isManualRefreshing,
  };
}
