
"use client";

import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  relevanceScore: number;
  readTime: string;
  imageUrl?: string;
}

export function SmartNewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'soccer', label: 'Soccer', icon: '⚽' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'football', label: 'Football', icon: '🏈' },
    { id: 'trending', label: 'Trending', icon: '🔥' }
  ];

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      const filtered = selectedCategories.filter(c => c !== 'all');
      setSelectedCategories(
        filtered.includes(categoryId)
          ? filtered.filter(c => c !== categoryId)
          : [...filtered, categoryId]
      );
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px'
      }}>
        📰 Your Smart Feed
      </h1>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            style={{
              background: selectedCategories.includes(cat.id)
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {newsItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {item.category}
              </span>
              <span style={{ fontSize: '11px', color: '#888' }}>
                {item.readTime} read
              </span>
            </div>
            <h3 style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {item.title}
            </h3>
            <p style={{
              color: '#aaa',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
