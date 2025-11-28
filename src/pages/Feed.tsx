import React, { useState, useEffect } from 'react';
import { Layout, PostCard, CreatePost } from '../components';
import { postService, Post } from '../services/postService';
import './FeedNew.css';

function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      console.log('[Feed] Carregando posts, página:', pageNum);
      const response = await postService.getPosts(pageNum, 10);
      console.log('[Feed] Resposta da API:', response);
      console.log('[Feed] Items recebidos:', response.items?.length || 0);
      console.log('[Feed] Meta:', response.meta);
      
      if (pageNum === 1) {
        setPosts(response.items || []);
      } else {
        setPosts(prev => [...prev, ...(response.items || [])]);
      }
      
      setHasMore(response.meta?.page < response.meta?.totalPages);
      setPage(pageNum);
      console.log('[Feed] Posts no state:', response.items?.length || 0);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    try {
      const response = await postService.createPost({ content });
      console.log('Post criado:', response);
      // Recarregar posts após criar
      await loadPosts(1);
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      alert(error.response?.data?.message || 'Erro ao criar post');
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao deletar post');
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  };

  return (
    <Layout>
      <div className="feed-page">
        <div className="feed-container">
          <header className="feed-header">
            <h1>Feed</h1>
            <p className="feed-subtitle">Veja o que está acontecendo</p>
          </header>

          <CreatePost 
            onPostCreated={() => loadPosts(1)} 
            onSubmit={handleCreatePost}
          />

          <div className="posts-container">
            {loading && posts.length === 0 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <h3>Nenhum post ainda</h3>
                <p>Seja o primeiro a compartilhar algo!</p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    onDelete={handleDeletePost}
                    onUpdate={() => loadPosts(1)}
                  />
                ))}
                
                {hasMore && (
                  <button 
                    className="load-more-btn btn-secondary"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Carregar mais'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <aside className="feed-sidebar">
          <div className="sidebar-card">
            <h3>🔥 Tendências</h3>
            <ul className="trending-list">
              <li><span className="trend-tag">#Programação</span><span className="trend-count">1.2k posts</span></li>
              <li><span className="trend-tag">#Uniasselvi</span><span className="trend-count">890 posts</span></li>
              <li><span className="trend-tag">#TCC</span><span className="trend-count">654 posts</span></li>
              <li><span className="trend-tag">#Estágio</span><span className="trend-count">432 posts</span></li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>👥 Sugestões para seguir</h3>
            <div className="suggestions-list">
              <div className="suggestion-item">
                <div className="avatar">M</div>
                <div className="suggestion-info">
                  <span className="suggestion-name">Maria Silva</span>
                  <span className="suggestion-course">Eng. Software</span>
                </div>
                <button className="btn-primary btn-sm">Seguir</button>
              </div>
              <div className="suggestion-item">
                <div className="avatar">J</div>
                <div className="suggestion-info">
                  <span className="suggestion-name">João Santos</span>
                  <span className="suggestion-course">Ciência da Computação</span>
                </div>
                <button className="btn-primary btn-sm">Seguir</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

export default Feed;
