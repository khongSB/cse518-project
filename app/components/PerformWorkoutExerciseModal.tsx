import { Colors } from "@/app/constants/Colors";
import { useData } from "@/app/context/DataContext";
import { SetDatum, WorkoutExercise } from "@/app/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  workoutExercise: WorkoutExercise;
  onFinish: () => void;
};

const SetHeader = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.setInfoContainer}>
    <Text style={styles.setLabel}>SET</Text>
    <Text style={styles.setCount}>
      {current} / {total}
    </Text>
  </View>
);

type SetInputRowProps = {
  currentSet: number;
  totalSets: number;
  reps: string;
  intensity: string;
  intensityUnit: string;
  targetReps: number;
  targetIntensity: number;
  onPrev: () => void;
  onNext: () => void;
  onDelete: () => void;
  onChangeReps: (text: string) => void;
  onChangeIntensity: (text: string) => void;
};

const SetInputRow = ({
  currentSet,
  totalSets,
  reps,
  intensity,
  intensityUnit,
  targetReps,
  targetIntensity,
  onPrev,
  onNext,
  onDelete,
  onChangeReps,
  onChangeIntensity,
}: SetInputRowProps) => {
  const isLastSet = currentSet === totalSets;

  return (
    <View style={styles.navigationRow}>
      <View style={styles.navButtonContainer}>
        <TouchableOpacity
          onPress={onPrev}
          disabled={currentSet === 1}
          style={[styles.navButton, currentSet === 1 && styles.disabledNav]}
        >
          <Ionicons name="chevron-back" size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputsWrapper}>
        {totalSets > 1 && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
        <View style={styles.intensityColumn}>
          <View style={styles.intensityInputContainer}>
            <TextInput
              style={styles.intensityInput}
              keyboardType="numeric"
              value={intensity}
              onChangeText={onChangeIntensity}
              placeholder={targetIntensity.toString()}
              placeholderTextColor="#C7C7CC"
            />
            <Text style={styles.unitText}>{intensityUnit}</Text>
          </View>
          <Text style={styles.inputLabel}>Intensity</Text>
        </View>

        <View style={styles.repsColumn}>
          <View style={styles.repsInputContainer}>
            <TextInput
              style={styles.repsInput}
              keyboardType="numeric"
              value={reps}
              onChangeText={onChangeReps}
              placeholder={targetReps.toString()}
              placeholderTextColor="#C7C7CC"
            />
          </View>
          <Text style={styles.repsLabel}>REPS</Text>
        </View>
      </View>

      <View style={styles.navButtonContainer}>
        <TouchableOpacity onPress={onNext} style={styles.navButton}>
          <Ionicons
            name={isLastSet ? "add-circle" : "chevron-forward"}
            size={32}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type TimerSectionProps = {
  stopwatchTime: number;
  isStopwatchRunning: boolean;
  toggleStopwatch: () => void;
  restTime: number;
};

const TimerSection = ({
  stopwatchTime,
  isStopwatchRunning,
  toggleStopwatch,
  restTime,
}: TimerSectionProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerRow}>
        <View style={styles.timerTextContainer}>
          <Text style={styles.workoutTimerText}>
            {formatTime(stopwatchTime)}
          </Text>
          <Text style={styles.timerLabel}>WORKOUT</Text>
        </View>
        <TouchableOpacity onPress={toggleStopwatch} style={styles.playButton}>
          <Ionicons
            name={isStopwatchRunning ? "pause-circle" : "play-circle"}
            size={80}
            color={Colors.sbTurquoise}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.timerRow, { marginTop: 10, marginBottom: 0 }]}>
        <View style={styles.timerTextContainer}>
          <Text style={styles.restTimerText}>{formatTime(restTime)}</Text>
          <Text style={[styles.timerLabel, { color: Colors.primary }]}>
            REST
          </Text>
        </View>
      </View>
    </View>
  );
};

