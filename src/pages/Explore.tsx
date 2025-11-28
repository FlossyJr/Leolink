import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/PostCard/PostCard';
import { postService, Post } from '../services/postService';
import './Explore.css';

function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'recent' | 'popular'>('recent');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts(1, 20, searchTerm || undefined);
      setPosts(response.items || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="explore-page">
        <header className="explore-header">
          <h1>🔍 Explorar</h1>
          <p className="explore-subtitle">Descubra novos conteúdos e pessoas</p>
        </header>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Buscar posts, pessoas, hashtags..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="explore-filters">
          <button
            className={`filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recent')}
          >
            🕒 Recentes
          </button>
          <button
            className={`filter-btn ${activeFilter === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveFilter('popular')}
          >
            🔥 Popular
          </button>
        </div>

        <div className="explore-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>Nenhum post encontrado</h3>
              <p>Tente usar outros termos de busca</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => setPosts(posts.filter(p => p.id !== post.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Explore;
