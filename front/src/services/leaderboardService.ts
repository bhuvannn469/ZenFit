import api from './api';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  value: number;
  rank: number;
}

export const leaderboardService = {
  // Get workout leaderboard
  getWorkoutLeaderboard: async (type: 'calories' | 'duration' | 'count', period: 'day' | 'week' | 'month' | 'all') => {
    try {
      const response = await api.get<LeaderboardEntry[]>(`/leaderboard/workouts?type=${type}&period=${period}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get streak leaderboard
  getStreakLeaderboard: async () => {
    try {
      const response = await api.get<LeaderboardEntry[]>('/leaderboard/streaks');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get goal completion leaderboard
  getGoalLeaderboard: async (period: 'week' | 'month' | 'year' | 'all') => {
    try {
      const response = await api.get<LeaderboardEntry[]>(`/leaderboard/goals?period=${period}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
