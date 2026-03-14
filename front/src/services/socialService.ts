import api from './api';

export interface Friend {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FriendRequest {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LeaderboardEntry {
  _id: string;
  name: string;
  email: string;
  totalSteps: number;
  totalWorkouts: number;
  rank: number;
}

export interface CommunityPost {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }>;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'steps' | 'workouts' | 'duration' | 'weight';
  target: number;
  startDate: string;
  endDate: string;
  participants: Array<{
    user: string;
    progress: number;
  }>;
  isActive: boolean;
}

class SocialService {
  // Friend Management
  async getFriends(): Promise<{ friends: Friend[], friendRequests: FriendRequest[] }> {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch friends');
    }
  }

  async sendFriendRequest(friendId: string): Promise<void> {
    try {
      await api.post('/friends/request', { friendId });
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to send friend request');
    }
  }

  async acceptFriendRequest(requesterId: string): Promise<void> {
    try {
      await api.post('/friends/accept', { requesterId });
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to accept friend request');
    }
  }

  async rejectFriendRequest(requesterId: string): Promise<void> {
    try {
      await api.post('/friends/reject', { requesterId });
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to reject friend request');
    }
  }

  async searchUsers(query: string): Promise<Friend[]> {
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  }

  // Leaderboard
  async getLeaderboard(type: 'steps' | 'workouts' | 'weekly' = 'weekly'): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get(`/leaderboard?type=${type}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }

  // Community Posts (You'll need to create these backend routes)
  async getCommunityPosts(limit: number = 10): Promise<CommunityPost[]> {
    try {
      const response = await api.get(`/community/posts?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      // If backend routes not implemented yet, return mock data
      console.warn('Community posts API not available, using mock data');
      return [
        {
          _id: '1',
          user: { _id: '1', name: 'Alice' },
          content: 'Just finished a 10k run! 🏃‍♀️',
          createdAt: new Date().toISOString(),
          likes: [],
          comments: []
        },
        {
          _id: '2',
          user: { _id: '2', name: 'Bob' },
          content: 'Hit a new PR on squats today! 🏋️‍♂️',
          createdAt: new Date().toISOString(),
          likes: [],
          comments: []
        }
      ];
    }
  }

  async createPost(content: string): Promise<CommunityPost> {
    try {
      const response = await api.post('/community/posts', { content });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create post');
    }
  }

  // Challenges (You'll need to create these backend routes)
  async getChallenges(): Promise<Challenge[]> {
    try {
      const response = await api.get('/challenges');
      return response.data;
    } catch (error: any) {
      // If backend routes not implemented yet, return mock data
      console.warn('Challenges API not available, using mock data');
      return [
        {
          _id: '1',
          title: 'Most Steps This Week',
          description: 'Race against your friends to get the most steps!',
          type: 'steps',
          target: 70000,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participants: [],
          isActive: true
        }
      ];
    }
  }

  async joinChallenge(challengeId: string): Promise<void> {
    try {
      await api.post(`/challenges/${challengeId}/join`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to join challenge');
    }
  }
}

const socialService = new SocialService();
export default socialService;
