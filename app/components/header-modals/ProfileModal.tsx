import { Colors } from "@/app/constants/Colors";
import { useData } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { user, signOut } = useData();

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.profileModalContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileIconLarge}>
            <Ionicons name="person" size={40} color={Colors.text} />
          </View>
          <Text style={styles.profileName}>{user?.username}</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  profileModalContainer: {
    position: "absolute",
    top: 130,
    right: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
    padding: 16,
    width: 200,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  profileIconLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  signOutButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutText: {
    color: Colors.red,
    fontWeight: "600",
    fontSize: 14,
  },
});
