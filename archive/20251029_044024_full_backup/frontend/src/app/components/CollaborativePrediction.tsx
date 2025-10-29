
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';

interface CollaborationRoom {
  id: string;
  name: string;
  participants: string[];
  predictions: {
    userId: string;
    userName: string;
    prediction: string;
    confidence: number;
    stake: number;
  }[];
  totalPool: number;
  matchId: string;
  matchName: string;
  status: 'active' | 'locked' | 'completed';
}

export function CollaborativePrediction() {
  const [rooms, setRooms] = useState<CollaborationRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<CollaborationRoom | null>(null);
  const [userPrediction, setUserPrediction] = useState('');
  const [userStake, setUserStake] = useState(10);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const savedRooms = ClientStorage.getItem('collaboration_rooms', []);
    setRooms(savedRooms);
  };

  const createRoom = () => {
    const newRoom: CollaborationRoom = {
      id: `room_${Date.now()}`,
      name: `Prediction Room ${rooms.length + 1}`,
      participants: ['You'],
      predictions: [],
      totalPool: 0,
      matchId: 'match_1',
      matchName: 'Liverpool vs Arsenal',
      status: 'active'
    };
    
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    ClientStorage.setItem('collaboration_rooms', updatedRooms);
  };

  const joinRoom = (room: CollaborationRoom) => {
    setSelectedRoom(room);
  };

  const submitPrediction = () => {
    if (!selectedRoom || !userPrediction) return;

    const newPrediction = {
      userId: 'user_1',
      userName: 'You',
      prediction: userPrediction,
      confidence: 75,
      stake: userStake
    };

    const updatedRoom = {
      ...selectedRoom,
      predictions: [...selectedRoom.predictions, newPrediction],
      totalPool: selectedRoom.totalPool + userStake
    };

    const updatedRooms = rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r);
    setRooms(updatedRooms);
    ClientStorage.setItem('collaboration_rooms', updatedRooms);
    setSelectedRoom(updatedRoom);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        👥 Collaborative Predictions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Rooms List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#3b82f6', margin: 0 }}>Active Rooms</h3>
            <button
              onClick={createRoom}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              + Create
            </button>
          </div>

          {rooms.map(room => (
            <div
              key={room.id}
              onClick={() => joinRoom(room)}
              style={{
                background: selectedRoom?.id === room.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                cursor: 'pointer',
                border: selectedRoom?.id === room.id ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ color: '#fff', fontWeight: '600', marginBottom: '4px' }}>{room.name}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                👥 {room.participants.length} participants
              </div>
              <div style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '4px' }}>
                💰 Pool: π{room.totalPool}
              </div>
            </div>
          ))}
        </div>

        {/* Room Details */}
        <div>
          {selectedRoom ? (
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#fff', marginBottom: '12px' }}>🎯 {selectedRoom.matchName}</h3>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Total Pool: π{selectedRoom.totalPool} • {selectedRoom.participants.length} Predictors
                </div>

                {/* Prediction Form */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#d1d5db', display: 'block', marginBottom: '8px' }}>
                    Your Prediction
                  </label>
                  <select
                    value={userPrediction}
                    onChange={(e) => setUserPrediction(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      marginBottom: '12px'
                    }}
                  >
                    <option value="">Select Outcome</option>
                    <option value="home">Home Win</option>
                    <option value="draw">Draw</option>
                    <option value="away">Away Win</option>
                  </select>

                  <label style={{ color: '#d1d5db', display: 'block', marginBottom: '8px' }}>
                    Stake: π{userStake}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={userStake}
                    onChange={(e) => setUserStake(Number(e.target.value))}
                    style={{ width: '100%', marginBottom: '16px' }}
                  />

                  <button
                    onClick={submitPrediction}
                    disabled={!userPrediction}
                    style={{
                      width: '100%',
                      background: userPrediction ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: userPrediction ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Submit Prediction
                  </button>
                </div>

                {/* Predictions List */}
                <div>
                  <h4 style={{ color: '#3b82f6', marginBottom: '12px' }}>Room Predictions</h4>
                  {selectedRoom.predictions.map((pred, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ color: '#fff', fontWeight: '600' }}>{pred.userName}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                          {pred.prediction} • {pred.confidence}% confidence
                        </div>
                      </div>
                      <div style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        π{pred.stake}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prize Distribution Preview */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <h4 style={{ color: '#22c55e', marginBottom: '8px' }}>💎 Prize Distribution</h4>
                <div style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                  Winner takes: π{Math.floor(selectedRoom.totalPool * 0.9)}<br />
                  Platform fee: π{Math.floor(selectedRoom.totalPool * 0.1)}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              Select a room to start predicting together
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

