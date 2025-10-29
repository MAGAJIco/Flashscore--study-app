
"use client";

import React from 'react';
import SignUpForm from './SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Join Sports Hub
          </h1>
          <p className="text-slate-400">
            Create your account and start predicting
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <SignUpForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
            Terms
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
