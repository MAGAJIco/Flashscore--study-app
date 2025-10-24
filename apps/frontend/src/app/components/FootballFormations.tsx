
"use client";
import React, { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  rating: number;
  x: number;
  y: number;
  number?: number;
}

interface Formation {
  id: string;
  name: string;
  description: string;
  players: Player[];
  tactics: string;
  strengths: string[];
  weaknesses: string[];
}

interface FootballFormationsProps {
  onFormationSelect?: (formation: Formation) => void;
  currentUser?: any;
}

const FootballFormations: React.FC<FootballFormationsProps> = ({
  onFormationSelect,
  currentUser
}) => {
  const [selectedFormation, setSelectedFormation] = useState<string>('4-3-3');
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [customFormation, setCustomFormation] = useState<Formation | null>(null);
  const [showTactics, setShowTactics] = useState(false);

  // Powerful formations like real football
  const formations: Formation[] = [
    {
      id: '4-3-3',
      name: '4-3-3 Attack',
      description: 'Classic attacking formation with wide forwards',
      tactics: 'High pressing, wing play, quick transitions',
      strengths: ['Strong attack', 'Wing dominance', 'Midfield control'],
      weaknesses: ['Defensive vulnerability', 'Central midfield gaps'],
      players: [
        // Goalkeeper
        { id: 1, name: 'GK', position: 'Goalkeeper', rating: 85, x: 50, y: 90 },
        // Defense (4)
        { id: 2, name: 'LB', position: 'Left Back', rating: 78, x: 15, y: 75 },
        { id: 3, name: 'CB1', position: 'Center Back', rating: 82, x: 35, y: 75 },
        { id: 4, name: 'CB2', position: 'Center Back', rating: 82, x: 65, y: 75 },
        { id: 5, name: 'RB', position: 'Right Back', rating: 78, x: 85, y: 75 },
        // Midfield (3)
        { id: 6, name: 'CDM', position: 'Defensive Mid', rating: 80, x: 50, y: 55 },
        { id: 7, name: 'CM1', position: 'Central Mid', rating: 79, x: 35, y: 45 },
        { id: 8, name: 'CM2', position: 'Central Mid', rating: 79, x: 65, y: 45 },
        // Attack (3)
        { id: 9, name: 'LW', position: 'Left Wing', rating: 83, x: 20, y: 25 },
        { id: 10, name: 'ST', position: 'Striker', rating: 88, x: 50, y: 20 },
        { id: 11, name: 'RW', position: 'Right Wing', rating: 83, x: 80, y: 25 },
      ]
    },
    {
      id: '3-5-2',
      name: '3-5-2 Control',
      description: 'Midfield domination with wing-backs',
      tactics: 'Possession-based, overlapping runs, central overload',
      strengths: ['Midfield numbers', 'Wing-back overlap', 'Central presence'],
      weaknesses: ['Wide defensive gaps', 'Requires fit wing-backs'],
      players: [
        { id: 1, name: 'GK', position: 'Goalkeeper', rating: 85, x: 50, y: 90 },
        // Defense (3)
        { id: 2, name: 'LCB', position: 'Left CB', rating: 80, x: 25, y: 75 },
        { id: 3, name: 'CB', position: 'Center Back', rating: 84, x: 50, y: 75 },
        { id: 4, name: 'RCB', position: 'Right CB', rating: 80, x: 75, y: 75 },
        // Midfield (5)
        { id: 5, name: 'LWB', position: 'Left Wing-Back', rating: 77, x: 10, y: 55 },
        { id: 6, name: 'CDM', position: 'Defensive Mid', rating: 82, x: 40, y: 55 },
        { id: 7, name: 'CM', position: 'Central Mid', rating: 81, x: 50, y: 45 },
        { id: 8, name: 'CAM', position: 'Attacking Mid', rating: 79, x: 60, y: 55 },
        { id: 9, name: 'RWB', position: 'Right Wing-Back', rating: 77, x: 90, y: 55 },
        // Attack (2)
        { id: 10, name: 'ST1', position: 'Striker', rating: 86, x: 40, y: 25 },
        { id: 11, name: 'ST2', position: 'Striker', rating: 85, x: 60, y: 25 },
      ]
    },
    {
      id: '4-4-2',
      name: '4-4-2 Diamond',
      description: 'Diamond midfield with two strikers',
      tactics: 'Central play, quick passing, striker partnership',
      strengths: ['Midfield diamond', 'Strike partnership', 'Compact shape'],
      weaknesses: ['Lack of width', 'Full-back dependence'],
      players: [
        { id: 1, name: 'GK', position: 'Goalkeeper', rating: 85, x: 50, y: 90 },
        // Defense (4)
        { id: 2, name: 'LB', position: 'Left Back', rating: 78, x: 15, y: 75 },
        { id: 3, name: 'CB1', position: 'Center Back', rating: 82, x: 35, y: 75 },
        { id: 4, name: 'CB2', position: 'Center Back', rating: 82, x: 65, y: 75 },
        { id: 5, name: 'RB', position: 'Right Back', rating: 78, x: 85, y: 75 },
        // Midfield Diamond (4)
        { id: 6, name: 'CDM', position: 'Defensive Mid', rating: 81, x: 50, y: 65 },
        { id: 7, name: 'LM', position: 'Left Mid', rating: 77, x: 30, y: 50 },
        { id: 8, name: 'RM', position: 'Right Mid', rating: 77, x: 70, y: 50 },
        { id: 9, name: 'CAM', position: 'Attacking Mid', rating: 84, x: 50, y: 35 },
        // Attack (2)
        { id: 10, name: 'ST1', position: 'Striker', rating: 87, x: 40, y: 20 },
        { id: 11, name: 'ST2', position: 'Striker', rating: 85, x: 60, y: 20 },
      ]
    },
    {
      id: '5-3-2',
      name: '5-3-2 Defensive',
      description: 'Solid defensive formation with counter-attacks',
      tactics: 'Defensive stability, counter-attacking, set-piece strength',
      strengths: ['Defensive solidity', 'Counter-attacks', 'Set-pieces'],
      weaknesses: ['Limited creativity', 'Passive play'],
      players: [
        { id: 1, name: 'GK', position: 'Goalkeeper', rating: 85, x: 50, y: 90 },
        // Defense (5)
        { id: 2, name: 'LWB', position: 'Left Wing-Back', rating: 76, x: 10, y: 70 },
        { id: 3, name: 'LCB', position: 'Left CB', rating: 80, x: 25, y: 75 },
        { id: 4, name: 'CB', position: 'Center Back', rating: 84, x: 50, y: 75 },
        { id: 5, name: 'RCB', position: 'Right CB', rating: 80, x: 75, y: 75 },
        { id: 6, name: 'RWB', position: 'Right Wing-Back', rating: 76, x: 90, y: 70 },
        // Midfield (3)
        { id: 7, name: 'CDM', position: 'Defensive Mid', rating: 82, x: 50, y: 55 },
        { id: 8, name: 'LM', position: 'Left Mid', rating: 78, x: 35, y: 45 },
        { id: 9, name: 'RM', position: 'Right Mid', rating: 78, x: 65, y: 45 },
        // Attack (2)
        { id: 10, name: 'ST1', position: 'Striker', rating: 86, x: 40, y: 25 },
        { id: 11, name: 'ST2', position: 'Striker', rating: 84, x: 60, y: 25 },
      ]
    },
    {
      id: '4-2-3-1',
      name: '4-2-3-1 Modern',
      description: 'Modern tactical formation with creative freedom',
      tactics: 'Balanced approach, creative midfield, pressing triggers',
      strengths: ['Balance', 'Creative freedom', 'Pressing options'],
      weaknesses: ['Complex coordination', 'Requires technical players'],
      players: [
        { id: 1, name: 'GK', position: 'Goalkeeper', rating: 85, x: 50, y: 90 },
        // Defense (4)
        { id: 2, name: 'LB', position: 'Left Back', rating: 78, x: 15, y: 75 },
        { id: 3, name: 'CB1', position: 'Center Back', rating: 82, x: 35, y: 75 },
        { id: 4, name: 'CB2', position: 'Center Back', rating: 82, x: 65, y: 75 },
        { id: 5, name: 'RB', position: 'Right Back', rating: 78, x: 85, y: 75 },
        // Defensive Midfield (2)
        { id: 6, name: 'CDM1', position: 'Defensive Mid', rating: 80, x: 40, y: 60 },
        { id: 7, name: 'CDM2', position: 'Defensive Mid', rating: 80, x: 60, y: 60 },
        // Attacking Midfield (3)
        { id: 8, name: 'LAM', position: 'Left AM', rating: 83, x: 25, y: 40 },
        { id: 9, name: 'CAM', position: 'Central AM', rating: 86, x: 50, y: 35 },
        { id: 10, name: 'RAM', position: 'Right AM', rating: 83, x: 75, y: 40 },
        // Attack (1)
        { id: 11, name: 'ST', position: 'Striker', rating: 89, x: 50, y: 20 },
      ]
    }
  ];

  const handleFormationChange = (formationId: string) => {
    setSelectedFormation(formationId);
    const formation = formations.find(f => f.id === formationId);
    if (formation && onFormationSelect) {
      onFormationSelect(formation);
    }
  };

  const handlePlayerDrag = (player: Player, newX: number, newY: number) => {
    if (!customFormation) {
      const current = formations.find(f => f.id === selectedFormation);
      if (current) {
        setCustomFormation({
          ...current,
          id: 'custom',
          name: 'Custom Formation',
          players: current.players.map(p => 
            p.id === player.id ? { ...p, x: newX, y: newY } : p
          )
        });
      }
    } else {
      setCustomFormation({
        ...customFormation,
        players: customFormation.players.map(p => 
          p.id === player.id ? { ...p, x: newX, y: newY } : p
        )
      });
    }
  };

  const currentFormation = customFormation || formations.find(f => f.id === selectedFormation);

  const getPositionColor = (position: string) => {
    if (position.includes('GK') || position === 'Goalkeeper') return '#fbbf24';
    if (position.includes('Back') || position.includes('CB')) return '#3b82f6';
    if (position.includes('Mid') || position.includes('CM') || position.includes('CDM') || position.includes('CAM')) return '#10b981';
    return '#ef4444';
  };

  const getPowerRating = (formation: Formation) => {
    const avgRating = formation.players.reduce((sum, p) => sum + p.rating, 0) / formation.players.length;
    return Math.round(avgRating);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
      borderRadius: '20px',
      padding: '30px',
      margin: '20px 0',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      color: '#fff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#10b981',
          margin: 0,
          textAlign: 'center'
        }}>
          ⚽ Powerful Football Formations
        </h2>
        <button
          onClick={() => setShowTactics(!showTactics)}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          📋 Tactics
        </button>
      </div>

      {/* Formation Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '30px'
      }}>
        {formations.map(formation => (
          <button
            key={formation.id}
            onClick={() => handleFormationChange(formation.id)}
            style={{
              background: selectedFormation === formation.id 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(255, 255, 255, 0.1)',
              border: selectedFormation === formation.id
                ? '2px solid #10b981'
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {formation.name}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Power: {getPowerRating(formation)}
            </div>
          </button>
        ))}
      </div>

      {/* Tactics Panel */}
      {showTactics && currentFormation && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '16px' }}>
            🎯 {currentFormation.name} Tactics
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: '#3b82f6' }}>Strategy:</strong>
            <p style={{ margin: '4px 0', color: '#d1d5db' }}>{currentFormation.tactics}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <strong style={{ color: '#22c55e' }}>✅ Strengths:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '16px', color: '#d1fae5' }}>
                {currentFormation.strengths.map((strength, index) => (
                  <li key={index} style={{ margin: '4px 0' }}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <strong style={{ color: '#ef4444' }}>⚠️ Weaknesses:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '16px', color: '#fecaca' }}>
                {currentFormation.weaknesses.map((weakness, index) => (
                  <li key={index} style={{ margin: '4px 0' }}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Football Pitch */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        background: 'linear-gradient(180deg, #15803d 0%, #166534 100%)',
        borderRadius: '16px',
        border: '3px solid #fff',
        overflow: 'hidden',
        margin: '0 auto'
      }}>
        {/* Pitch Lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          {/* Center Circle */}
          <circle cx="50%" cy="50%" r="80" fill="none" stroke="#fff" strokeWidth="2"/>
          <circle cx="50%" cy="50%" r="2" fill="#fff"/>
          
          {/* Center Line */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" strokeWidth="2"/>
          
          {/* Penalty Areas */}
          <rect x="25%" y="5%" width="50%" height="15%" fill="none" stroke="#fff" strokeWidth="2"/>
          <rect x="25%" y="80%" width="50%" height="15%" fill="none" stroke="#fff" strokeWidth="2"/>
          
          {/* Goal Areas */}
          <rect x="35%" y="0%" width="30%" height="8%" fill="none" stroke="#fff" strokeWidth="2"/>
          <rect x="35%" y="92%" width="30%" height="8%" fill="none" stroke="#fff" strokeWidth="2"/>
          
          {/* Corner Arcs */}
          <path d="M 0 0 Q 0 20 20 0" fill="none" stroke="#fff" strokeWidth="2"/>
          <path d="M 100% 0 Q 100% 20 calc(100% - 20px) 0" fill="none" stroke="#fff" strokeWidth="2" transform="scale(-1,1) translate(-100%,0)"/>
          <path d="M 0 100% Q 0 80% 20 100%" fill="none" stroke="#fff" strokeWidth="2"/>
          <path d="M 100% 100% Q 100% 80% calc(100% - 20px) 100%" fill="none" stroke="#fff" strokeWidth="2" transform="scale(-1,1) translate(-100%,0)"/>
        </svg>

        {/* Players */}
        {currentFormation?.players.map(player => (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getPositionColor(player.position)}, ${getPositionColor(player.position)}dd)`,
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              cursor: 'grab',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseDown={(e) => {
              setDraggedPlayer(player);
              e.preventDefault();
            }}
            onMouseMove={(e) => {
              if (draggedPlayer && draggedPlayer.id === player.id) {
                const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                if (rect) {
                  const newX = ((e.clientX - rect.left) / rect.width) * 100;
                  const newY = ((e.clientY - rect.top) / rect.height) * 100;
                  handlePlayerDrag(player, Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
                }
              }
            }}
            onMouseUp={() => setDraggedPlayer(null)}
            title={`${player.name} - ${player.position} (${player.rating})`}
          >
            {player.number || player.id}
          </div>
        ))}
      </div>

      {/* Formation Stats */}
      {currentFormation && (
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
              {getPowerRating(currentFormation)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#93c5fd' }}>Overall Power</div>
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 'bold' }}>
              {currentFormation.players.filter(p => p.position.includes('ST') || p.position.includes('Wing')).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fca5a5' }}>Attack Power</div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>
              {currentFormation.players.filter(p => p.position.includes('Mid')).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6ee7b7' }}>Midfield Control</div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>
              {currentFormation.players.filter(p => p.position.includes('Back') || p.position.includes('CB')).length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>Defensive Strength</div>
          </div>
        </div>
      )}

      {/* Save Custom Formation */}
      {customFormation && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {
              console.log('Custom formation saved:', customFormation);
              // Save to localStorage or send to backend
              localStorage.setItem('customFormation', JSON.stringify(customFormation));
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            💾 Save Custom Formation
          </button>
        </div>
      )}

      {/* Pro Tips */}
      <div style={{
        marginTop: '20px',
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <h4 style={{ color: '#a855f7', margin: '0 0 12px 0' }}>⚡ Pro Formation Tips:</h4>
        <ul style={{ margin: 0, paddingLeft: '16px', color: '#ddd6fe' }}>
          <li>Drag players to create custom formations</li>
          <li>Higher rated players = better performance</li>
          <li>Balance attack, midfield, and defense</li>
          <li>Consider opponent's formation when selecting</li>
          <li>Use wing-backs for width in 3-5-2</li>
          <li>4-3-3 is great for possession play</li>
        </ul>
      </div>
    </div>
  );
};

export { FootballFormations };
