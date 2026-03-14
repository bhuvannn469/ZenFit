import api from './api';

export interface Friend {
  _id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface FriendRequest {
  _id: string;
  from: Friend;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const friendService = {
  // Get all friends
  getFriends: async () => {
    try {
      const response = await api.get<Friend[]>('/friends');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Send friend request
  sendFriendRequest: async (userId: string) => {
    try {
      const response = await api.post<{ success: boolean }>('/friends/request', { userId });
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Get received friend requests
  getFriendRequests: async () => {
    try {
      const response = await api.get<FriendRequest[]>('/friends/requests');
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId: string) => {
    try {
      const response = await api.post<{ success: boolean }>(`/friends/request/${requestId}/accept`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId: string) => {
    try {
      const response = await api.post<{ success: boolean }>(`/friends/request/${requestId}/reject`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  },

  // Remove friend
  removeFriend: async (friendId: string) => {
    try {
      const response = await api.delete<{ success: boolean }>(`/friends/${friendId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data ?? error;
    }
  }
};
