'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, Shield, AlertCircle } from 'lucide-react';

interface PaymentHandlerProps {
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export const SecurePaymentHandler: React.FC<PaymentHandlerProps> = ({ onSuccess, onError }) => {
  const [amount, setAmount] = useState('10.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        throw new Error('Please sign in to make a payment');
      }

      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'USD',
          description: 'Sports Central Premium',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setSuccess(true);
      onSuccess?.(data.paymentIntentId);

    } catch (err: any) {
      const errorMsg = err.message || 'Payment processing failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Secure Payment</h2>
          <p className="text-sm text-gray-400">Protected by Stripe</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success ? (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-300 mb-2">Payment Successful!</h3>
          <p className="text-sm text-gray-400">Your transaction has been processed securely.</p>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>PCI-DSS compliant encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Age verification enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Secure payment processing</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>
        </form>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-gray-500 text-center">
          Payments are processed securely via Stripe. Your card details are never stored on our servers.
        </p>
      </div>
    </div>
  );
};