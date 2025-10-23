"use client";
import React, { useState, useEffect } from 'react';
import { ClientCacheManager } from '../../../../../packages/shared/src/libs/utils/cacheManager';
import { ClientStorage } from '../../../../../packages/shared/src/libs/utils/clientStorage';

interface ToolsProps {
  predictions: any[];
}

function InteractiveTools({ predictions }: ToolsProps) {
  const [selectedSport, setSelectedSport] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load favorites from cache
  useEffect(() => {
    const cached = ClientCacheManager.get<string[]>('user_favorites') || [];
    setFavorites(cached);
  }, []);

  // Save favorites to cache
  useEffect(() => {
    ClientCacheManager.set('user_favorites', favorites, 60 * 24); // 24 hours
  }, [favorites]);

  const toggleFavorite = (title: string) => {
    setFavorites(prev => 
      prev.includes(title) 
        ? prev.filter(f => f !== title)
        : [...prev, title]
    );
  };

  const filteredPredictions = predictions
    .filter(p => {
      if (selectedSport !== 'all' && p.sport !== selectedSport) return false;
      if (confidenceFilter !== 'all') {
        const confidence = parseInt(p.confidence?.split('-')[0] || '0');
        if (confidenceFilter === 'high' && confidence < 75) return false;
        if (confidenceFilter === 'medium' && (confidence < 50 || confidence >= 75)) return false;
        if (confidenceFilter === 'low' && confidence >= 50) return false;
      }
      if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'confidence') {
        const aConf = parseInt(a.confidence?.split('-')[0] || '0');
        const bConf = parseInt(b.confidence?.split('-')[0] || '0');
        return bConf - aConf;
      }
      if (sortBy === 'sport') return a.sport.localeCompare(b.sport);
      return a.title.localeCompare(b.title);
    });

  const sports = ['all', ...Array.from(new Set(predictions.map(p => p.sport).filter(Boolean)))];

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '12px',
      marginBottom: '20px'
    }}>
      {/* Header with mobile hamburger */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h3 style={{ margin: '0', color: '#2c3e50' }}>Interactive Prediction Tools</h3>
        
        {/* Mobile filter toggle */}
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            display: 'none',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          className="mobile-filter-toggle"
        >
          🔧 Filters
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Search predictions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e1e5e9',
            borderRadius: '25px',
            fontSize: '16px',
            backgroundColor: 'white'
          }}
        />
      </div>

      {/* Filters - responsive */}
      <div 
        className={`filters-container ${isFilterOpen ? 'mobile-open' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Sport Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            Sport
          </label>
          <select 
            value={selectedSport} 
            onChange={(e) => setSelectedSport(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            Confidence
          </label>
          <select 
            value={confidenceFilter} 
            onChange={(e) => setConfidenceFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            <option value="all">All Confidence</option>
            <option value="high">High (75%+)</option>
            <option value="medium">Medium (50-74%)</option>
            <option value="low">Low (&lt;50%)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            Sort By
          </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            <option value="confidence">Confidence</option>
            <option value="sport">Sport</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* View Mode */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
            View Mode
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: viewMode === 'grid' ? '#007bff' : '#f8f9fa',
                color: viewMode === 'grid' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: viewMode === 'list' ? '#007bff' : '#f8f9fa',
                color: viewMode === 'list' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📄 List
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span style={{ color: '#666' }}>
          Showing {filteredPredictions.length} of {predictions.length} predictions
        </span>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          ⭐ {favorites.length} favorites
        </span>
      </div>

      {/* Predictions Display */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        flexDirection: viewMode === 'list' ? 'column' : undefined,
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
        gap: '15px'
      }}>
        {filteredPredictions.map((prediction, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: favorites.includes(prediction.title) ? '3px solid #ffd700' : '1px solid #e1e5e9',
            position: 'relative'
          }}>
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(prediction.title)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: favorites.includes(prediction.title) ? '#ffd700' : '#ccc'
              }}
            >
              {favorites.includes(prediction.title) ? '⭐' : '☆'}
            </button>

            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', paddingRight: '40px' }}>
              {prediction.title}
            </h4>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '0.8rem' 
              }}>
                {prediction.sport || 'N/A'}
              </span>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: '#27ae60', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '0.8rem' 
              }}>
                {prediction.confidence || 'N/A'}
              </span>
              <span style={{ 
                padding: '4px 8px', 
                backgroundColor: prediction.source === 'internal' ? '#e74c3c' : '#f39c12', 
                color: 'white', 
                borderRadius: '12px', 
                fontSize: '0.8rem' 
              }}>
                {prediction.source || 'external'}
              </span>
            </div>
            
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem' }}>
              {prediction.content || 'No additional content'}
            </p>
          </div>
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#7f8c8d' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
          <h4>No predictions found</h4>
          <p>Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-filter-toggle { display: block !important; }
          .filters-container:not(.mobile-open) { display: none !important; }
          .filters-container.mobile-open { 
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default InteractiveTools;
