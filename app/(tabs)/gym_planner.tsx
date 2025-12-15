import { EditWorkoutModal } from "@/app/components/EditWorkoutModal";
import { ExerciseModal } from "@/app/components/ExerciseModal";
import { PerformWorkoutModal } from "@/app/components/PerformWorkoutModal";
import { Colors } from "@/app/constants/Colors";
import { useData } from "@/app/context/DataContext";
import { Exercise, Workout } from "@/app/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS = ["M", "T", "W", "R", "F", "Sa", "Su"];

export default function GymPlannerScreen() {
  const { workouts, addWorkout, editWorkout, deleteWorkout, exercises } =
    useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [performModalVisible, setPerformModalVisible] = useState(false);
  const [workoutToPerform, setWorkoutToPerform] = useState<Workout | null>(
    null
  );

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const searchedExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const muscleFilters = Array.from(
    new Set(searchedExercises.flatMap((e) => e.associatedMuscles))
  ).sort();

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filteredExercises = searchedExercises
    .filter((exercise) => {
      if (activeFilters.length === 0) return true;
      return activeFilters.every((filter) =>
        exercise.associatedMuscles.includes(filter)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalVisible(true);
  };

  const handleAddWorkout = () => {
    setSelectedWorkout(null);
    setModalVisible(true);
  };

  const handleStartWorkout = (workout: Workout) => {
    setWorkoutToPerform(workout);
    setPerformModalVisible(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const handleConfirmWorkout = (workout: Workout) => {
    if (selectedWorkout) {
      editWorkout(workout);
    } else {
      addWorkout(workout);
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteWorkout(workoutId),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <View>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>My Workouts</Text>
            <TouchableOpacity onPress={handleAddWorkout}>
              <Ionicons name="add-circle" size={36} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          {workouts.length > 0 && (
            <Text style={styles.headerCaption}>Tap a workout to start</Text>
          )}
        </View>
      </View>

      <View style={styles.workoutsContainer}>
        <ScrollView contentContainerStyle={styles.workoutsScrollContent}>
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No workouts yet.</Text>
              <Text style={styles.emptyStateSubText}>
                Tap the + button to create one!
              </Text>
            </View>
          ) : (
            workouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.cardContentContainer}>
                  <TouchableOpacity
                    style={styles.cardLeftColumn}
                    onPress={() => handleStartWorkout(workout)}
                  >
                    <View style={styles.nameAndGoal}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <View style={styles.goalBadge}>
                        <Text style={styles.goalText}>{workout.goal}</Text>
                      </View>
                    </View>

                    <View style={styles.daysAndTimesRow}>
                      <View style={styles.daysRow}>
                        {workout.days.map((active, index) => (
                          <View
                            key={index}
                            style={[
                              styles.dayIndicator,
                              active && styles.dayIndicatorActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayIndicatorText,
                                active && styles.dayIndicatorTextActive,
                              ]}
                            >
                              {DAYS[index]}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.timeIcons}>
                        {workout.times[0] && (
                          <Ionicons
                            name="sunny"
                            size={16}
                            color={Colors.primary}
                          />
                        )}
                        {workout.times[2] && (
                          <Ionicons
                            name="moon"
                            size={16}
                            color={Colors.primary}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.cardRightColumn}>
                    <TouchableOpacity
                      onPress={() => handleEditWorkout(workout)}
                    >
                      <Ionicons name="pencil" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteWorkout(workout.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.exercisesHeaderSection}>
        <Text style={styles.sectionTitle}>Exercises</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="filter" size={20} color="#666" />
              </View>
              <View style={styles.filterContent}>
                <View style={styles.filterRow}>
                  {muscleFilters.map((filter) => {
                    const isActive = activeFilters.includes(filter);
                    return (
                      <TouchableOpacity
                        key={filter}
                        style={[
                          styles.filterButton,
                          isActive && styles.filterButtonActive,
                        ]}
                        onPress={() => toggleFilter(filter)}
                      >
                        <Text
                          style={[
                            styles.filterText,
                            isActive && styles.filterTextActive,
                          ]}
                        >
                          {filter}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(item)}
          >
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMuscles}>
                {item.associatedMuscles.join(", ")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No exercises found.</Text>
        }
      />

      <EditWorkoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmWorkout}
        initialWorkout={selectedWorkout}
      />

      <PerformWorkoutModal
        visible={performModalVisible}
        onClose={() => setPerformModalVisible(false)}
        workout={workoutToPerform}
      />

      <ExerciseModal
        visible={exerciseModalVisible}
        onClose={() => setExerciseModalVisible(false)}
        exercise={selectedExercise}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerCaption: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  workoutsContainer: {
    height: 240,
    borderBottomWidth: 1,
    borderBottomColor: Colors.mediumGray,
  },
  workoutsScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  emptyState: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  workoutCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
  },
  cardContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLeftColumn: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
  },
  cardRightColumn: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingLeft: 10,
  },
  nameAndGoal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  daysAndTimesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  daysRow: {
    flexDirection: "row",
    gap: 5,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.mediumGray,
    justifyContent: "center",
    alignItems: "center",
  },
  dayIndicatorActive: {
    backgroundColor: Colors.primary,
  },
  dayIndicatorText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dayIndicatorTextActive: {
    color: Colors.white,
    fontWeight: "bold",
  },
  timeIcons: {
    flexDirection: "row",
    gap: 8,
  },
  goalBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
    textTransform: "lowercase",
  },
  // Exercises Section Styles
  exercisesHeaderSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.background,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
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
    color: Colors.text,
  },
  filterContainer: {
    marginBottom: 10,
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
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.sbNavyBlue,
    borderColor: Colors.sbNavyBlue,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  filterTextActive: {
    color: Colors.white,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseMuscles: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});
