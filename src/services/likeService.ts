import api from './api';

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
};
