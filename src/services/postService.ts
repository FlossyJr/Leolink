import api from './api';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PostsResponse {
  statusCode: number;
  message: string;
  items: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePostData {
  content: string;
}

export const postService = {
  async getPosts(page: number = 1, limit: number = 10, search?: string): Promise<PostsResponse> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    const response = await api.get<{ data: PostsResponse }>(`/posts?${params}`);
    // O backend envelopa a resposta em { data: { items, meta } }
    return response.data.data || response.data as any;
  },

  async getAllPosts(): Promise<PostsResponse> {
    const response = await api.get<{ data: PostsResponse }>('/posts?limit=100');
    return response.data.data || response.data as any;
  },

  async getPost(id: string): Promise<{ data: Post }> {
    const response = await api.get<{ data: Post }>(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: CreatePostData): Promise<{ data: Post }> {
    const response = await api.post<{ data: Post }>('/posts', data);
    return response.data;
  },

  async updatePost(id: string, data: CreatePostData): Promise<{ data: Post }> {
    const response = await api.patch<{ data: Post }>(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  // Novos endpoints
  async getFeed(page: number = 1, limit: number = 10): Promise<PostsResponse> {
    const response = await api.get<{ data: PostsResponse }>(`/posts/feed/following?page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },

  async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<PostsResponse> {
    const response = await api.get<{ data: PostsResponse }>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data.data || response.data as any;
  },
};