export function PerformWorkoutExerciseModal({
  visible,
  onClose,
  workoutExercise,
  onFinish,
}: Props) {
  const { addSetData } = useData();
  const [currentSet, setCurrentSet] = useState(1);
  const [setsData, setSetsData] = useState<
    { reps: string; intensity: string }[]
  >([]);

  // Timer state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [restTime, setRestTime] = useState(workoutExercise.rest_time || 60);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);

  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);

  // Refs for intervals
  const stopwatchInterval = useRef<any>(null);
  const restTimerInterval = useRef<any>(null);

  // Initialize sets data
  useEffect(() => {
    if (visible) {
      setCurrentSet(1);
      // Fix: Use Array.from to create independent objects
      setSetsData(
        Array.from({ length: workoutExercise.num_sets }, () => ({
          reps: "",
          intensity: workoutExercise.intensity.toString(),
        }))
      );
      setStopwatchTime(0);
      setIsStopwatchRunning(false);
      setRestTime(workoutExercise.rest_time || 60);
      setIsRestTimerRunning(false);
      setStartDateTime(null);
      setEndDateTime(null);
    }
  }, [visible, workoutExercise]);

  // Stopwatch logic
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (stopwatchInterval.current) {
        clearInterval(stopwatchInterval.current);
      }
    }
    return () => {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    };
  }, [isStopwatchRunning]);

  // Rest timer logic
  useEffect(() => {
    if (isRestTimerRunning) {
      restTimerInterval.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            Alert.alert("Rest Time Over", "Get back to work!");
            setIsRestTimerRunning(false);
            return workoutExercise.rest_time || 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerInterval.current) {
        clearInterval(restTimerInterval.current);
      }
    }
    return () => {
      if (restTimerInterval.current) clearInterval(restTimerInterval.current);
    };
  }, [isRestTimerRunning, workoutExercise.rest_time]);

  const toggleStopwatch = () => {
    if (!isStopwatchRunning) {
      if (!startDateTime) {
        setStartDateTime(new Date().toISOString());
      }
      setIsStopwatchRunning(true);
      setIsRestTimerRunning(false);
    } else {
      setIsStopwatchRunning(false);
      setEndDateTime(new Date().toISOString());
      setRestTime(workoutExercise.rest_time || 60);
      setIsRestTimerRunning(true);
    }
  };

  const handleNextSet = () => {
    if (currentSet < setsData.length) {
      setCurrentSet(currentSet + 1);
    } else {
      // Add new set
      const newSet = {
        reps: "",
        intensity: workoutExercise.intensity.toString(),
      };
      setSetsData([...setsData, newSet]);
      setCurrentSet(currentSet + 1);
    }
  };

  const handlePrevSet = () => {
    if (currentSet > 1) {
      setCurrentSet(currentSet - 1);
    }
  };

  const handleDeleteSet = () => {
    if (setsData.length <= 1) return;
    const newSets = [...setsData];
    newSets.splice(currentSet - 1, 1);
    setSetsData(newSets);
    if (currentSet > newSets.length) {
      setCurrentSet(newSets.length);
    }
  };

  const updateSetData = (field: "reps" | "intensity", value: string) => {
    const newSetsData = [...setsData];
    newSetsData[currentSet - 1] = {
      ...newSetsData[currentSet - 1],
      [field]: value,
    };
    setSetsData(newSetsData);
  };

  const handleFinish = () => {
    const finalEndDateTime = endDateTime || new Date().toISOString();
    const finalStartDateTime = startDateTime || new Date().toISOString();

    setsData.forEach((set) => {
      // Reps must be inputted. If empty, skip this set.
      if (set.reps === "") return;

      const datum: SetDatum = {
        startDateTime: finalStartDateTime,
        endDateTime: finalEndDateTime,
        num_reps: parseInt(set.reps),
        // If intensity is empty, use the default (target) intensity
        intensity:
          set.intensity === ""
            ? workoutExercise.intensity
            : parseInt(set.intensity),
      };
      addSetData(workoutExercise.name, datum);
    });

    onFinish();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFinish} style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <SetHeader current={currentSet} total={setsData.length} />

          <SetInputRow
            currentSet={currentSet}
            totalSets={setsData.length}
            reps={setsData[currentSet - 1]?.reps || ""}
            intensity={setsData[currentSet - 1]?.intensity || ""}
            intensityUnit={workoutExercise.intensity_unit}
            targetReps={workoutExercise.num_reps}
            targetIntensity={workoutExercise.intensity}
            onPrev={handlePrevSet}
            onNext={handleNextSet}
            onDelete={handleDeleteSet}
            onChangeReps={(text) => updateSetData("reps", text)}
            onChangeIntensity={(text) => updateSetData("intensity", text)}
          />

          <TimerSection
            stopwatchTime={stopwatchTime}
            isStopwatchRunning={isStopwatchRunning}
            toggleStopwatch={toggleStopwatch}
            restTime={restTime}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
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
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  // Set Header Styles
  setInfoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 0,
  },
  setLabel: {
    fontSize: 64,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 4,
  },
  setCount: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#333",
    marginTop: 0,
  },
  // Navigation & Input Styles
  navigationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButtonContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    padding: 4,
  },
  disabledNav: {
    opacity: 0.3,
  },
  inputsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  intensityColumn: {
    alignItems: "center",
    flex: 1,
  },
  repsColumn: {
    alignItems: "center",
    flex: 1,
  },
  intensityInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5ea",
    minWidth: 100,
    paddingBottom: 5,
  },
  intensityInput: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 60,
    maxWidth: 60,
    padding: 0,
  },
  unitText: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 4,
    color: "#000",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8e8e93",
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  repsInputContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  repsInput: {
    fontSize: 64,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5ea",
    minWidth: 120,
    maxWidth: 120,
    textAlign: "center",
    paddingBottom: 5,
  },
  repsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    color: "#8e8e93",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Timer Styles
  timerContainer: {
    alignItems: "center",
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    paddingVertical: 20,
    width: "100%",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  timerTextContainer: {
    alignItems: "center",
  },
  workoutTimerText: {
    fontSize: 80,
    fontVariant: ["tabular-nums"],
    fontWeight: "normal",
    color: "#000",
  },
  restTimerText: {
    fontSize: 48,
    fontVariant: ["tabular-nums"],
    fontWeight: "normal",
    color: Colors.primary,
  },
  timerLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  playButton: {
    marginLeft: 16,
  },
});
