import { Colors } from "@/app/constants/Colors";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BarcodeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function BarcodeModal({ visible, onClose }: BarcodeModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Membership</Text>
            <Text style={styles.modalSubtitle}>12 Dec 2025</Text>
          </View>

          <View style={styles.barcodeContainer}>
            <View style={styles.barcodeLines}>
              {[...Array(35)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeLine,
                    { width: Math.random() > 0.5 ? 5 : 10, marginRight: 5 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.barcodeText}>1234 5678 9101</Text>
          </View>

          <View style={styles.guestPassRow}>
            <TouchableOpacity>
              <Text style={styles.guestPassButton}>Guest Pass</Text>
            </TouchableOpacity>
            <Text style={styles.guestPassCount}>x0</Text>
          </View>

          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>Purchase</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "90%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 0,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  barcodeContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  barcodeLines: {
    flexDirection: "row",
    height: 150,
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
  },
  barcodeLine: {
    backgroundColor: Colors.primary,
  },
  barcodeText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.text,
    letterSpacing: 2,
  },
  guestPassRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  guestPassButton: {
    fontSize: 18,
    color: Colors.blue,
    fontWeight: "600",
    marginRight: 8,
  },
  guestPassCount: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  purchaseButton: {
    backgroundColor: Colors.text,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  purchaseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
