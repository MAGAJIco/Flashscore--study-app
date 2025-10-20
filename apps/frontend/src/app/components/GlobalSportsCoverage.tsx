
import React, { useState, useEffect } from 'react';
import { useMobile } from '@hooks/useMobile';

interface Sport {
  id: string;
  name: string;
  icon: string;
  regions: string[];
}

interface Region {
  id: string;
  name: string;
  icon: string;
  popularSports: string[];
}

const GLOBAL_SPORTS: Sport[] = [
  { id: 'football', name: 'Football/Soccer', icon: '⚽', regions: ['Europe', 'South America', 'Africa', 'Asia', 'North America'] },
  { id: 'basketball', name: 'Basketball', icon: '🏀', regions: ['North America', 'Europe', 'Asia'] },
  { id: 'cricket', name: 'Cricket', icon: '🏏', regions: ['Asia', 'Oceania', 'Europe'] },
  { id: 'rugby', name: 'Rugby', icon: '🏉', regions: ['Oceania', 'Europe', 'Africa'] },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒', regions: ['North America', 'Europe'] },
  { id: 'baseball', name: 'Baseball', icon: '⚾', regions: ['North America', 'Asia', 'Central America'] },
  { id: 'american-football', name: 'American Football', icon: '🏈', regions: ['North America'] },
  { id: 'tennis', name: 'Tennis', icon: '🎾', regions: ['Global'] },
  { id: 'golf', name: 'Golf', icon: '⛳', regions: ['Global'] },
  { id: 'racing', name: 'Motorsports', icon: '🏎️', regions: ['Global'] },
  { id: 'mma', name: 'MMA/Boxing', icon: '🥊', regions: ['Global'] },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', regions: ['Europe', 'South America', 'Asia'] },
  { id: 'handball', name: 'Handball', icon: '🤾', regions: ['Europe'] },
];

const REGIONS: Region[] = [
  { id: 'europe', name: 'Europe', icon: '🇪🇺', popularSports: ['football', 'basketball', 'hockey', 'handball', 'rugby'] },
  { id: 'north-america', name: 'North America', icon: '🌎', popularSports: ['american-football', 'basketball', 'baseball', 'hockey'] },
  { id: 'south-america', name: 'South America', icon: '🌎', popularSports: ['football', 'volleyball', 'basketball'] },
  { id: 'asia', name: 'Asia', icon: '🌏', popularSports: ['cricket', 'football', 'basketball', 'baseball'] },
  { id: 'africa', name: 'Africa', icon: '🌍', popularSports: ['football', 'rugby', 'cricket'] },
  { id: 'oceania', name: 'Oceania', icon: '🌏', popularSports: ['rugby', 'cricket', 'football'] },
  { id: 'global', name: 'Global', icon: '🌐', popularSports: ['tennis', 'golf', 'racing', 'mma'] },
];

export default function GlobalSportsCoverage() {
  const isMobile = useMobile();
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('global_sports_preferences');
    if (saved) {
      setSelectedSports(JSON.parse(saved));
    }
  }, []);

  const toggleSport = (sportId: string) => {
    const updated = selectedSports.includes(sportId)
      ? selectedSports.filter(id => id !== sportId)
      : [...selectedSports, sportId];
    
    setSelectedSports(updated);
    localStorage.setItem('global_sports_preferences', JSON.stringify(updated));
  };

  const filteredSports = GLOBAL_SPORTS.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'global' || sport.regions.includes(
      REGIONS.find(r => r.id === selectedRegion)?.name || ''
    );
    return matchesSearch && matchesRegion;
  });

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: isMobile ? '16px' : '24px',
      margin: '16px',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: isMobile ? '20px' : '28px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px 0'
        }}>
          🌍 Global Sports Coverage
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          margin: 0
        }}>
          Follow sports from around the world - {selectedSports.length} sports selected
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search sports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* Region Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          color: '#fff',
          fontSize: '16px',
          marginBottom: '12px'
        }}>
          📍 Filter by Region
        </h3>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {REGIONS.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              style={{
                background: selectedRegion === region.id
                  ? 'linear-gradient(135deg, #00ff88, #00a2ff)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: selectedRegion === region.id
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedRegion === region.id ? '#000' : '#fff',
                padding: '8px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {region.icon} {region.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {filteredSports.map(sport => {
          const isSelected = selectedSports.includes(sport.id);
          return (
            <button
              key={sport.id}
              onClick={() => toggleSport(sport.id)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 162, 255, 0.2))'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isSelected
                  ? '2px solid #00ff88'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 136, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>{sport.icon}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {sport.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '4px'
                  }}>
                    {sport.regions.join(', ')}
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredSports.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🔍</p>
          <p>No sports found matching your search</p>
        </div>
      )}
    </div>
  );
}
