import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get("window");

export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{content}</Text>
              <View style={styles.arrow} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    alignItems: "center",
    marginBottom: 60, // Position tooltip above center
  },
  tooltip: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    maxWidth: screenWidth - 40,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 16,
  },
  arrow: {
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1f2937",
  },
});
