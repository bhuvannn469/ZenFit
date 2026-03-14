import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    // Add other user fields as needed
  };
}

export const authService = {  // Register with email and password
  register: async (userData: RegisterData) => {
    try {
      console.log('Sending registration request with data:', userData);
      const response = await api.post<AuthResponse>('/auth/register', userData);
      console.log('Registration successful:', response.data);
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error);
      throw error.response?.data || error;
    }
  },

  // Login with email and password
  login: async (credentials: LoginData) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get<AuthResponse['user']>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async () => {
    // Just remove the token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  // Get current user
  getCurrentUser: () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },  // Update user profile
  updateProfile: async (profileData: UpdateProfileData) => {
    try {
      console.log('Sending profile update request with data:', profileData);
      
      // Make sure we're sending the correct data format to the server
      const sanitizedData: UpdateProfileData = {};
      if (profileData.name) sanitizedData.name = profileData.name;
      if (profileData.email) sanitizedData.email = profileData.email;
      if (profileData.age !== undefined) sanitizedData.age = typeof profileData.age === 'string' ? parseInt(profileData.age, 10) : profileData.age;
      if (profileData.weight !== undefined) sanitizedData.weight = typeof profileData.weight === 'string' ? parseFloat(profileData.weight) : profileData.weight;
      if (profileData.height !== undefined) sanitizedData.height = typeof profileData.height === 'string' ? parseFloat(profileData.height) : profileData.height;
      if (profileData.gender) sanitizedData.gender = profileData.gender;
      
      console.log('Sanitized profile data:', sanitizedData);
      
      const response = await api.put<AuthResponse['user']>('/auth/profile', sanitizedData);
      
      console.log('Profile update response:', response.data);
      
      // Update the stored user data
      const userString = localStorage.getItem('user');
      if (userString) {
        const currentUser = JSON.parse(userString);
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error.response?.data ?? error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
