import api from './api';

// Interfaces
export interface SleepEntry {
  id?: string;
  user?: string;
  date: string;
  hoursSlept: number;
  quality: number;
  notes?: string;
}

export interface MoodEntry {
  id?: string;
  user?: string;
  date: string;
  moodRating: number;
  energyLevel: number;
  stressLevel: number;
  notes?: string;
}

export interface MeditationSession {
  id?: string;
  user?: string;
  date: string;
  duration: number;
  type: string;
  notes?: string;
}

export const wellnessService = {
  // Sleep Methods
  getSleepEntries: async () => {
    try {
      const response = await api.get<SleepEntry[]>('/wellness/sleep');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  getSleepEntry: async (date: string) => {
    try {
      const response = await api.get<SleepEntry>(`/wellness/sleep/${date}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  createSleepEntry: async (sleepData: Omit<SleepEntry, 'id' | 'user'>) => {
    try {
      const response = await api.post<SleepEntry>('/wellness/sleep', sleepData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  updateSleepEntry: async (id: string, sleepData: Partial<SleepEntry>) => {
    try {
      const response = await api.put<SleepEntry>(`/wellness/sleep/${id}`, sleepData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  deleteSleepEntry: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/wellness/sleep/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Mood Methods
  getMoodEntries: async () => {
    try {
      const response = await api.get<MoodEntry[]>('/wellness/mood');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  getMoodEntry: async (date: string) => {
    try {
      const response = await api.get<MoodEntry>(`/wellness/mood/${date}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  createMoodEntry: async (moodData: Omit<MoodEntry, 'id' | 'user'>) => {
    try {
      const response = await api.post<MoodEntry>('/wellness/mood', moodData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  updateMoodEntry: async (id: string, moodData: Partial<MoodEntry>) => {
    try {
      const response = await api.put<MoodEntry>(`/wellness/mood/${id}`, moodData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  deleteMoodEntry: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/wellness/mood/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Meditation Methods
  getMeditationSessions: async () => {
    try {
      const response = await api.get<MeditationSession[]>('/wellness/meditation');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  getMeditationSession: async (id: string) => {
    try {
      const response = await api.get<MeditationSession>(`/wellness/meditation/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  createMeditationSession: async (meditationData: Omit<MeditationSession, 'id' | 'user'>) => {
    try {
      const response = await api.post<MeditationSession>('/wellness/meditation', meditationData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  updateMeditationSession: async (id: string, meditationData: Partial<MeditationSession>) => {
    try {
      const response = await api.put<MeditationSession>(`/wellness/meditation/${id}`, meditationData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  deleteMeditationSession: async (id: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/wellness/meditation/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Summary Methods
  getWellnessSummary: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get<any>(`/wellness/summary?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Additional methods missing in service
  addSleepEntry: async (entry: SleepEntry) => {
    return wellnessService.createSleepEntry(entry);
  },

  addMoodEntry: async (entry: MoodEntry) => {
    // Convert Date to string if needed
    const entryWithStringDate = {
      ...entry,
      date: typeof entry.date === 'object' ? (entry.date as Date).toISOString().split('T')[0] : entry.date
    };
    return wellnessService.createMoodEntry(entryWithStringDate);
  },

  addMeditationSession: async (session: MeditationSession) => {
    // Convert Date to string if needed
    const sessionWithStringDate = {
      ...session,
      date: typeof session.date === 'object' ? (session.date as Date).toISOString().split('T')[0] : session.date
    };
    return wellnessService.createMeditationSession(sessionWithStringDate);
  },
};
