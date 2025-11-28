import api from './api';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
}

export const commentService = {
  async getPostComments(postId: string, page: number = 1, limit: number = 10): Promise<{ data: Comment[] }> {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    // ResponseInterceptor envelopa: { data: Comment[], message, statusCode, timestamp }
    return { data: response.data.data || [] };
  },

  async createComment(postId: string, data: CreateCommentData): Promise<{ data: Comment }> {
    const response = await api.post(`/posts/${postId}/comments`, data);
    // ResponseInterceptor envelopa: { data: Comment, message, statusCode, timestamp }
    return { data: response.data.data };
  },

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  },

  async updateComment(id: string, data: CreateCommentData): Promise<{ data: Comment }> {
    const response = await api.patch(`/comments/${id}`, data);
    // ResponseInterceptor envelopa: { data: Comment, message, statusCode, timestamp }
    return { data: response.data.data };
  },
};
