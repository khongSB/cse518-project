import { Colors } from "@/app/constants/Colors";
import { FlattenedEventInstance, useData } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const getEventTypeStyles = (type: string) => {
  switch (type) {
    case "aquatics":
      return { backgroundColor: Colors.aquatics, color: Colors.text };
    case "group-fitness":
      return { backgroundColor: Colors.groupFitness, color: Colors.white };
    case "sports-club":
      return { backgroundColor: Colors.sportsClub, color: Colors.white };
    case "other":
      return { backgroundColor: Colors.other, color: Colors.text };
    default:
      return { backgroundColor: Colors.lightGray, color: Colors.textSecondary };
  }
};

type EventModalProps = {
  selectedInstance: FlattenedEventInstance | null | undefined;
  visible: boolean;
  onClose: () => void;
  onSelectInstance?: (instance: FlattenedEventInstance) => void;
};

export function EventModal({
  selectedInstance,
  visible,
  onClose,
  onSelectInstance,
}: EventModalProps) {
  const { toggleFavorite, toggleRSVP } = useData();

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMarkedDates = () => {
    if (!selectedInstance) return {};

    const marks: any = {};

    selectedInstance.event.instances.forEach((instance) => {
      const dateStr = instance.startDateTime.split("T")[0];
      marks[dateStr] = {
        marked: true,
        dotColor: Colors.primary,
      };
    });

    if (selectedInstance.id !== "-1") {
      const selectedDateStr = selectedInstance.startDateTime.split("T")[0];
      marks[selectedDateStr] = {
        ...marks[selectedDateStr],
        selected: true,
        selectedColor: Colors.primary,
        selectedTextColor: Colors.white,
        dotColor: Colors.white,
      };
    }

    return marks;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.modalTitle}>
                {selectedInstance?.event.name}
              </Text>
              {selectedInstance && (
                <View
                  style={[
                    styles.eventTypeBadge,
                    {
                      backgroundColor: getEventTypeStyles(
                        selectedInstance.event.type
                      ).backgroundColor,
                      marginTop: 8,
                      alignSelf: "flex-start",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventTypeText,
                      {
                        color: getEventTypeStyles(selectedInstance.event.type)
                          .color,
                      },
                    ]}
                  >
                    {selectedInstance.event.type}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() =>
                selectedInstance && toggleFavorite(selectedInstance.event.id)
              }
            >
              <Ionicons
                name={
                  selectedInstance?.event.isFavorited
                    ? "heart"
                    : "heart-outline"
                }
                size={24}
                color={selectedInstance?.event.isFavorited ? "red" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalTimeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTime}>
                {selectedInstance && selectedInstance.id !== "-1"
                  ? formatDate(new Date(selectedInstance.startDateTime))
                  : "Date"}
              </Text>
              <Text style={styles.modalTime}>
                {selectedInstance && selectedInstance.id !== "-1"
                  ? `${formatTime(
                      selectedInstance.startDateTime
                    )} - ${formatTime(selectedInstance.endDateTime)}`
                  : "Time"}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                selectedInstance?.isRSVPed && styles.rsvpButtonActive,
                selectedInstance?.id === "-1" && { opacity: 0.5 },
              ]}
              disabled={selectedInstance?.id === "-1"}
              onPress={() =>
                selectedInstance &&
                toggleRSVP(selectedInstance.event.id, selectedInstance.id)
              }
            >
              <Text style={styles.rsvpButtonText}>
                {selectedInstance?.isRSVPed ? "RSVP'd" : "RSVP"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ height: 80, marginBottom: 20 }}>
            <Text style={styles.modalDescription}>
              {selectedInstance?.event.description}
            </Text>
          </ScrollView>

          <Text style={styles.sectionTitle}>Other times:</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              current={
                selectedInstance
                  ? selectedInstance.startDateTime.split("T")[0]
                  : undefined
              }
              onDayPress={(day: { dateString: string }) => {
                if (!selectedInstance || !onSelectInstance) return;

                const clickedDate = day.dateString;

                // Check if clicking the currently selected date to deselect
                if (
                  selectedInstance.id !== "-1" &&
                  selectedInstance.startDateTime.startsWith(clickedDate)
                ) {
                  onSelectInstance({
                    ...selectedInstance,
                    id: "-1",
                    isRSVPed: false,
                  });
                  return;
                }

                const targetInstance = selectedInstance.event.instances.find(
                  (inst) => inst.startDateTime.startsWith(clickedDate)
                );

                if (targetInstance) {
                  const flattened: FlattenedEventInstance = {
                    ...targetInstance,
                    event: selectedInstance.event,
                  };
                  onSelectInstance(flattened);
                }
              }}
              markedDates={getMarkedDates()}
              theme={{
                todayTextColor: "black",
                arrowColor: "black",
                dotColor: "black",
                selectedDayBackgroundColor: "black",
                selectedDayTextColor: "white",
              }}
            />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "90%",
    height: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTime: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  rsvpButton: {
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rsvpButtonActive: {
    backgroundColor: "#666",
  },
  rsvpButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 24,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  closeButton: {
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: "auto",
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
});
