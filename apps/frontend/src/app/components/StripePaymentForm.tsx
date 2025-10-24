"use client";

import React, { useState } from 'react';

interface StripePaymentFormProps {
  accessToken: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  accessToken,
  onSuccess,
  onError,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const amountNum = parseFloat(amount);

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const intentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: amountNum,
          currency: 'USD',
          description: description || 'Payment',
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      console.log('Payment Intent Created:', intentData.paymentIntentId);
      console.log('Client Secret (use with Stripe.js):', intentData.clientSecret);

      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmData.error || 'Failed to confirm payment');
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess(confirmData.payment?.id || intentData.paymentIntentId);
      }

      setAmount('');
      setDescription('');
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '24px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
    }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: '600' }}>
        💳 Make a Payment
      </h2>

      <div style={{
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #f59e0b',
        marginBottom: '16px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', fontWeight: '600' }}>
          ⚠️ DEMO MODE
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#92400e' }}>
          This component creates payment intents but does not collect card details.
          Integrate Stripe Elements for production use.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '0.95rem',
          }}>
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '0.95rem',
          }}>
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this payment for?"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            borderLeft: '4px solid #ef4444',
            marginBottom: '16px',
            borderRadius: '4px',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#991b1b' }}>
              ❌ {error}
            </p>
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: '#d1fae5',
            borderLeft: '4px solid #10b981',
            marginBottom: '16px',
            borderRadius: '4px',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#065f46' }}>
              ✅ Payment successful!
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !amount}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading || !amount ? '#9ca3af' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading || !amount ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? 'Processing...' : `Pay $${amount || '0.00'}`}
        </button>
      </form>
    </div>
  );
};
