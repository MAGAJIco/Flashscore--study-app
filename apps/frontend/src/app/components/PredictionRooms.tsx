
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

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

interface PredictionRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  creatorName: string;
  members: RoomMember[];
  predictions: RoomPrediction[];
  isPrivate: boolean;
  inviteCode: string;
  createdAt: Date;
  settings: {
    allowGuestPredictions: boolean;
    minConfidence: number;
    requirePiStake: boolean;
    minPiStake: number;
  };
}

interface RoomMember {
  userId: string;
  username: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  stats: {
    predictions: number;
    correct: number;
    piEarned: number;
  };
}

interface RoomPrediction {
  id: string;
  userId: string;
  username: string;
  matchId: string;
  matchName: string;
  prediction: string;
  confidence: number;
  piStake: number;
  timestamp: Date;
  result?: 'correct' | 'incorrect' | 'pending';
}

interface PredictionRoomsProps {
  currentUser: User | null;
}

const PredictionRooms: React.FC<PredictionRoomsProps> = ({ currentUser }) => {
  const [rooms, setRooms] = useState<PredictionRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<PredictionRoom | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    isPrivate: true,
    allowGuestPredictions: false,
    minConfidence: 50,
    requirePiStake: false,
    minPiStake: 10
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const stored = ClientStorage.getItem('prediction_rooms', []);
    setRooms(stored);
  };

  const saveRooms = (updatedRooms: PredictionRoom[]) => {
    ClientStorage.setItem('prediction_rooms', updatedRooms);
    setRooms(updatedRooms);
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!currentUser || !newRoom.name.trim()) return;

    const room: PredictionRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newRoom.name,
      description: newRoom.description,
      createdBy: currentUser.id,
      creatorName: currentUser.username,
      members: [{
        userId: currentUser.id,
        username: currentUser.username,
        role: 'owner',
        joinedAt: new Date(),
        stats: { predictions: 0, correct: 0, piEarned: 0 }
      }],
      predictions: [],
      isPrivate: newRoom.isPrivate,
      inviteCode: generateInviteCode(),
      createdAt: new Date(),
      settings: {
        allowGuestPredictions: newRoom.allowGuestPredictions,
        minConfidence: newRoom.minConfidence,
        requirePiStake: newRoom.requirePiStake,
        minPiStake: newRoom.minPiStake
      }
    };

    const updatedRooms = [room, ...rooms];
    saveRooms(updatedRooms);
    setShowCreateRoom(false);
    setNewRoom({
      name: '',
      description: '',
      isPrivate: true,
      allowGuestPredictions: false,
      minConfidence: 50,
      requirePiStake: false,
      minPiStake: 10
    });
  };

  const joinRoom = () => {
    if (!currentUser || !inviteCode.trim()) return;

    const room = rooms.find(r => r.inviteCode === inviteCode.toUpperCase());
    if (!room) {
      alert('Invalid invite code');
      return;
    }

    if (room.members.some(m => m.userId === currentUser.id)) {
      alert('You are already a member of this room');
      return;
    }

    const updatedRooms = rooms.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          members: [...r.members, {
            userId: currentUser.id,
            username: currentUser.username,
            role: 'member' as const,
            joinedAt: new Date(),
            stats: { predictions: 0, correct: 0, piEarned: 0 }
          }]
        };
      }
      return r;
    });

    saveRooms(updatedRooms);
    setInviteCode('');
    setShowJoinRoom(false);
  };

  const addPrediction = (roomId: string, prediction: Omit<RoomPrediction, 'id' | 'timestamp'>) => {
    if (!currentUser) return;

    const roomPrediction: RoomPrediction = {
      ...prediction,
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      result: 'pending'
    };

    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          predictions: [roomPrediction, ...room.predictions]
        };
      }
      return room;
    });

    saveRooms(updatedRooms);
  };

  const leaveRoom = (roomId: string) => {
    if (!currentUser) return;

    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          members: room.members.filter(m => m.userId !== currentUser.id)
        };
      }
      return room;
    }).filter(room => room.members.length > 0);

    saveRooms(updatedRooms);
    setSelectedRoom(null);
  };

  const userRooms = rooms.filter(room => 
    room.members.some(m => m.userId === currentUser?.id)
  );

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
          margin: 0,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏠 Prediction Rooms
        </h2>

        {currentUser && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowJoinRoom(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔑 Join Room
            </button>
            <button
              onClick={() => setShowCreateRoom(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ➕ Create Room
            </button>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '20px' }}>Create New Prediction Room</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />

            <textarea
              placeholder="Description (optional)"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={newRoom.isPrivate}
                  onChange={(e) => setNewRoom({ ...newRoom, isPrivate: e.target.checked })}
                />
                Private Room (invite only)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={newRoom.requirePiStake}
                  onChange={(e) => setNewRoom({ ...newRoom, requirePiStake: e.target.checked })}
                />
                Require Pi Stake
              </label>

              {newRoom.requirePiStake && (
                <input
                  type="number"
                  placeholder="Minimum Pi Stake"
                  value={newRoom.minPiStake}
                  onChange={(e) => setNewRoom({ ...newRoom, minPiStake: parseInt(e.target.value) || 10 })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '16px'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateRoom(false)}
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
                onClick={createRoom}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinRoom && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '20px' }}>Join Prediction Room</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Enter Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px',
                textTransform: 'uppercase'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowJoinRoom(false)}
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
                onClick={joinRoom}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rooms List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {userRooms.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
            <h3>No rooms yet!</h3>
            <p>Create a room or join one with an invite code to start predicting with friends.</p>
          </div>
        ) : (
          userRooms.map(room => (
            <div
              key={room.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#3b82f6', margin: '0 0 8px 0', fontSize: '1.3rem' }}>
                    {room.isPrivate ? '🔒' : '🌐'} {room.name}
                  </h3>
                  {room.description && (
                    <p style={{ color: '#d1d5db', margin: '0 0 12px 0', fontSize: '0.9rem' }}>
                      {room.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#9ca3af' }}>
                    <span>👥 {room.members.length} members</span>
                    <span>📊 {room.predictions.length} predictions</span>
                    <span>Created by {room.creatorName}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Invite Code</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {room.inviteCode}
                    </div>
                  </div>
                </div>
              </div>

              {selectedRoom?.id === room.id && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h4 style={{ color: '#fff', margin: 0 }}>Members ({room.members.length})</h4>
                    {room.createdBy !== currentUser?.id && (
                      <button
                        onClick={() => leaveRoom(room.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Leave Room
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                    {room.members.map(member => (
                      <div
                        key={member.userId}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '12px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ color: '#fff', fontWeight: '600' }}>
                            {member.username}
                            {member.role === 'owner' && <span style={{ color: '#ffd700', marginLeft: '8px' }}>👑</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                            {member.stats.predictions} predictions • {member.stats.correct} correct
                          </div>
                        </div>
                        <div style={{ color: '#22c55e', fontWeight: '600' }}>
                          π{member.stats.piEarned}
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ color: '#fff', marginBottom: '16px' }}>Recent Predictions</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {room.predictions.slice(0, 5).map(pred => (
                      <div
                        key={pred.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '12px',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#fff', fontWeight: '600' }}>{pred.username}</span>
                          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                            {new Date(pred.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '6px' }}>
                          {pred.matchName}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#3b82f6' }}>{pred.prediction}</span>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#f59e0b' }}>{pred.confidence}% confidence</span>
                            {pred.piStake > 0 && (
                              <span style={{ color: '#22c55e' }}>π{pred.piStake}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PredictionRooms;
