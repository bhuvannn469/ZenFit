import api from './api';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

export interface Workout {
  _id: string;
  user: string;
  title: string;
  exercises: Exercise[];
  date: string;
  scheduledTime?: string;
  reminderEnabled?: boolean;
  caloriesBurned?: number;
  durationInMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const workoutService = {
  // Get all workouts
  getWorkouts: async () => {
    try {
      const response = await api.get<Workout[]>('/workouts');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get a single workout
  getWorkout: async (id: string) => {
    try {
      const response = await api.get<Workout>(`/workouts/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Create a new workout
  createWorkout: async (workoutData: Omit<Workout, '_id' | 'user'>) => {
    try {
      const response = await api.post<Workout>('/workouts', workoutData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Update a workout
  updateWorkout: async (id: string, workoutData: Partial<Workout>) => {
    try {
      const response = await api.put<Workout>(`/workouts/${id}`, workoutData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Delete a workout
  deleteWorkout: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/workouts/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
