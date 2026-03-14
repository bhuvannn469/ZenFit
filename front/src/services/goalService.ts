import api from './api';

export interface Goal {
  _id: string;
  user: string;
  type: 'calories' | 'duration' | 'workouts';
  target: number;
  startDate: string;
  endDate: string;
  achieved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const goalService = {
  // Get all goals
  getGoals: async () => {
    try {
      const response = await api.get<Goal[]>('/goals');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get a single goal
  getGoal: async (id: string) => {
    try {
      const response = await api.get<Goal>(`/goals/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Create a new goal
  createGoal: async (goalData: Omit<Goal, '_id' | 'user' | 'progress' | 'completed'>) => {
    try {
      const response = await api.post<Goal>('/goals', goalData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Update a goal
  updateGoal: async (id: string, goalData: Partial<Goal>) => {
    try {
      const response = await api.put<Goal>(`/goals/${id}`, goalData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Delete a goal
  deleteGoal: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/goals/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },
  
  // Update goal progress
  updateProgress: async (id: string, progress: number) => {
    try {
      const response = await api.put<Goal>(`/goals/${id}/progress`, { progress });
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
