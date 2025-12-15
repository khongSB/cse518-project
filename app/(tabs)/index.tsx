import { EventCard } from "@/app/components/EventCard";
import { EventModal } from "@/app/components/EventModal";
import { Colors } from "@/app/constants/Colors";
import { FlattenedEventInstance, useData } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getFilterButtonStyles = (type: string, isActive: boolean) => {
  switch (type) {
    case "aquatics":
      return {
        backgroundColor: isActive ? Colors.aquatics : Colors.aquaticsLight,
        borderColor: isActive ? Colors.aquatics : Colors.aquaticsLight,
      };
    case "group-fitness":
      return {
        backgroundColor: isActive
          ? Colors.groupFitness
          : Colors.groupFitnessLight,
        borderColor: isActive ? Colors.groupFitness : Colors.groupFitnessLight,
      };
    case "sports-club":
      return {
        backgroundColor: isActive ? Colors.sportsClub : Colors.sportsClubLight,
        borderColor: isActive ? Colors.sportsClub : Colors.sportsClubLight,
      };
    case "other":
      return {
        backgroundColor: isActive ? Colors.other : Colors.otherLight,
        borderColor: isActive ? Colors.other : Colors.otherLight,
      };
    default:
      return isActive
        ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
        : { backgroundColor: Colors.lightGray, borderColor: Colors.lightGray };
  }
};

const getFilterTextStyles = (type: string, isActive: boolean) => {
  switch (type) {
    case "aquatics":
      return { color: Colors.text };
    case "group-fitness":
      return { color: isActive ? Colors.white : Colors.text };
    case "sports-club":
      return { color: isActive ? Colors.white : Colors.text };
    case "other":
      return { color: Colors.text };
    default:
      return { color: isActive ? Colors.white : Colors.textSecondary };
  }
};

export default function TodayScreen() {
  const { events, getFlattenedInstances } = useData();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
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

  const instancesOnDate = allInstances.filter(
    (instance: FlattenedEventInstance) => {
      const instanceDate = new Date(instance.startDateTime);
      return (
        instanceDate.getDate() === date.getDate() &&
        instanceDate.getMonth() === date.getMonth() &&
        instanceDate.getFullYear() === date.getFullYear()
      );
    }
  );

  const typeFilters = Array.from(
    new Set(instancesOnDate.map((i) => i.event.type))
  ).sort((a, b) => {
    if (a === "other") return 1;
    if (b === "other") return -1;
    return a.localeCompare(b);
  });

  const locationFilters = Array.from(
    new Set(instancesOnDate.map((i) => i.event.location))
  ).sort();

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filteredInstances = instancesOnDate.filter(
    (instance: FlattenedEventInstance) => {
      if (activeFilters.length === 0) return true;

      const selectedTypes = activeFilters.filter((f) =>
        typeFilters.includes(f)
      );
      const selectedLocations = activeFilters.filter((f) =>
        locationFilters.includes(f)
      );

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(instance.event.type);
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(instance.event.location);

      return matchesType && matchesLocation;
    }
  );

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
    setActiveFilters([]); // Reset filters when the date changes
  };

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.titleRow}
            onPress={() => setShow(!show)}
          >
            <Text style={styles.title}>{formatDate(date)}</Text>
            <Ionicons name="chevron-down" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.subtitle}>open 6:00 to 23:00</Text>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#666" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {typeFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    getFilterButtonStyles(
                      filter,
                      activeFilters.includes(filter)
                    ),
                  ]}
                  onPress={() => toggleFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      getFilterTextStyles(
                        filter,
                        activeFilters.includes(filter)
                      ),
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={20} color="#666" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            >
              {locationFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilters.includes(filter) && {
                      backgroundColor: Colors.location,
                      borderColor: Colors.location,
                    },
                    !activeFilters.includes(filter) && {
                      backgroundColor: Colors.locationLight,
                      borderColor: Colors.locationLight,
                    },
                  ]}
                  onPress={() => toggleFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: Colors.text }, // Always black text for location
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.eventsList}>
          {filteredInstances.map(
            (instance: FlattenedEventInstance, index: number) => (
              <EventCard
                key={index}
                instance={instance}
                onPress={() => setSelectedInstance(instance)}
              />
            )
          )}
        </View>
      </ScrollView>

      {show && (
        <>
          <Pressable style={styles.overlay} onPress={() => setShow(false)} />
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              onChange={onChange}
              display={Platform.OS === "ios" ? "inline" : "default"}
              themeVariant="light"
              accentColor={Colors.primary}
              style={styles.datePicker}
            />
          </View>
        </>
      )}

      <EventModal
        selectedInstance={liveSelectedInstance}
        visible={selectedInstance !== null}
        onClose={() => setSelectedInstance(null)}
        onSelectInstance={(instance) => setSelectedInstance(instance)}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    marginLeft: 4,
  },
  filterContainer: {
    marginBottom: 20,
    gap: 6,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    marginRight: 8,
  },
  filterContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  eventsList: {
    gap: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  datePickerContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
    padding: 8,
  },
  datePicker: {
    height: 300,
    width: 300,
  },
});
