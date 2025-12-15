import { Colors } from "@/app/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LinksModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LinksModal({ visible, onClose }: LinksModalProps) {
  const links: [string, string][] = [
    ["IMLeagues", "https://imleagues.com"],
    [
      "Facility Reservations",
      "https://members.reccenter.stonybrook.edu/booking",
    ],
    [
      "Health Education Resources",
      "https://www.stonybrook.edu/commcms/studentaffairs/cpo/resources/health_education_resources.php",
    ],
    ["Instagram", "https://www.instagram.com/sburecandwellness/?hl=en"],
  ];

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
            <Text style={styles.modalTitle}>Links</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400, width: "95%" }}>
            {links.map(([title, url], index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkItem}
                onPress={() => WebBrowser.openBrowserAsync(url)}
              >
                <Text style={styles.linkText}>{title}</Text>
                <Ionicons
                  name="open-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    width: "100%",
  },
  linkText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    flex: 1,
  },
});
