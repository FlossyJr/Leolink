import api from './api';

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  createdAt: string;
}

export interface UserLikesResponse {
  statusCode: number;
  message: string;
  data: {
    posts: Like[];
    comments: Like[];
    total: number;
  };
}

export const likeService = {
  async likePost(postId: string): Promise<void> {
    await api.post(`/likes/posts/${postId}`);
  },

  async unlikePost(postId: string): Promise<void> {
    await api.delete(`/likes/posts/${postId}`);
  },

  async likeComment(commentId: string): Promise<void> {
    await api.post(`/likes/comments/${commentId}`);
  },

  async unlikeComment(commentId: string): Promise<void> {
    await api.delete(`/likes/comments/${commentId}`);
  },

  async getPostLikes(postId: string): Promise<{ data: { count: number } }> {
    const response = await api.get<{ data: { data: { count: number } } }>(`/likes/posts/${postId}`);
    return response.data.data ? { data: response.data.data.data } : response.data as any;
  },

  async getUserLikes(userId: string): Promise<UserLikesResponse> {
    const response = await api.get<{ data: UserLikesResponse }>(`/likes/users/${userId}`);
    return response.data.data || response.data as any;
  },
};
