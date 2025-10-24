
"use client";

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using Sports Central, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">2. Use License</h2>
            <div className="text-gray-300 space-y-2">
              <p>Permission is granted to temporarily download one copy of Sports Central for personal, non-commercial transitory viewing only.</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>Under this license you may not modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained in Sports Central</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">3. Pi Coin System</h2>
            <div className="text-gray-300 space-y-2">
              <p>Pi Coins are virtual tokens used within Sports Central:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Pi Coins have no real-world monetary value</li>
                <li>They cannot be exchanged for cash or other currencies</li>
                <li>Used solely for in-app features and gamification</li>
                <li>We reserve the right to modify the Pi Coin system</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">4. Responsible Betting</h2>
            <div className="text-gray-300 space-y-2">
              <p>Sports Central promotes responsible sports prediction:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Predictions are for entertainment purposes only</li>
                <li>Do not bet more than you can afford to lose</li>
                <li>Seek help if you have gambling problems</li>
                <li>Users must be 18+ to participate in prediction features</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">5. User Content</h2>
            <p className="text-gray-300">
              Users are responsible for all content they post. We reserve the right to remove 
              any content that violates our community guidelines or these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">6. Disclaimer</h2>
            <p className="text-gray-300">
              The materials on Sports Central are provided on an 'as is' basis. Sports Central 
              makes no warranties, expressed or implied, and hereby disclaims and negates all 
              other warranties including without limitation, implied warranties or conditions 
              of merchantability, fitness for a particular purpose, or non-infringement of 
              intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">7. Contact Information</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300">
                <strong>Email:</strong> legal@sportscentral.app<br />
                <strong>Address:</strong> Sports Central Legal Department<br />
                123 Digital Avenue, Tech City, TC 12345
              </p>
            </div>
          </section>

          <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 mt-8">
            <p className="text-blue-300 text-sm">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br />
              <strong>Effective Date:</strong> January 1, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
