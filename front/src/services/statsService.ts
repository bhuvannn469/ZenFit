import api from './api';

export interface Stats {
  userId: string;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  totalDuration: number;
  workoutsByType: Record<string, number>;
  dailyStats: Array<{
    date: string;
    workouts: number;
    calories: number;
    duration: number;
  }>;
  // Add other stats fields as needed
}

export const statsService = {
  // Get user stats
  getUserStats: async () => {
    try {
      const response = await api.get<Stats>('/stats');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get stats for a specific time period
  getStatsByPeriod: async (period: 'day' | 'week' | 'month' | 'year') => {
    try {
      const response = await api.get<Stats>(`/stats/period/${period}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get stats for a custom date range
  getStatsByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get<Stats>(`/stats/range?start=${startDate}&end=${endDate}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
