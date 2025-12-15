import eventsData from "./events.json";

export type EventInstance = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
  isRSVPed: boolean;
};

export type AppEvent = {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  isFavorited: boolean;
  instances: EventInstance[];
};

export type GymCategory = {
  id: string;
  name: string;
};

export const INITIAL_EVENTS_DATA: AppEvent[] = eventsData as AppEvent[];

export type SetDatum = {
  startDateTime: string;
  endDateTime: string;
  num_reps: number;
  intensity: number;
};

export type Exercise = {
  id: string;
  name: string;
  associatedMuscles: string[];
  description: string;
  set_data: SetDatum[];
};

export type WorkoutExercise = {
  id: string;
  name: string;
  num_sets: number;
  num_reps: number;
  intensity: number;
  intensity_unit: string;
  rest_time: number;
};

export type Workout = {
  id: string;
  name: string;
  notes: string;
  goal: string;
  days: boolean[]; // flag vector for Monday -> Sunday
  times: boolean[]; // flag vector for morning, noon, night
  exercises: WorkoutExercise[];
};

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: "1",
    name: "Barbell Bench Press",
    associatedMuscles: ["Chest", "Triceps", "Front Delts"],
    description:
      "Compound pushing movement. Lower the bar to the mid-chest and press up explosively.",
    set_data: [],
  },
  {
    id: "2",
    name: "Barbell Squat",
    associatedMuscles: ["Quads", "Glutes", "Hamstrings"],
    description:
      "The primary lower-body compound. Keep chest up and lower hips until thighs are at least parallel to the floor.",
    set_data: [],
  },
  {
    id: "3",
    name: "Deadlift",
    associatedMuscles: ["Back", "Hamstrings", "Glutes"],
    description:
      "Posterior chain power movement. Hinge at the hips to lift the weight from the floor with a straight back.",
    set_data: [],
  },
  {
    id: "4",
    name: "Pull Up",
    associatedMuscles: ["Back", "Biceps"],
    description:
      "Vertical pulling bodyweight exercise. Grip the bar and pull your chin above the bar to target the lats.",
    set_data: [],
  },
  {
    id: "5",
    name: "Dumbbell Bicep Curl",
    associatedMuscles: ["Biceps"],
    description:
      "Isolation movement. Keep elbows tucked at your sides and curl the weight up, squeezing at the top.",
    set_data: [],
  },
  {
    id: "6",
    name: "Overhead Press",
    associatedMuscles: ["Shoulders", "Triceps"],
    description:
      "Vertical push. Press the barbell from the front rack position to full extension overhead.",
    set_data: [],
  },
  {
    id: "7",
    name: "Bent Over Row",
    associatedMuscles: ["Back", "Biceps"],
    description:
      "Horizontal pull. Hinge forward with a flat back and pull the barbell towards your lower chest.",
    set_data: [],
  },
  {
    id: "8",
    name: "Incline Dumbbell Press",
    associatedMuscles: ["Upper Chest", "Triceps", "Shoulders"],
    description:
      "Chest variation. Press dumbbells from an inclined bench to emphasize the upper pectoral muscles.",
    set_data: [],
  },
  {
    id: "9",
    name: "Dumbbell Lateral Raise",
    associatedMuscles: ["Side Delts"],
    description:
      "Shoulder isolation. Raise weights to the side with a slight bend in the elbow to target width.",
    set_data: [],
  },
  {
    id: "10",
    name: "Tricep Rope Pushdown",
    associatedMuscles: ["Triceps"],
    description:
      "Cable isolation. Keep upper arms fixed and extend the elbows to push the rope down and apart.",
    set_data: [],
  },
  {
    id: "11",
    name: "Romanian Deadlift (RDL)",
    associatedMuscles: ["Hamstrings", "Glutes"],
    description:
      "Hip hinge variation. Lower the bar by pushing hips back with slightly bent knees until a stretch is felt.",
    set_data: [],
  },
  {
    id: "12",
    name: "Walking Lunge",
    associatedMuscles: ["Quads", "Glutes"],
    description:
      "Unilateral leg movement. Step forward and lower hips until both knees form a 90-degree angle.",
    set_data: [],
  },
  {
    id: "13",
    name: "Face Pull",
    associatedMuscles: ["Rear Delts", "Rotator Cuff"],
    description:
      "Corrective exercise. Pull the rope towards your forehead while flaring elbows out to hit the rear delts.",
    set_data: [],
  },
  {
    id: "14",
    name: "Leg Press",
    associatedMuscles: ["Quads", "Glutes"],
    description:
      "Machine compound. Push the platform away using your legs, ensuring you do not lock your knees at the top.",
    set_data: [],
  },
  {
    id: "15",
    name: "Plank",
    associatedMuscles: ["Core"],
    description:
      "Isometric core hold. Maintain a straight line from head to heels while bracing your abs.",
    set_data: [],
  },
];

export const INITIAL_WORKOUTS: Workout[] = [];
