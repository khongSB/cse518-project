import { Colors } from "@/app/constants/Colors";
import { FlattenedEventInstance } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

type EventCardProps = {
  instance: FlattenedEventInstance;
  showDate?: boolean;
  onPress: () => void;
};

export function EventCard({
  instance,
  showDate = false,
  onPress,
}: EventCardProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <View style={styles.eventTimeContainer}>
        {showDate && (
          <Text style={styles.eventDate}>
            {formatDate(instance.startDateTime)}
          </Text>
        )}
        <Text style={styles.eventTime}>
          {formatTime(instance.startDateTime)}
        </Text>
        <Text style={styles.eventEndTime}>
          - {formatTime(instance.endDateTime)}
        </Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{instance.event.name}</Text>
        <Text style={styles.eventLocation}>{instance.event.location}</Text>
        <View style={styles.badgesRow}>
          <View
            style={[
              styles.eventTypeBadge,
              {
                backgroundColor: getEventTypeStyles(instance.event.type)
                  .backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.eventTypeText,
                {
                  color: getEventTypeStyles(instance.event.type).color,
                },
              ]}
            >
              {instance.event.type}
            </Text>
          </View>
          {instance.event.isFavorited && (
            <Ionicons name="heart" size={16} color={Colors.red} />
          )}
          {instance.isRSVPed && (
            <View style={styles.rsvpBadge}>
              <Text style={styles.rsvpBadgeText}>RSVP'd</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTimeContainer: {
    width: 80,
    marginRight: 12,
  },
  eventDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  eventEndTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  eventTypeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  rsvpBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rsvpBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
});
