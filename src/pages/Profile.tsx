import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout, PostCard } from '../components';
import { postService, Post } from '../services/postService';
import { followService } from '../services/followService';
import { likeService } from '../services/likeService';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });

  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Carregar posts primeiro
      let userPosts: Post[] = [];
      try {
        const postsResponse = await postService.getUserPosts(user.id);
        userPosts = postsResponse.items || [];
      } catch {
        // Fallback: buscar todos e filtrar
        const response = await postService.getAllPosts();
        userPosts = (response.items || []).filter(post => post.author?.id === user.id);
      }
      
      setPosts(userPosts);
      
      // Carregar posts curtidos
      try {
        const likesResponse = await likeService.getUserLikes(user.id);
        const likedPostIds = likesResponse.data.posts.map(like => like.targetId);
        
        // Buscar os posts completos
        if (likedPostIds.length > 0) {
          const allPosts = await postService.getAllPosts();
          const likedPostsData = allPosts.items.filter(post => likedPostIds.includes(post.id));
          setLikedPosts(likedPostsData);
        }
      } catch (error) {
        console.log('Erro ao carregar posts curtidos:', error);
      }
      
      // Tentar carregar estatísticas de follow
      let followers = 0;
      let following = 0;
      try {
        const followStats = await followService.getFollowStats(user.id);
        // A resposta pode vir como followStats diretamente ou followStats.data
        const statsData = followStats?.data || followStats;
        followers = statsData?.followersCount || 0;
        following = statsData?.followingCount || 0;
      } catch {
        // Ignorar erro - usar valores padrão
        console.log('Follow stats não disponível');
      }
      
      setStats({
        posts: userPosts.length,
        followers,
        following
      });
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      setStats(prev => ({ ...prev, posts: prev.posts - 1 }));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        {/* Header do Perfil */}
        <div className="profile-header-section">
          <div className="profile-cover"></div>
          
          <div className="profile-info-container">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <button className="edit-avatar-btn" title="Alterar foto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
            </div>
            
            <div className="profile-details">
              <h1 className="profile-name">{user?.name || 'Usuário'}</h1>
              <p className="profile-username">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'usuario'}</p>
              <p className="profile-bio">
                Membro do LeoLink desde {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                  : 'recentemente'}
              </p>
            </div>

            <div className="profile-actions">
              <button className="btn-edit-profile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Editar Perfil
              </button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.posts}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.followers}</span>
              <span className="stat-label">Seguidores</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.following}</span>
              <span className="stat-label">Seguindo</span>
            </div>
          </div>
        </div>

        {/* Tabs de conteúdo */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
            Posts
          </button>
          <button 
            className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Curtidas
          </button>
        </div>

        {/* Conteúdo dos posts */}
        <div className="profile-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : activeTab === 'posts' ? (
            posts.length > 0 ? (
              <div className="posts-grid">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePost}
                    onUpdate={loadUserData}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                </svg>
                <h3>Nenhum post ainda</h3>
                <p>Quando você criar posts, eles aparecerão aqui.</p>
                <button onClick={() => navigate('/feed')} className="btn-create-first">
                  Criar primeiro post
                </button>
              </div>
            )
          ) : (
            likedPosts.length > 0 ? (
              <div className="posts-grid">
                {likedPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={loadUserData}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <h3>Nenhuma curtida ainda</h3>
                <p>Posts que você curtir aparecerão aqui.</p>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
