"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export function Welcome() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/en');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Sports Central</h1>
        <p className="text-white/90">Redirecting...</p>
      </div>
    </div>
  );
}
