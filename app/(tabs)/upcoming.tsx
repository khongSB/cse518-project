import { EventCard } from "@/app/components/EventCard";
import { EventModal } from "@/app/components/EventModal";
import { FlattenedEventInstance, useData } from "@/app/context/DataContext";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpcomingScreen() {
  const { events, getFlattenedInstances } = useData();
  const [selectedInstance, setSelectedInstance] =
    useState<FlattenedEventInstance | null>(null);

  const allInstances = getFlattenedInstances();

  const liveSelectedInstance = useMemo(() => {
    if (!selectedInstance) return null;
    if (selectedInstance.id === "-1") {
      const updatedEvent = events.find(
        (e) => e.id === selectedInstance.event.id
      );
      return updatedEvent
        ? { ...selectedInstance, event: updatedEvent }
        : selectedInstance;
    }
    return (
      allInstances.find((i) => i.id === selectedInstance.id) || selectedInstance
    );
  }, [selectedInstance, events, allInstances]);

  const upcomingInstances = allInstances.filter(
    (instance: FlattenedEventInstance) => {
      const instanceDate = new Date(instance.startDateTime);
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const isWithin7Days =
        instanceDate >= now && instanceDate <= sevenDaysFromNow;
      const isRelevant = instance.event.isFavorited || instance.isRSVPed;

      return isRelevant && isWithin7Days;
    }
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming</Text>
        </View>

        {upcomingInstances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No upcoming events. Favorite or RSVP to events to see them here.
            </Text>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {upcomingInstances.map((instance: FlattenedEventInstance) => (
              <EventCard
                key={instance.id}
                instance={instance}
                showDate={true}
                onPress={() => setSelectedInstance(instance)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <EventModal
        selectedInstance={liveSelectedInstance}
        visible={selectedInstance !== null}
        onClose={() => setSelectedInstance(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  eventsList: {
    gap: 16,
  },
});
