import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated: () => void;
  onSubmit: (content: string) => Promise<void>;
}

function CreatePost({ onPostCreated, onSubmit }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit(content);
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <div className="avatar">
          {user?.name[0].toUpperCase()}
        </div>
        <span className="create-post-greeting">
          O que você está pensando, <strong>{user?.name.split(' ')[0]}</strong>?
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Compartilhe algo interessante..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows={3}
        />

        <div className="create-post-actions">
          <button 
            type="submit" 
            className="btn-primary post-submit-btn"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
