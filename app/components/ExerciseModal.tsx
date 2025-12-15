import { Colors } from "@/app/constants/Colors";
import { Exercise } from "@/app/data/mockData";
import React, { useMemo } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise | null;
};

const CHART_HEIGHT = 200;
const CHART_WIDTH = Dimensions.get("window").width * 0.9 - 48;

const calculateEffort = (sets: number, reps: number, weight: number) => {
  return sets * weight * (1 + reps / 30);
};

export function ExerciseModal({ visible, onClose, exercise }: Props) {
  if (!exercise) return null;

  const chartData = useMemo(() => {
    if (!exercise.set_data || exercise.set_data.length === 0) return [];

    const data = exercise.set_data.map((datum) => {
      const effort = calculateEffort(1, datum.num_reps, datum.intensity);
      return {
        effort,
        date: new Date(datum.endDateTime).getTime(),
        dateString: new Date(datum.endDateTime).toLocaleDateString(),
      };
    });

    data.sort((a, b) => a.date - b.date);

    return data;
  }, [exercise]);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>No data available</Text>
        </View>
      );
    }

    const maxEffort = Math.max(...chartData.map((d) => d.effort));
    const minEffort = Math.min(...chartData.map((d) => d.effort));
    const minDate = chartData[0].date;
    const maxDate = chartData[chartData.length - 1].date;

    const timeRange = maxDate - minDate;
    const effortRange = maxEffort - (minEffort > 0 ? 0 : minEffort);

    const safeTimeRange = timeRange === 0 ? 1 : timeRange;
    const safeEffortRange = effortRange === 0 ? maxEffort || 100 : effortRange;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {[0, 0.5, 1].map((ratio) => (
            <View
              key={ratio}
              style={[styles.gridLine, { bottom: ratio * CHART_HEIGHT }]}
            />
          ))}

          {chartData.map((point, index) => {
            const x =
              ((point.date - minDate) / safeTimeRange) * (CHART_WIDTH - 20) +
              10;
            const y =
              (point.effort / safeEffortRange) * (CHART_HEIGHT - 20) + 10;

            return (
              <View
                key={index}
                style={{ position: "absolute", left: x, bottom: y }}
              >
                <View style={styles.dataPoint} />
              </View>
            );
          })}
        </View>

        {/* X-Axis Labels */}
        <View style={styles.xAxis}>
          <Text style={styles.axisLabel}>
            {new Date(minDate).toLocaleDateString()}
          </Text>
          {timeRange > 0 && (
            <Text style={styles.axisLabel}>
              {new Date(maxDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.content}>
            <Text style={styles.nameHeading}>{exercise.name}</Text>

            <View style={styles.tagsRow}>
              {exercise.associatedMuscles.map((muscle) => (
                <View key={muscle} style={styles.tag}>
                  <Text style={styles.tagText}>{muscle}</Text>
                </View>
              ))}
            </View>

            <View style={styles.descriptionContainer}>
              <ScrollView nestedScrollEnabled style={styles.descriptionScroll}>
                <Text style={styles.descriptionText}>
                  {exercise.description}
                </Text>
              </ScrollView>
            </View>

            <Text style={styles.chartTitle}>Progress Over Time</Text>
            {renderChart()}
          </View>

          <TouchableOpacity style={styles.bottomCloseButton} onPress={onClose}>
            <Text style={styles.bottomCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  bottomCloseButton: {
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  bottomCloseButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  nameHeading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  descriptionContainer: {
    height: 140,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  descriptionScroll: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  chartArea: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#eee",
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: -4, // Center
    marginBottom: -4, // Center
  },
  emptyChart: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  emptyChartText: {
    color: "#999",
    fontSize: 16,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: CHART_WIDTH,
    marginTop: 8,
  },
  axisLabel: {
    fontSize: 12,
    color: "#999",
  },
});
