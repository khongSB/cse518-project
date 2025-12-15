import {
  AppEvent,
  EventInstance,
  Exercise,
  INITIAL_EVENTS_DATA,
  INITIAL_EXERCISES,
  INITIAL_WORKOUTS,
  SetDatum,
  Workout,
} from "@/app/data/mockData";
import React, { createContext, useContext, useState } from "react";

export type User = {
  username: string;
} | null;

export type FlattenedEventInstance = EventInstance & {
  event: AppEvent;
};

type DataContextType = {
  events: AppEvent[];
  user: User;
  workouts: Workout[];
  exercises: Exercise[];
  getFlattenedInstances: () => FlattenedEventInstance[];
  toggleFavorite: (eventId: string) => void;
  toggleRSVP: (eventId: string, instanceId: string) => void;
  signIn: (username: string) => void;
  signOut: () => void;
  addWorkout: (workout: Workout) => void;
  editWorkout: (workout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  addSetData: (exerciseName: string, data: SetDatum) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<AppEvent[]>(INITIAL_EVENTS_DATA);
  const [user, setUser] = useState<User>(null);
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);

  const signIn = (username: string) => {
    setUser({ username });
  };

  const signOut = () => {
    setUser(null);
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout]);
  };

  const editWorkout = (updatedWorkout: Workout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
    );
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  const addSetData = (exerciseName: string, data: SetDatum) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.name === exerciseName
          ? { ...ex, set_data: [...ex.set_data, data] }
          : ex
      )
    );
  };

  const toggleFavorite = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, isFavorited: !event.isFavorited }
          : event
      )
    );
  };

  const toggleRSVP = (eventId: string, instanceId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            instances: event.instances.map((instance) =>
              instance.id === instanceId
                ? { ...instance, isRSVPed: !instance.isRSVPed }
                : instance
            ),
          };
        }
        return event;
      })
    );
  };

  const getFlattenedInstances = (): FlattenedEventInstance[] => {
    return events.flatMap((event) =>
      event.instances.map((instance) => ({
        ...instance,
        event: event,
      }))
    );
  };

  return (
    <DataContext.Provider
      value={{
        events,
        user,
        workouts,
        exercises,
        getFlattenedInstances,
        toggleFavorite,
        toggleRSVP,
        signIn,
        signOut,
        addWorkout,
        editWorkout,
        deleteWorkout,
        addSetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
