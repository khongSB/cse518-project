import { Colors } from "@/app/constants/Colors";
import { INITIAL_EXERCISES, WorkoutExercise } from "@/app/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EditWorkoutExerciseModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (exercise: WorkoutExercise) => void;
  initialExercise?: WorkoutExercise | null;
  goal?: string;
};

export function EditWorkoutExerciseModal({
  visible,
  onClose,
  onConfirm,
  initialExercise,
  goal = "strength",
}: EditWorkoutExerciseModalProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [intensity, setIntensity] = useState("10");
  const [intensityUnit, setIntensityUnit] = useState("lbs");
  const [restTime, setRestTime] = useState("180");

  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const UNITS = ["lbs", "kg", "sec", "min", "RPE", "%"];

  useEffect(() => {
    if (initialExercise) {
      setExerciseName(initialExercise.name);
      setSets(initialExercise.num_sets.toString());
      setReps(initialExercise.num_reps.toString());
      setIntensity(initialExercise.intensity.toString());
      setIntensityUnit(initialExercise.intensity_unit || "lbs");
      setRestTime(initialExercise.rest_time.toString());
    } else {
      resetForm();
    }
  }, [initialExercise, visible, goal]);

  const resetForm = () => {
    setExerciseName("");
    if (goal === "hypertrophy") {
      setSets("5");
      setReps("10");
    } else {
      setSets("3");
      setReps("3");
    }
    setIntensity("10");
    setIntensityUnit("lbs");
    setRestTime("180");
  };

  const handleConfirm = () => {
    if (!exerciseName) return;
    const newExercise: WorkoutExercise = {
      id: initialExercise?.id || Date.now().toString(),
      name: exerciseName,
      num_sets: parseInt(sets) || 0,
      num_reps: parseInt(reps) || 0,
      intensity: parseInt(intensity) || 0,
      intensity_unit: intensityUnit,
      rest_time: parseInt(restTime) || 0,
    };
    onConfirm(newExercise);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialExercise ? "Edit Exercise" : "Add Exercise"}
          </Text>

          <ScrollView>
            <Text style={styles.label}>Exercise</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowExercisePicker(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {exerciseName || "Select Exercise"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Sets</Text>
                <TextInput
                  style={styles.input}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Intensity</Text>
                <View style={styles.intensityContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={intensity}
                    onChangeText={setIntensity}
                    keyboardType="numeric"
                  />
                  <View style={styles.unitContainer}>
                    <TextInput
                      style={styles.unitInput}
                      value={intensityUnit}
                      onChangeText={setIntensityUnit}
                      placeholder="Unit"
                    />
                    <TouchableOpacity
                      style={styles.unitDropdownIcon}
                      onPress={() => setShowUnitPicker(true)}
                    >
                      <Ionicons name="chevron-down" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Rest (sec)</Text>
                <TextInput
                  style={styles.input}
                  value={restTime}
                  onChangeText={setRestTime}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        visible={showExercisePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select Exercise</Text>
            <ScrollView>
              {INITIAL_EXERCISES.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setExerciseName(ex.name);
                    setShowExercisePicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{ex.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowExercisePicker(false)}
            >
              <Text style={styles.pickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Unit Picker Modal */}
      <Modal visible={showUnitPicker} transparent={true} animationType="fade">
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>Select Unit</Text>
            <ScrollView>
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={styles.pickerItem}
                  onPress={() => {
                    setIntensityUnit(unit);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCloseButton}
              onPress={() => setShowUnitPicker(false)}
            >
              <Text style={styles.pickerCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
  },
  intensityContainer: {
    flexDirection: "row",
    gap: 5,
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 5,
    width: 80,
  },
  unitInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    textAlign: "center",
  },
  unitDropdownIcon: {
    padding: 5,
  },
  unitButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  unitText: {
    fontWeight: "600",
    color: "#333",
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
    color: "#000",
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
    color: "#fff",
    fontWeight: "600",
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 40,
  },
  pickerContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "60%",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  pickerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerItemText: {
    fontSize: 16,
    textAlign: "center",
  },
  pickerCloseButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  pickerCloseText: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
