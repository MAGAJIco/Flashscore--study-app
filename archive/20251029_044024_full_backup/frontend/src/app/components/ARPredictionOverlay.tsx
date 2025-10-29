
"use client";
import React, { useState, useEffect, useRef } from 'react';

interface LiveStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
}

interface ARPredictionOverlayProps {
  isActive?: boolean;
}

const ARPredictionOverlay: React.FC<ARPredictionOverlayProps> = ({ isActive = false }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [predictions, setPredictions] = useState({
    nextGoal: { team: 'Home', probability: 67, timeWindow: '10 mins' },
    finalScore: '2-1',
    confidence: 78
  });
  const [liveStats, setLiveStats] = useState<LiveStats>({
    possession: 58,
    shots: 12,
    shotsOnTarget: 5,
    corners: 6,
    fouls: 8
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Please enable camera access for AR features');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        possession: Math.min(100, prev.possession + Math.floor(Math.random() * 5) - 2),
        shots: prev.shots + (Math.random() > 0.8 ? 1 : 0),
        shotsOnTarget: prev.shotsOnTarget + (Math.random() > 0.9 ? 1 : 0),
        corners: prev.corners + (Math.random() > 0.85 ? 1 : 0),
        fouls: prev.fouls + (Math.random() > 0.87 ? 1 : 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
        📱 AR Prediction Overlay
      </h2>

      {/* Camera View */}
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '20px',
        background: '#000',
        minHeight: '300px'
      }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            {/* AR Overlays */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              pointerEvents: 'none'
            }}>
              {/* Live Score Overlay */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '2px solid rgba(59, 130, 246, 0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.2rem' }}>
                    MAN UTD 1 - 1 LIV
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '0.9rem' }}>67'</div>
                </div>
              </div>

              {/* Next Goal Prediction */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.9)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '2px solid #22c55e'
              }}>
                <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
                  🎯 Next Goal Prediction
                </div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                  {predictions.nextGoal.team} - {predictions.nextGoal.probability}%
                </div>
                <div style={{ color: '#d1fae5', fontSize: '0.8rem' }}>
                  Within {predictions.nextGoal.timeWindow}
                </div>
              </div>

              {/* Live Stats Overlay */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Possession</div>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{liveStats.possession}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Shots</div>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{liveStats.shots}/{liveStats.shotsOnTarget}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Corners</div>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{liveStats.corners}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '0.8rem' }}>Fouls</div>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{liveStats.fouls}</div>
                </div>
              </div>
            </div>

            {/* Final Score Prediction (Bottom) */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(147, 51, 234, 0.9)',
              borderRadius: '12px',
              padding: '16px',
              border: '2px solid #9333ea',
              pointerEvents: 'none'
            }}>
              <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
                AI Predicted Final Score
              </div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.5rem' }}>
                {predictions.finalScore}
              </div>
              <div style={{ color: '#e9d5ff', fontSize: '0.8rem' }}>
                {predictions.confidence}% confidence
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📱</div>
            <div style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '12px' }}>
              Point Your Camera at TV
            </div>
            <div style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Enable AR to see live prediction overlays on your match
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {!cameraActive ? (
          <button
            onClick={startCamera}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            📷 Enable AR Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ⏹️ Stop Camera
          </button>
        )}
      </div>

      {/* Feature List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '12px' }}>AR Features</h3>
        <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '20px' }}>
          <li>Real-time prediction overlays</li>
          <li>Live match statistics</li>
          <li>Next goal probability</li>
          <li>Final score predictions</li>
          <li>Interactive data visualization</li>
        </ul>
      </div>
    </div>
  );
};

export { ARPredictionOverlay };
