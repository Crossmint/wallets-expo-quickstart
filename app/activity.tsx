import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useWallet,
  type Activity,
} from "@crossmint/client-sdk-react-native-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ActivityComponent() {
  const { wallet } = useWallet();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!wallet) return;

    const fetchActivity = async () => {
      try {
        const activity = await wallet.experimental_activity();
        setActivity(activity);
      } catch (_error) {
        // Failed to fetch activity
      } finally {
        setHasInitiallyLoaded(true);
      }
    };

    fetchActivity();
    // Poll every 8s—txns may take a few seconds to appear; 8s is a good balance.
    intervalRef.current = setInterval(() => {
      fetchActivity();
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [wallet]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(
      timestamp < 10000000000 ? timestamp * 1000 : timestamp
    );
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    if (diffInMs < 0) {
      return "just now";
    }
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  if (!hasInitiallyLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#64748b" />
          <Text style={styles.loadingText}>Loading activity...</Text>
        </View>
      </View>
    );
  }

  if (!activity?.events || activity.events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Your activity feed</Text>
          <Text style={styles.emptyStateDescription}>
            When you add and send money it shows up here. Get started with
            adding money to your account.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      <ScrollView
        style={styles.activityList}
        showsVerticalScrollIndicator={false}
      >
        {activity.events.map((event, index) => {
          const isIncoming =
            event.to_address.toLowerCase() === wallet?.address.toLowerCase();

          return (
            <View
              key={`${event.transaction_hash}-${index}`}
              style={[
                styles.activityItem,
                index % 2 === 0 ? styles.evenItem : styles.oddItem,
              ]}
            >
              <View style={styles.activityItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    isIncoming ? styles.incomingIcon : styles.outgoingIcon,
                  ]}
                >
                  <Ionicons
                    name={isIncoming ? "arrow-down" : "arrow-up"}
                    size={16}
                    color={isIncoming ? "#16a34a" : "#3b82f6"}
                  />
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityType}>
                      {isIncoming ? "Received" : "Sent"}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(event.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.addressText}>
                    {isIncoming
                      ? `From ${formatAddress(event.from_address)}`
                      : `To ${formatAddress(event.to_address)}`}
                  </Text>
                </View>
              </View>
              <View style={styles.activityItemRight}>
                <Text
                  style={[
                    styles.amount,
                    isIncoming ? styles.incomingAmount : styles.outgoingAmount,
                  ]}
                >
                  {isIncoming ? "+" : "-"}${event.amount}
                </Text>
                <Text style={styles.tokenSymbol}>{event?.token_symbol}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  activityList: {
    flex: 1,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  evenItem: {
    backgroundColor: "#ffffff",
  },
  oddItem: {
    backgroundColor: "#f8fafc",
  },
  activityItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  incomingIcon: {
    backgroundColor: "#dcfce7",
  },
  outgoingIcon: {
    backgroundColor: "#dbeafe",
  },
  activityDetails: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  activityType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },
  addressText: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "monospace",
  },
  activityItemRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  incomingAmount: {
    color: "#16a34a",
  },
  outgoingAmount: {
    color: "#0f172a",
  },
  tokenSymbol: {
    fontSize: 12,
    color: "#64748b",
  },
});
