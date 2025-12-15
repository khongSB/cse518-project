import { Colors } from "@/app/constants/Colors";
import { useData } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  notificationsOn: boolean;
  setNotificationsOn: (val: boolean) => void;
  setShowBarcodeModal: (val: boolean) => void;
  setShowLinksModal: (val: boolean) => void;
  setShowSignInModal: (val: boolean) => void;
  setShowProfileModal: (val: boolean) => void;
}

export function CustomHeader({
  notificationsOn,
  setNotificationsOn,
  setShowBarcodeModal,
  setShowLinksModal,
  setShowSignInModal,
  setShowProfileModal,
}: CustomHeaderProps) {
  const { user } = useData();

  return (
    <SafeAreaView edges={["top"]} style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowLinksModal(true)}
        >
          <Ionicons name="link" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNotificationsOn(!notificationsOn)}
          >
            <Ionicons
              name={notificationsOn ? "notifications" : "notifications-outline"}
              size={24}
              color={notificationsOn ? Colors.primary : Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowBarcodeModal(true)}
          >
            <Ionicons name="barcode-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          {user ? (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setShowProfileModal(true)}
            >
              <Ionicons name="person" size={24} color={Colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => setShowSignInModal(true)}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.background,
  },
  headerContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mediumGray,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mediumGray,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
