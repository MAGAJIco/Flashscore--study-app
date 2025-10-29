import React from 'react';

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="glass-card p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly, such as account details, preferences, and usage data to improve your experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>Your information helps us provide personalized predictions, improve our services, and communicate important updates.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. Children's Privacy (COPPA)</h2>
              <p>We take children's privacy seriously. Users under 13 are automatically placed in Kids Mode with restricted features and no gambling content. Parental consent is required for additional data collection.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Parents can review and manage their children's data at any time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Contact Us</h2>
              <p>For privacy concerns or questions, contact us at privacy@sportscentral.com</p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-sm text-gray-400">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                <br />
                <strong>Effective Date:</strong> January 1, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}