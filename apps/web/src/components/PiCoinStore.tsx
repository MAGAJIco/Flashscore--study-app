
'use client';

import React, { useState } from 'react';
import { usePiCoin } from '../hooks/usePiCoin';

interface PiCoinStoreProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPurchaseComplete?: () => void;
}

interface CoinPackage {
  id: number;
  amount: number;
  price: number;
  bonus: number;
  popular: boolean;
}

declare global {
  interface Window {
    Pi?: any;
  }
}

export const PiCoinStore: React.FC<PiCoinStoreProps> = ({ isOpen, onClose, userId, onPurchaseComplete }) => {
  const { purchaseCoins, wallet } = usePiCoin(userId);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pi_network' | 'credit_card'>('pi_network');
  const [isProcessing, setIsProcessing] = useState(false);

  const packages: CoinPackage[] = [
    { id: 1, amount: 1000, price: 5.0, bonus: 0, popular: false },
    { id: 2, amount: 2500, price: 10.0, bonus: 500, popular: true },
    { id: 3, amount: 5500, price: 20.0, bonus: 1500, popular: false },
    { id: 4, amount: 12000, price: 40.0, bonus: 4000, popular: false },
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    const pkg = packages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    setIsProcessing(true);
    
    try {
      const totalCoins = pkg.amount + pkg.bonus;

      if (paymentMethod === 'pi_network') {
        if (typeof window !== 'undefined' && window.Pi) {
          try {
            const payment = await window.Pi.createPayment({
              amount: pkg.price * 0.1,
              memo: `Purchase ${totalCoins} Pi Coins`,
              metadata: { 
                packageId: pkg.id,
                piCoins: totalCoins,
                userId 
              }
            });

            const paymentId = payment.identifier;
            const success = await purchaseCoins(totalCoins, 'pi_network', paymentId, { packageId: pkg.id });

            if (success) {
              alert(`Successfully purchased ${totalCoins} Pi Coins!`);
              onPurchaseComplete?.();
              onClose();
            } else {
              alert('Purchase failed. Please try again.');
            }
          } catch (error) {
            console.error('Pi Network payment error:', error);
            alert('Pi Network payment failed');
          }
        } else {
          alert('Pi Network SDK not available');
        }
      } else {
        // Credit card payment would go here (Stripe integration)
        const success = await purchaseCoins(totalCoins, 'credit_card', undefined, { packageId: pkg.id });
        
        if (success) {
          alert(`Successfully purchased ${totalCoins} Pi Coins!`);
          onPurchaseComplete?.();
          onClose();
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed');
    } finally {
      setIsProcessing(false);
    }
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
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#ffd700' }}>🪙 Pi Coin Store</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Current Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd700' }}>
            {wallet?.balance || 0} Pi Coins
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#ffd700' }}>Payment Method</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPaymentMethod('pi_network')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: paymentMethod === 'pi_network' ? '2px solid #ffd700' : '2px solid transparent',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Pi Network
            </button>
            <button
              onClick={() => setPaymentMethod('credit_card')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: paymentMethod === 'credit_card' ? '2px solid #ffd700' : '2px solid transparent',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Credit Card
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', color: '#ffd700' }}>Select Package</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {packages.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedPackage === pkg.id ? '2px solid #ffd700' : '2px solid rgba(255, 255, 255, 0.1)',
                  background: pkg.popular ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    background: '#ffd700',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {pkg.amount + pkg.bonus} Pi Coins
                    </div>
                    {pkg.bonus > 0 && (
                      <div style={{ fontSize: '0.85rem', color: '#4ade80' }}>
                        +{pkg.bonus} bonus coins
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ffd700' }}>
                    ${pkg.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#ffd700' }}>💡 Exchange Rates</h4>
          <div style={{ fontSize: '0.9rem', color: '#d1fae5' }}>
            • 200 Pi Coins = 1 Real Pi (User exchange)<br/>
            • Minimum exchange: 1,000 Pi Coins<br/>
            • Support creators and earn more through quizzes!
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={!selectedPackage || isProcessing}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: selectedPackage ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: selectedPackage ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          {isProcessing ? 'Processing...' : 
           selectedPackage ? `Purchase with ${paymentMethod === 'pi_network' ? 'Pi Network' : 'Credit Card'}` : 
           'Select a package'}
        </button>
      </div>
    </div>
  );
};
