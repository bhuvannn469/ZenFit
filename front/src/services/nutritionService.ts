import api from './api';

// Interfaces
export interface Food {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity?: number;
}

export interface Meal {
  id?: string;
  user?: string;
  name: string;
  time: string;
  date: string;
  foods: (Food & { quantity: number })[];
}

export interface NutritionDay {
  id?: string;
  user?: string;
  date: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
  waterIntake: number;
}

export const nutritionService = {
  // Get nutrition day
  getNutritionDay: async (date: string) => {
    try {
      const response = await api.get<NutritionDay>(`/nutrition/day/${date}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get all nutrition days for current user
  getAllNutritionDays: async () => {
    try {
      const response = await api.get<NutritionDay[]>('/nutrition/days');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Create or update nutrition day
  saveNutritionDay: async (nutritionDay: Omit<NutritionDay, 'id' | 'user'>) => {
    try {
      const response = await api.post<NutritionDay>('/nutrition/day', nutritionDay);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Update nutrition day
  updateNutritionDay: async (id: string, updateData: Partial<NutritionDay>) => {
    try {
      const response = await api.put<NutritionDay>(`/nutrition/day/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Update water intake
  updateWaterIntake: async (date: string, waterIntake: number) => {
    try {
      const response = await api.put<NutritionDay>(`/nutrition/day/${date}/water`, { waterIntake });
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Add meal to day
  addMeal: async (date: string, meal: Omit<Meal, 'id' | 'user'>) => {
    try {
      const response = await api.post<Meal>(`/nutrition/day/${date}/meal`, meal);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Update meal
  updateMeal: async (id: string, updateData: Partial<Meal>) => {
    try {
      const response = await api.put<Meal>(`/nutrition/meal/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Delete meal
  deleteMeal: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/nutrition/meal/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Search food database
  searchFoods: async (query: string) => {
    try {
      const response = await api.get<Food[]>(`/nutrition/foods/search?query=${query}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get nutrition summary for date range
  getNutritionSummary: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get<any>(`/nutrition/summary?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
