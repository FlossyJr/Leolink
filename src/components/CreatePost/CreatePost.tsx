import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated: () => void;
  onSubmit: (content: string, image?: File) => Promise<void>;
}

function CreatePost({ onPostCreated, onSubmit }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      await onSubmit(content, image || undefined);
      setContent('');
      removeImage();
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

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={removeImage}
            >
              ✕
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <div className="post-options">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              hidden
              id="post-image-input"
            />
            <label htmlFor="post-image-input" className="option-btn">
              <span>📷</span>
              <span>Foto</span>
            </label>
            <button type="button" className="option-btn">
              <span>🎥</span>
              <span>Vídeo</span>
            </button>
            <button type="button" className="option-btn">
              <span>📅</span>
              <span>Evento</span>
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-primary publish-btn"
            disabled={loading || (!content.trim() && !image)}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16 }}></span>
                Publicando...
              </>
            ) : (
              'Publicar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
