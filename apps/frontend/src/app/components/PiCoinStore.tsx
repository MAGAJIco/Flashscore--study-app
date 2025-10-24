"use client";
import React, { useState } from 'react';
import { piCoinManagerInstance } from '@magajico/shared/utils';

interface PiCoinStoreProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onPurchaseComplete: () => void;
}

const PiCoinStore: React.FC<PiCoinStoreProps> = ({ isOpen, onClose, userId, onPurchaseComplete }) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pi_network' | 'credit_card'>('pi_network');
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = [
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
      let paymentResult;

      if (paymentMethod === 'pi_network') {
        // Handle Pi Network payment
        if (typeof window !== 'undefined' && (window as any).Pi) {
          try {
            const piPayment = await (window as any).Pi.createPayment({
              amount: pkg.price * 0.1, // Convert to Pi
              memo: `Purchase ${pkg.amount + pkg.bonus} Pi Coins`,
              metadata: { 
                packageId: pkg.id,
                piCoins: pkg.amount + pkg.bonus,
                userId 
              }
            });

            // Simulate successful Pi payment
            paymentResult = { success: true, transactionId: piPayment.identifier };
          } catch (piError) {
            console.error('Pi Network payment failed:', piError);
            paymentResult = { success: false, error: 'Pi Network payment failed' };
          }
        } else {
          // Fallback for development
          paymentResult = { 
            success: true, 
            transactionId: `pi_dev_${Date.now()}`,
            simulated: true 
          };
        }
      } else {
        // Handle credit card payment via Stripe
        try {
          // Create payment intent
          const intentResponse = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: pkg.price,
              currency: 'USD',
              description: `Purchase ${pkg.amount + pkg.bonus} Pi Coins`
            })
          });

          const { client_secret, error: intentError } = await intentResponse.json();

          if (intentError) {
            throw new Error(intentError);
          }

          // In a real implementation, you would use Stripe Elements here
          // For now, simulate successful payment
          const confirmResponse = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: `stripe_${Date.now()}`,
              provider: 'stripe',
              amount: pkg.price,
              currency: 'USD',
              userId,
              description: `Purchase ${pkg.amount + pkg.bonus} Pi Coins`
            })
          });

          const confirmData = await confirmResponse.json();
          paymentResult = confirmData;

        } catch (stripeError) {
          console.error('Stripe payment failed:', stripeError);
          paymentResult = { 
            success: false, 
            error: stripeError instanceof Error ? stripeError.message : 'Payment failed' 
          };
        }
      }

      if (paymentResult.success) {
        // Award Pi Coins to user
        const totalAmount = pkg.amount + pkg.bonus;
        const success = piCoinManagerInstance.earnCoins(
          userId, 
          totalAmount, 
          `Purchased ${totalAmount.toLocaleString()} Pi Coins`,
          {
            transactionId: paymentResult.transactionId,
            paymentMethod,
            packageId: pkg.id,
            purchasePrice: pkg.price
          }
        );
        
        if (success) {
          alert(`Successfully purchased ${totalAmount.toLocaleString()} Pi coins!`);
          onPurchaseComplete();
          onClose();
        } else {
          alert('Failed to award Pi coins. Please contact support.');
        }
      } else {
        alert(`Purchase failed: ${paymentResult.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
    
    setIsProcessing(false);
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
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '600px',
        width: '90%',
        color: '#fff',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #ffd700, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Buy Pi Coins
          </h2>
          <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>Payment Method</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPaymentMethod('pi_network')}
              style={{
                padding: '12px 20px',
                background: paymentMethod === 'pi_network' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              π Pi Network
            </button>
            <button
              onClick={() => setPaymentMethod('credit_card')}
              style={{
                padding: '12px 20px',
                background: paymentMethod === 'credit_card' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              💳 Credit Card
            </button>
          </div>
        </div>

        {/* Packages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              style={{
                background: selectedPackage === pkg.id ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2))' : 'rgba(255, 255, 255, 0.05)',
                border: selectedPackage === pkg.id ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              {pkg.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>π</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700', marginBottom: '4px' }}>
                  {(pkg.amount + pkg.bonus).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#d1fae5', marginBottom: '12px' }}>
                  {pkg.amount.toLocaleString()} + {pkg.bonus.toLocaleString()} bonus
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  ${pkg.price.toFixed(2)}
                </div>
                {paymentMethod === 'pi_network' && (
                  <div style={{ fontSize: '0.8rem', color: '#d1fae5', marginTop: '4px' }}>
                    ≈ {(pkg.price * 0.1).toFixed(1)} Pi
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Info */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#ffd700' }}>💡 Exchange Rates</h4>
          <div style={{ fontSize: '0.9rem', color: '#d1fae5' }}>
            • 200 Pi Coins = 1 Real Pi (User exchange)<br/>
            • Minimum exchange: 1,000 Pi Coins<br/>
            • Support creators and earn more through quizzes!
          </div>
        </div>

        {/* Purchase Button */}
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

export default PiCoinStore;
