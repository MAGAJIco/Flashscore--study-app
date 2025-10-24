"use client";
import React, { useState, useEffect } from 'react';
import { UserManager } from '@magajico/shared/utils';

interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: Date;
  lastLogin?: Date;
  sessionToken?: string;
  loginAttempts?: number;
  lockedUntil?: Date;
  emailVerified?: boolean;
  role?: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  replies: ForumReply[];
  category: 'general' | 'sports' | 'challenges' | 'predictions';
}

interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: Date;
  likes: string[];
}

interface ForumProps {
  currentUser: User | null;
}

const Forum: React.FC<ForumProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'sports' | 'challenges' | 'predictions'>('all');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as 'general' | 'sports' | 'challenges' | 'predictions'
  });
  const [replyContent, setReplyContent] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const stored = localStorage.getItem('sports_central_forum_posts');
    if (stored) {
      setPosts(JSON.parse(stored));
    }
  };

  const savePosts = (postList: ForumPost[]) => {
    localStorage.setItem('sports_central_forum_posts', JSON.stringify(postList));
    setPosts(postList);
  };

  const createPost = () => {
    if (!currentUser || !newPost.title.trim() || !newPost.content.trim()) return;

    const post: ForumPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newPost.title,
      content: newPost.content,
      author: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: [],
      replies: [],
      category: newPost.category
    };

    const updatedPosts = [post, ...posts];
    savePosts(updatedPosts);

    setNewPost({ title: '', content: '', category: 'general' });
    setShowCreatePost(false);
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  const addReply = (postId: string) => {
    if (!currentUser || !replyContent[postId]?.trim()) return;

    const reply: ForumReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: replyContent[postId],
      author: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date(),
      likes: []
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, reply]
        };
      }
      return post;
    });

    savePosts(updatedPosts);
    setReplyContent({ ...replyContent, [postId]: '' });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return '💬';
      case 'sports': return '⚽';
      case 'challenges': return '🏆';
      case 'predictions': return '🔮';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return '#6b7280';
      case 'sports': return '#22c55e';
      case 'challenges': return '#f59e0b';
      case 'predictions': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          margin: '0',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💬 Community Forum
        </h2>
        
        {currentUser && (
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
            }}
          >
            ✍️ New Post
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {['all', 'general', 'sports', 'challenges', 'predictions'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            style={{
              background: selectedCategory === category 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'rgba(255, 255, 255, 0.1)',
              color: selectedCategory === category ? 'white' : '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {category === 'all' ? '📌 All' : `${getCategoryIcon(category)} ${category}`}
          </button>
        ))}
      </div>

      {/* Create Post Form */}
      {showCreatePost && currentUser && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#8b5cf6', marginBottom: '20px' }}>Create New Post</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
            
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              <option value="general">💬 General Discussion</option>
              <option value="sports">⚽ Sports Talk</option>
              <option value="challenges">🏆 Challenges</option>
              <option value="predictions">🔮 Predictions</option>
            </select>
            
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px',
                minHeight: '120px',
                resize: 'vertical'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreatePost(false)}
                style={{
                  background: 'transparent',
                  color: '#ccc',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
            <h3>No posts yet!</h3>
            <p>Be the first to start a conversation in the community.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: getCategoryColor(post.category),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {getCategoryIcon(post.category)} {post.category}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      by {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 style={{ color: '#22c55e', margin: '0 0 12px 0', fontSize: '1.3rem' }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ color: '#d1fae5', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {currentUser && (
                      <button
                        onClick={() => likePost(post.id)}
                        style={{
                          background: post.likes.includes(currentUser.id) ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          color: post.likes.includes(currentUser.id) ? '#ef4444' : '#9ca3af',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        ❤️ {post.likes.length}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      style={{
                        background: 'transparent',
                        color: '#06b6d4',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      💬 {post.replies.length} replies
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Replies Section */}
              {expandedPost === post.id && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {post.replies.map(reply => (
                    <div
                      key={reply.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e', fontWeight: '600' }}>
                          {reply.authorName}
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: '#d1fae5', margin: '0' }}>
                        {reply.content}
                      </p>
                    </div>
                  ))}
                  
                  {currentUser && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '14px'
                        }}
                      />
                      <button
                        onClick={() => addReply(post.id)}
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4, #0369a1)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { Forum };
