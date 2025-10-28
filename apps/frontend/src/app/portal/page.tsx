
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect old /portal route to new Empire Central
    router.push('/en');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">👑 Redirecting to Empire Central...</h1>
        <p>The Portal has evolved into the MagajiCo Empire</p>
      </div>
    </div>
  );
}
