import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { likeService } from '../../services/likeService';
import { commentService, Comment } from '../../services/commentService';
import './PostCard.css';

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  author: Author;
  createdAt: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: () => void;
}

function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return postDate.toLocaleDateString('pt-BR');
  };

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    
    try {
      if (liked) {
        await likeService.unlikePost(post.id);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await likeService.likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Erro ao curtir:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const response = await commentService.getPostComments(post.id);
        setComments(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.createComment(post.id, { content: newComment });
      const response = await commentService.getPostComments(post.id);
      setComments(response.data || []);
      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      onDelete?.(post.id);
    }
  };

  const isOwner = user?.id === post.authorId;

  return (
    <article className="post-card animate-fadeInUp">
      <header className="post-header">
        <div className="post-author-info">
          <div className="avatar">
            {post.author.name[0].toUpperCase()}
          </div>
          <div className="author-details">
            <span className="author-name">{post.author.name}</span>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {isOwner && (
          <div className="post-menu">
            <button className="btn-ghost post-menu-btn" onClick={handleDelete}>
              🗑️
            </button>
          </div>
        )}
      </header>

      <div className="post-body">
        <p className="post-content">{post.content}</p>
        {post.imageUrl && (
          <div className="post-image">
            <img src={post.imageUrl} alt="Post" />
          </div>
        )}
      </div>

      <footer className="post-footer">
        <div className="post-stats">
          {likesCount > 0 && (
            <span className="stat-item">
              💛 {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
            </span>
          )}
          {post.commentsCount && post.commentsCount > 0 && (
            <span className="stat-item">
              {post.commentsCount} {post.commentsCount === 1 ? 'comentário' : 'comentários'}
            </span>
          )}
        </div>

        <div className="post-actions">
          <button 
            className={`action-btn ${liked ? 'liked' : ''}`} 
            onClick={handleLike}
            disabled={loadingLike}
          >
            <span className="action-icon">{liked ? '💛' : '🤍'}</span>
            <span>Curtir</span>
          </button>
          <button className="action-btn" onClick={toggleComments}>
            <span className="action-icon">💬</span>
            <span>Comentar</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🔗</span>
            <span>Compartilhar</span>
          </button>
        </div>

        {showComments && (
          <div className="comments-section">
            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="avatar avatar-sm">
                {user?.name[0].toUpperCase()}
              </div>
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={!newComment.trim()}>
                Enviar
              </button>
            </form>

            {loadingComments ? (
              <div className="loading-comments">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="avatar avatar-sm">
                      {comment.author.name[0].toUpperCase()}
                    </div>
                    <div className="comment-content">
                      <div className="comment-bubble">
                        <span className="comment-author">{comment.author.name}</span>
                        <p>{comment.content}</p>
                      </div>
                      <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="no-comments">Nenhum comentário ainda. Seja o primeiro!</p>
                )}
              </div>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}

export default PostCard;
