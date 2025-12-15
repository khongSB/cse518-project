import { Colors } from "@/app/constants/Colors";
import { Workout, WorkoutExercise } from "@/app/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PerformWorkoutExerciseModal } from "./PerformWorkoutExerciseModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  workout: Workout | null;
};

export function PerformWorkoutModal({ visible, onClose, workout }: Props) {
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(
    []
  );
  const [selectedExercise, setSelectedExercise] =
    useState<WorkoutExercise | null>(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  if (!workout) return null;

  const handleStartExercise = (exercise: WorkoutExercise) => {
    setSelectedExercise(exercise);
    setExerciseModalVisible(true);
  };

  const handleFinishExercise = () => {
    if (selectedExercise) {
      if (!completedExerciseIds.includes(selectedExercise.id)) {
        setCompletedExerciseIds([...completedExerciseIds, selectedExercise.id]);
      }
      setExerciseModalVisible(false);
      setSelectedExercise(null);
    }
  };

  const handleClose = () => {
    setCompletedExerciseIds([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>{workout.name}</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.finishButton}
                >
                  <Text style={styles.finishButtonText}>Finish</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

            <ScrollView style={styles.content}>
              {workout.exercises.map((exercise) => {
                const isCompleted = completedExerciseIds.includes(exercise.id);
                return (
                  <TouchableWithoutFeedback key={exercise.id}>
                    <View style={styles.exerciseRow}>
                      <View style={styles.checkColumn}>
                        <Ionicons
                          name="checkmark-circle"
                          size={32}
                          color={isCompleted ? Colors.sbNavyBlue : "#ccc"}
                        />
                      </View>
                      <View style={styles.infoColumn}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDetails}>
                          {exercise.num_sets} Sets • {exercise.num_reps} Reps •{" "}
                          {exercise.intensity} {exercise.intensity_unit} •{" "}
                          {exercise.rest_time}s Rest
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => handleStartExercise(exercise)}
                      >
                        <Text style={styles.startButtonText}>Start</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>

            {selectedExercise && (
              <PerformWorkoutExerciseModal
                visible={exerciseModalVisible}
                onClose={() => setExerciseModalVisible(false)}
                workoutExercise={selectedExercise}
                onFinish={handleFinishExercise}
              />
            )}
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    // Ensure header captures touches properly
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  finishButton: {
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  finishButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  checkColumn: {
    marginRight: 16,
  },
  infoColumn: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
  },
  startButton: {
    backgroundColor: Colors.sbTurquoise,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 12,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
