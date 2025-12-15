import { Colors } from "@/app/constants/Colors";
import { Workout, WorkoutExercise } from "@/app/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EditWorkoutExerciseModal } from "./EditWorkoutExerciseModal";

type EditWorkoutModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (workout: Workout) => void;
  initialWorkout?: Workout | null;
};

const DAYS = ["M", "T", "W", "R", "F", "Sa", "Su"];

export function EditWorkoutModal({
  visible,
  onClose,
  onConfirm,
  initialWorkout,
}: EditWorkoutModalProps) {
  const [name, setName] = useState("");
  const [days, setDays] = useState<boolean[]>(new Array(7).fill(false));
  const [times, setTimes] = useState<boolean[]>([false, false, false]);
  const [goal, setGoal] = useState("strength");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (initialWorkout) {
      setName(initialWorkout.name);
      setDays(initialWorkout.days);
      setTimes(initialWorkout.times);
      setGoal(initialWorkout.goal);
      setExercises(initialWorkout.exercises || []);
    } else {
      resetForm();
    }
  }, [initialWorkout, visible]);

  const resetForm = () => {
    setName("");
    setDays(new Array(7).fill(false));
    setTimes([false, false, false]);
    setGoal("strength");
    setExercises([]);
  };

  const handleConfirm = () => {
    const newWorkout: Workout = {
      id: initialWorkout ? initialWorkout.id : Date.now().toString(),
      name,
      notes: initialWorkout?.notes || "",
      goal,
      days,
      times,
      exercises,
    };
    onConfirm(newWorkout);
    onClose();
  };

  const toggleDay = (index: number) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    setDays(newDays);
  };

  const toggleTime = (index: number) => {
    const newTimes = [...times];
    newTimes[index] = !newTimes[index];
    setTimes(newTimes);
  };

  const handleAddExercise = () => {
    setSelectedExerciseIndex(null);
    setExerciseModalVisible(true);
  };

  const handleEditExercise = (index: number) => {
    setSelectedExerciseIndex(index);
    setExerciseModalVisible(true);
  };

  const handleDeleteExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const handleConfirmExercise = (exercise: WorkoutExercise) => {
    if (selectedExerciseIndex !== null) {
      const newExercises = [...exercises];
      newExercises[selectedExerciseIndex] = exercise;
      setExercises(newExercises);
    } else {
      setExercises([...exercises, exercise]);
    }
  };

  const renderExerciseItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<WorkoutExercise>) => {
    const index = getIndex();
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          delayLongPress={200}
          disabled={isActive}
          style={[
            styles.exerciseRow,
            { backgroundColor: isActive ? "#e1f0ff" : "#f9f9f9" },
          ]}
        >
          <View style={styles.dragHandle}>
            <Ionicons name="grid" size={20} color="#ccc" />
          </View>
          <Text style={styles.exerciseNumber}>
            {index !== undefined ? index + 1 : "-"}.
          </Text>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDetails}>
              {item.num_sets} x {item.num_reps} @ {item.intensity}{" "}
              {item.intensity_unit}
            </Text>
          </View>
          <View style={styles.exerciseActions}>
            <TouchableOpacity
              onPress={() => index !== undefined && handleEditExercise(index)}
              style={styles.actionButton}
            >
              <Ionicons name="pencil" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => index !== undefined && handleDeleteExercise(index)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.modalTitle}>
        {initialWorkout ? "Edit Workout" : "Add Workout"}
      </Text>

      {/* Workout Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="my workout name"
        />
        {name.length > 0 && (
          <TouchableOpacity onPress={() => setName("")}>
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Days Row */}
      <View style={styles.compactRow}>
        <Text style={styles.compactLabel}>Days</Text>
        <View style={styles.compactDaysContainer}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.compactDayButton,
                days[index] && styles.dayButtonActive,
              ]}
              onPress={() => toggleDay(index)}
            >
              <Text
                style={[
                  styles.compactDayText,
                  days[index] && styles.dayTextActive,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Time Row */}
      <View style={styles.compactRow}>
        <Text style={styles.compactLabel}>Time</Text>
        <View style={styles.compactOptionRow}>
          <TouchableOpacity
            style={[
              styles.compactIconButton,
              times[0] && styles.iconButtonActive,
            ]}
            onPress={() => toggleTime(0)}
          >
            <Ionicons
              name="sunny"
              size={18}
              color={times[0] ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.compactIconButton,
              times[2] && styles.iconButtonActive,
            ]}
            onPress={() => toggleTime(2)}
          >
            <Ionicons
              name="moon"
              size={18}
              color={times[2] ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Goal Row */}
      <View style={styles.compactRow}>
        <Text style={styles.compactLabel}>Goal</Text>
        <View style={styles.compactOptionRow}>
          <TouchableOpacity
            style={[
              styles.compactGoalButton,
              goal === "strength" && styles.goalButtonActive,
            ]}
            onPress={() => setGoal("strength")}
          >
            <Text
              style={[
                styles.compactGoalText,
                goal === "strength" && styles.goalTextActive,
              ]}
            >
              strength
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.compactGoalButton,
              goal === "hypertrophy" && styles.goalButtonActive,
            ]}
            onPress={() => setGoal("hypertrophy")}
          >
            <Text
              style={[
                styles.compactGoalText,
                goal === "hypertrophy" && styles.goalTextActive,
              ]}
            >
              hypertrophy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.exercisesHeader}>
        <Text style={styles.label}>Exercises</Text>
        <TouchableOpacity onPress={handleAddExercise}>
          <Ionicons name="add-circle" size={24} color={Colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderHeader()}
            <DraggableFlatList
              data={exercises}
              onDragEnd={({ data }) => setExercises(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderExerciseItem}
              ListEmptyComponent={
                <View style={styles.placeholderBox}>
                  <Text style={styles.placeholderText}>
                    No exercises added yet.
                  </Text>
                </View>
              }
              contentContainerStyle={{ paddingBottom: 20 }}
              containerStyle={{ flex: 1 }}
            />
            {renderFooter()}
          </View>
        </View>
      </GestureHandlerRootView>

      <EditWorkoutExerciseModal
        visible={exerciseModalVisible}
        onClose={() => setExerciseModalVisible(false)}
        onConfirm={handleConfirmExercise}
        initialExercise={
          selectedExerciseIndex !== null
            ? exercises[selectedExerciseIndex]
            : null
        }
        goal={goal}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "80%",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  compactLabel: {
    fontSize: 20,
    fontWeight: "600",
  },
  compactDaysContainer: {
    flexDirection: "row",
    gap: 4,
  },
  compactDayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compactDayText: {
    fontSize: 14,
    color: Colors.text,
  },
  dayTextActive: {
    color: Colors.white,
  },
  compactOptionRow: {
    flexDirection: "row",
    gap: 8,
  },
  compactIconButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 8,
    width: 40,
    alignItems: "center",
  },
  iconButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compactGoalButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    borderRadius: 8,
  },
  goalButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compactGoalText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
  },
  goalTextActive: {
    color: Colors.white,
  },
  placeholderBox: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  exercisesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 0,
  },
  exercisesList: {
    gap: 10,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
  },
  dragHandle: {
    marginRight: 10,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    width: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  exerciseDetails: {
    fontSize: 12,
    color: "#666",
  },
  exerciseActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
});
