
'use client';

import { useState, useEffect } from 'react';
import { useKidsModeContext } from '@/app/context/KidsModeContext';
import { Users, Lock, Check } from 'lucide-react';
import { haptic } from './HapticFeedback';

interface SharePlaySession {
  id: string;
  participants: string[];
  matchId: string;
  isActive: boolean;
}

export function SharePlayIntegration({ matchId }: { matchId: string }) {
  const { kidsMode } = useKidsModeContext();
  const [session, setSession] = useState<SharePlaySession | null>(null);
  const [parentalApproved, setParentalApproved] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const requestParentalApproval = async () => {
    // In production, this would send a request to parent's device
    setShowApprovalDialog(true);
    haptic.notification();
  };

  const startSharePlay = async () => {
    if (kidsMode && !parentalApproved) {
      requestParentalApproval();
      return;
    }

    try {
      // Initialize SharePlay session
      if (window.webkit?.messageHandlers?.sharePlay) {
        window.webkit.messageHandlers.sharePlay.postMessage({
          type: 'start',
          matchId,
          restrictions: kidsMode ? {
            maxParticipants: 5,
            requireParentalApproval: true,
            allowedContacts: 'family'
          } : {}
        });
      }

      haptic.success();
    } catch (error) {
      console.error('SharePlay error:', error);
      haptic.error();
    }
  };

  return (
    <>
      <button
        onClick={startSharePlay}
        className="shareplay-button"
        disabled={kidsMode && !parentalApproved}
      >
        <Users className="w-5 h-5" />
        <span>Watch Together</span>
        {kidsMode && !parentalApproved && <Lock className="w-4 h-4" />}
      </button>

      {showApprovalDialog && (
        <div className="approval-dialog-overlay">
          <div className="approval-dialog">
            <div className="dialog-icon">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h3>Parental Approval Required</h3>
            <p>A request has been sent to your parent or guardian to approve this SharePlay session.</p>
            
            {/* Demo: Auto-approve after 3 seconds for testing */}
            <div className="approval-status">
              <div className="spinner" />
              <span>Waiting for approval...</span>
            </div>

            <button 
              className="cancel-button"
              onClick={() => setShowApprovalDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .shareplay-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--ios-blue), var(--ios-blue-dark));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shareplay-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .shareplay-button:not(:disabled):active {
          transform: scale(0.95);
        }

        .approval-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        .approval-dialog {
          background: var(--ios-secondary-background);
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          text-align: center;
          animation: slideUp 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .dialog-icon {
          width: 64px;
          height: 64px;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .approval-dialog h3 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }

        .approval-dialog p {
          font-size: 15px;
          color: rgba(235, 235, 245, 0.6);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .approval-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--ios-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .cancel-button {
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
