
"use client";

import React, { useState } from 'react';

interface PrivacyPolicyProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  onAccept,
  onDecline,
  showActions = false
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'collection', title: 'Data Collection', icon: '📊' },
    { id: 'usage', title: 'Data Usage', icon: '🔄' },
    { id: 'sharing', title: 'Data Sharing', icon: '🔗' },
    { id: 'security', title: 'Security', icon: '🔒' },
    { id: 'rights', title: 'Your Rights', icon: '⚖️' },
    { id: 'contact', title: 'Contact', icon: '📧' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Privacy Overview</h3>
            <p className="text-gray-300">
              Sports Central is committed to protecting your privacy. This policy explains how we collect, 
              use, and protect your personal information when you use our sports prediction and community platform.
            </p>
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">Key Points:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>We only collect data necessary to provide our services</li>
                <li>Your personal data is never sold to third parties</li>
                <li>You have full control over your data and privacy settings</li>
                <li>All data is encrypted and stored securely</li>
              </ul>
            </div>
          </div>
        );
      
      case 'collection':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Data We Collect</h3>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Account Information</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Username and email address</li>
                  <li>Profile preferences and settings</li>
                  <li>Account creation and last login dates</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Activity Data</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Sports predictions and quiz responses</li>
                  <li>Community interactions (votes, comments)</li>
                  <li>Performance metrics and achievements</li>
                  <li>Pi coin transactions and wallet activity</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Technical Data</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Device type and operating system</li>
                  <li>App version and performance metrics</li>
                  <li>Network connection information</li>
                  <li>Error logs and crash reports</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">How We Use Your Data</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-xl">✅</div>
                <div>
                  <h4 className="font-semibold text-white">Service Provision</h4>
                  <p className="text-gray-300">Provide sports predictions, manage your account, and enable community features</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">📊</div>
                <div>
                  <h4 className="font-semibold text-white">Personalization</h4>
                  <p className="text-gray-300">Customize content based on your interests and improve user experience</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-purple-500 text-xl">🔧</div>
                <div>
                  <h4 className="font-semibold text-white">Service Improvement</h4>
                  <p className="text-gray-300">Analyze usage patterns to enhance features and fix issues</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-yellow-500 text-xl">🛡️</div>
                <div>
                  <h4 className="font-semibold text-white">Security & Compliance</h4>
                  <p className="text-gray-300">Detect fraud, prevent abuse, and comply with legal obligations</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sharing':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Data Sharing Policy</h3>
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-400 mb-2">❌ We Never Share:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Personal information for marketing purposes</li>
                <li>Individual user data to third parties</li>
                <li>Your private messages or personal content</li>
              </ul>
            </div>
            
            <div className="bg-yellow-600/20 border border-yellow-400/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Limited Sharing:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Aggregated, anonymized statistics for research</li>
                <li>Legal compliance when required by law</li>
                <li>Service providers under strict confidentiality agreements</li>
              </ul>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Security Measures</h3>
            <div className="grid gap-4">
              <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">🔐 Encryption</h4>
                <p className="text-gray-300">All data is encrypted in transit and at rest using industry-standard protocols</p>
              </div>
              
              <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">🛡️ Access Controls</h4>
                <p className="text-gray-300">Strict access controls and authentication for all system administrators</p>
              </div>
              
              <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">🔄 Regular Audits</h4>
                <p className="text-gray-300">Regular security audits and penetration testing to identify vulnerabilities</p>
              </div>
              
              <div className="bg-orange-600/20 border border-orange-400/30 rounded-lg p-4">
                <h4 className="font-semibold text-orange-400 mb-2">📱 Device Security</h4>
                <p className="text-gray-300">Secure authentication and optional biometric login for mobile devices</p>
              </div>
            </div>
          </div>
        );

      case 'rights':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Your Rights</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">📋 Access Your Data</h4>
                <p className="text-gray-300">Request a copy of all personal data we have about you</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">✏️ Correct Your Data</h4>
                <p className="text-gray-300">Update or correct any inaccurate personal information</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">🗑️ Delete Your Data</h4>
                <p className="text-gray-300">Request deletion of your account and associated data</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">📤 Export Your Data</h4>
                <p className="text-gray-300">Download your data in a portable format</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">🚫 Object to Processing</h4>
                <p className="text-gray-300">Opt out of certain data processing activities</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-400 mb-4">Privacy Questions or Concerns?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-300">privacy@sportscentral.app</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-gray-300">
                      Sports Central Privacy Office<br />
                      123 Digital Avenue<br />
                      Tech City, TC 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-gray-300">We respond to privacy requests within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                <br />
                <strong>Effective Date:</strong> January 1, 2024
                <br />
                We will notify users of any material changes to this privacy policy.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700">
            <button
              onClick={onDecline}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { PrivacyPolicy };
