
"use client";

import React, { useState } from 'react';

interface ConsentRecord {
  childEmail: string;
  childAge: number;
  parentEmail: string;
  consentStatus: string;
  verificationMethod?: string;
  verifiedAt?: string;
  revokedAt?: string;
  auditTrail: any[];
}

export const ParentalConsentManager: React.FC = () => {
  const [childEmail, setChildEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportConsent = async () => {
    if (!childEmail || !parentEmail) {
      setMessage('Please enter both child and parent email addresses');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/coppa/export-consent/${encodeURIComponent(childEmail)}?parentEmail=${encodeURIComponent(parentEmail)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to export consent record');
      }

      const data = await response.json();
      setConsentRecord(data);
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consent-record-${childEmail}-${Date.now()}.json`;
      a.click();
      
      setMessage('Consent record exported successfully');
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async () => {
    if (!childEmail || !parentEmail) {
      setMessage('Please enter both child and parent email addresses');
      return;
    }

    if (!confirm('Are you sure you want to revoke parental consent? This will restrict the account.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/coppa/revoke-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childEmail,
          parentEmail,
          reason: 'Parent-initiated revocation'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Consent revoked successfully. Account access has been restricted.');
        setConsentRecord(null);
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Parental Consent Management</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Manage your child's account consent and export records for COPPA compliance.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Child's Email:
          <input
            type="email"
            value={childEmail}
            onChange={(e) => setChildEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="child@example.com"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Parent's Email:
          <input
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="parent@example.com"
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleExportConsent}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Export Consent Record'}
        </button>

        <button
          onClick={handleRevokeConsent}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Revoke Consent'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          background: message.includes('Error') ? '#fee' : '#efe',
          color: message.includes('Error') ? '#c00' : '#080',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      {consentRecord && (
        <div style={{
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <h3>Consent Record Summary</h3>
          <p><strong>Status:</strong> {consentRecord.consentStatus}</p>
          <p><strong>Verification Method:</strong> {consentRecord.verificationMethod || 'N/A'}</p>
          <p><strong>Verified At:</strong> {consentRecord.verifiedAt ? new Date(consentRecord.verifiedAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Audit Trail Entries:</strong> {consentRecord.auditTrail?.length || 0}</p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#e0e7ff', borderRadius: '4px' }}>
        <h4>Your Rights (COPPA Compliance)</h4>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>✓ Export your child's consent records at any time</li>
          <li>✓ Revoke consent and restrict account access</li>
          <li>✓ Request deletion of personal information</li>
          <li>✓ Review verification audit trail</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          For questions, contact: teamdarlingangel@gmail.com
        </p>
      </div>
    </div>
  );
};
