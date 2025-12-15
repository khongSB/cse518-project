import { EventModal } from "@/app/components/EventModal";
import { Colors } from "@/app/constants/Colors";
import { FlattenedEventInstance, useData } from "@/app/context/DataContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function EventsScreen() {
  const { events, getFlattenedInstances } = useData();
  const [searchQuery, setSearchQuery] = useState("");
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

  const searchedEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typeFilters = Array.from(
    new Set(searchedEvents.map((e) => e.type))
  ).sort((a, b) => {
    if (a === "other") return 1;
    if (b === "other") return -1;
    return a.localeCompare(b);
  });

  const locationFilters = Array.from(
    new Set(searchedEvents.map((e) => e.location))
  ).sort();

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleEventPress = (event: any) => {
    // Create a "null" instance for the selected event
    const nullInstance: FlattenedEventInstance = {
      id: "-1",
      event: event,
      startDateTime:
        event.instances[0]?.startDateTime || new Date().toISOString(),
      endDateTime: event.instances[0]?.endDateTime || new Date().toISOString(),
      isRSVPed: false,
    };
    setSelectedInstance(nullInstance);
  };

  const favoriteEvents = events
    .filter((event) => event.isFavorited)
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredEvents = searchedEvents
    .filter((event) => {
      if (activeFilters.length === 0) return true;

      const selectedTypes = activeFilters.filter((f) =>
        typeFilters.includes(f)
      );
      const selectedLocations = activeFilters.filter((f) =>
        locationFilters.includes(f)
      );

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(event.type);
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(event.location);

      return matchesType && matchesLocation;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Events</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            {favoriteEvents.length > 0 ? (
              <ScrollView
                style={{ maxHeight: 140 }}
                contentContainerStyle={styles.listContainer}
                nestedScrollEnabled={true}
              >
                {favoriteEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.listItem}
                    onPress={() => handleEventPress(event)}
                  >
                    <Text style={styles.listItemText}>{event.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No favorites yet</Text>
            )}
          </View>

          <View style={[styles.section, { flex: 1, marginBottom: 0 }]}>
            <Text style={styles.sectionTitle}>A-Z</Text>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
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

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[
                styles.listContainer,
                { paddingBottom: 100 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.listItem}
                  onPress={() => handleEventPress(event)}
                >
                  <Text style={styles.listItemText}>{event.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      <EventModal
        selectedInstance={liveSelectedInstance}
        visible={selectedInstance !== null}
        onClose={() => setSelectedInstance(null)}
        onSelectInstance={(instance) => setSelectedInstance(instance)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 15,
  },
  listContainer: {
    gap: 0,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
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
});
