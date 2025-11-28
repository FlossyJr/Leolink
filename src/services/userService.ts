import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  statusCode: number;
  message: string;
  items: UserProfile[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userService = {
  async getUser(userId: string): Promise<{ data: UserProfile }> {
    const response = await api.get<{ data: { data: UserProfile } }>(`/users/${userId}`);
    // ResponseInterceptor envelopa em { data: { data: UserProfile } }
    return response.data.data ? { data: response.data.data.data } : response.data as any;
  },

  async searchUsers(search: string, page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await api.get<{ data: UsersResponse }>(`/users?search=${search}&page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },

  async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await api.get<{ data: UsersResponse }>(`/users?page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },

  async updateUser(userId: string, data: Partial<UserProfile>): Promise<{ data: UserProfile }> {
    const response = await api.patch<{ data: { data: UserProfile } }>(`/users/${userId}`, data);
    return response.data.data ? { data: response.data.data.data } : response.data as any;
  },
};
