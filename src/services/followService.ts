import api from './api';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowUser {
  id: string;
  name: string;
  email: string;
  followedAt: string;
}

export interface FollowListResponse {
  statusCode: number;
  message: string;
  items: FollowUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FollowStatsResponse {
  statusCode: number;
  message: string;
  data: FollowStats;
}

export const followService = {
  async followUser(userId: string): Promise<void> {
    await api.post(`/users/${userId}/follow`);
  },

  async unfollowUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}/follow`);
  },

  async getFollowers(userId: string, page: number = 1, limit: number = 10): Promise<FollowListResponse> {
    const response = await api.get<{ data: FollowListResponse }>(`/users/${userId}/followers?page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },

  async getFollowing(userId: string, page: number = 1, limit: number = 10): Promise<FollowListResponse> {
    const response = await api.get<{ data: FollowListResponse }>(`/users/${userId}/following?page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },

  async getFollowStats(userId: string): Promise<FollowStatsResponse> {
    const response = await api.get<{ data: FollowStatsResponse }>(`/users/${userId}/follow-stats`);
    return response.data.data || response.data as any;
  },
};
