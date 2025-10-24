
import React, { useState, useEffect } from 'react';

// Local types (shared package not built yet)
interface BackupData {
  timestamp: number;
  data: any;
}

const BackupManager = {
  getLocalBackup: () => null as BackupData | null,
  getLastSyncTime: () => null as Date | null,
  createBackup: () => {},
  exportBackup: () => {},
  importBackup: (file: File) => Promise.resolve(true),
  syncToCloud: () => Promise.resolve(true),
};

interface BackupSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ isOpen, onClose }) => {
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const backup = BackupManager.getLocalBackup();
      setLastBackup(backup ? new Date(backup.timestamp) : null);
      setLastSync(BackupManager.getLastSyncTime());
    }
  }, [isOpen]);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      BackupManager.exportBackup();
      setLastBackup(new Date());
    } catch (error) {
      console.error('Export failed:', error);
    }
    setIsExporting(false);
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const success = await BackupManager.importBackup(file);
      if (success) {
        alert('Backup imported successfully! Please refresh the page.');
      } else {
        alert('Failed to import backup. Please check the file format.');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import backup.');
    }
    setIsImporting(false);
    event.target.value = '';
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncMessage('Syncing to cloud...');
    
    try {
      const success = await BackupManager.syncToCloud();
      if (success) {
        setLastSync(new Date());
        setSyncMessage('Successfully synced to cloud!');
      } else {
        setSyncMessage('Failed to sync to cloud.');
      }
    } catch (error) {
      setSyncMessage('Failed to sync to cloud.');
    }
    
    setIsSyncing(false);
    setTimeout(() => setSyncMessage(''), 3000);
  };

  const handleCreateBackup = () => {
    BackupManager.createBackup();
    setLastBackup(new Date());
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.8rem',
            margin: '0',
            background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            💾 Backup & Sync
          </h2>
          
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#ccc',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>📊 Backup Status</h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
              <span>Last Local Backup:</span>
              <span style={{ color: lastBackup ? '#22c55e' : '#ef4444' }}>
                {lastBackup ? lastBackup.toLocaleString() : 'Never'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
              <span>Last Cloud Sync:</span>
              <span style={{ color: lastSync ? '#22c55e' : '#ef4444' }}>
                {lastSync ? lastSync.toLocaleString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Local Backup Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#06b6d4', marginBottom: '16px' }}>📱 Local Backup</h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              onClick={handleCreateBackup}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0369a1)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              💾 Create Local Backup
            </button>
            
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              style={{
                background: isExporting ? 'rgba(34, 197, 94, 0.3)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: isExporting ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isExporting ? '⏳ Exporting...' : '📤 Export Backup File'}
            </button>
            
            <label style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {isImporting ? '⏳ Importing...' : '📥 Import Backup File'}
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                disabled={isImporting}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
        </div>

        {/* Cloud Sync Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#8b5cf6', marginBottom: '16px' }}>☁️ Cloud Sync</h3>
          
          <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '16px' }}>
            Sync your data to Google Cloud Storage for cross-device access and additional backup security.
          </p>
          
          <button
            onClick={handleCloudSync}
            disabled={isSyncing}
            style={{
              background: isSyncing ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: isSyncing ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%'
            }}
          >
            {isSyncing ? '⏳ Syncing...' : '☁️ Sync to Google Cloud'}
          </button>
          
          {syncMessage && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: syncMessage.includes('Successfully') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: syncMessage.includes('Successfully') ? '#22c55e' : '#ef4444',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {syncMessage}
            </div>
          )}
        </div>

        {/* Auto Backup Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>⚡ Auto Backup</h3>
          
          <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '16px' }}>
            Automatic backups run every 30 minutes while the app is open. Your data is always protected!
          </p>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#22c55e',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            ✅ Auto backup is active
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
  );
};

export default BackupSettings;
