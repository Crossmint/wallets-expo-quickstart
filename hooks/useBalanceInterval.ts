import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";

export function useBalanceInterval({
  interval = 5000,
}: { interval?: number } = {}) {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<any>(undefined);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const fetchAndSetBalances = useCallback(
    async (manual = false) => {
      try {
        if (manual) {
          setIsManualRefreshing(true);
        }
        const updatedBalances = await wallet?.balances(["usdxm", "usdc"]);
        const hasChanged = ["usdxm", "usdc"].some((sym) => {
          const current = balances?.tokens?.find(
            (token: any) => token.symbol === sym
          )?.amount;
          const updated = updatedBalances?.tokens?.find(
            (token: any) => token.symbol === sym
          )?.amount;
          return current !== updated;
        });
        if (hasChanged) {
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
