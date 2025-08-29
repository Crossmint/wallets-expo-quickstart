import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import "../utils/polyfills";
import CrossmintProviders from "./providers";

export default function RootLayout() {
  return (
    <CrossmintProviders>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              flex: 1,
            },
          }}
        >
          <Stack.Screen name="wallet" />
          <Stack.Screen name="authenticate" />
        </Stack>
      </View>
    </CrossmintProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
