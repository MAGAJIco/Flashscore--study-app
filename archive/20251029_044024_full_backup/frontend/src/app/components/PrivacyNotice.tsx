
"use client";

import React, { useState, useEffect } from 'react';
import { PrivacyPolicy } from './PrivacyPolicy';

export const PrivacyNotice: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  useEffect(() => {
    const hasAcceptedPrivacy = localStorage.getItem('privacy-accepted');
    if (!hasAcceptedPrivacy) {
      setShowNotice(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy-accepted', 'true');
    localStorage.setItem('privacy-accepted-date', new Date().toISOString());
    setShowNotice(false);
    setShowFullPolicy(false);
  };

  const handleDecline = () => {
    // Redirect to external site or show alternative
    alert('You must accept our Privacy Policy to use Sports Central.');
  };

  const handleReadMore = () => {
    setShowFullPolicy(true);
  };

  if (!showNotice) return null;

  if (showFullPolicy) {
    return (
      <PrivacyPolicy
        onAccept={handleAccept}
        onDecline={() => setShowFullPolicy(false)}
        showActions={true}
      />
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">🍪 Privacy & Cookies</h3>
            <p className="text-gray-300 text-sm">
              We use cookies and collect data to provide personalized sports predictions, 
              community features, and improve your experience. Your privacy is important to us.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReadMore}
              className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Read Privacy Policy
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrivacyNotice };
