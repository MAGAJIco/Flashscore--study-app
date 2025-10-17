
"use client";
import React, { useState } from 'react';

interface TradablePrediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  originalPrice: number;
  currentPrice: number;
  seller: string;
  hasInsurance: boolean;
  insuranceCost: number;
}

export default function PredictionMarketplace() {
  const [listings, setListings] = useState<TradablePrediction[]>([
    {
      id: '1',
      match: 'Man City vs Arsenal',
      prediction: 'Man City Win',
      confidence: 92,
      originalPrice: 50,
      currentPrice: 75,
      seller: 'ProPredictor',
      hasInsurance: true,
      insuranceCost: 5
    },
    {
      id: '2',
      match: 'Lakers vs Warriors',
      prediction: 'Lakers Win',
      confidence: 78,
      originalPrice: 30,
      currentPrice: 40,
      seller: 'SportsSage',
      hasInsurance: false,
      insuranceCost: 3
    }
  ]);

  const buyPrediction = (prediction: TradablePrediction, withInsurance: boolean) => {
    const totalCost = withInsurance ? prediction.currentPrice + prediction.insuranceCost : prediction.currentPrice;
    alert(`Purchased ${prediction.match} prediction for π${totalCost}${withInsurance ? ' (with insurance)' : ''}`);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(236, 72, 153, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #ec4899, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        💱 Prediction Marketplace
      </h2>

      <div style={{ display: 'grid', gap: '16px' }}>
        {listings.map(listing => (
          <div key={listing.id} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#fff', marginBottom: '4px' }}>{listing.match}</h3>
                <div style={{ color: '#ec4899', fontWeight: 'bold', marginBottom: '8px' }}>
                  📊 {listing.prediction}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  By {listing.seller} • {listing.confidence}% confidence
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  π{listing.currentPrice}
                </div>
                {listing.currentPrice > listing.originalPrice && (
                  <div style={{ color: '#10b981', fontSize: '0.8rem' }}>
                    ↑ +{((listing.currentPrice - listing.originalPrice) / listing.originalPrice * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => buyPrediction(listing, false)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Buy Now
              </button>
              
              {listing.hasInsurance && (
                <button
                  onClick={() => buyPrediction(listing, true)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🛡️ Buy + Insurance (+π{listing.insuranceCost})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>💡 How It Works</h4>
        <ul style={{ color: '#d1d5db', fontSize: '0.9rem', margin: 0, paddingLeft: '20px' }}>
          <li>Buy high-confidence predictions from expert predictors</li>
          <li>Add insurance to protect against losses (50% refund if wrong)</li>
          <li>Sell your own predictions when confidence is high</li>
          <li>Bundle multiple predictions for package deals</li>
        </ul>
      </div>
    </div>
  );
}
