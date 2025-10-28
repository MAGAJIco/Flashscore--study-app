"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Portal is now Empire - redirect to empire
    router.replace('/empire');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl text-white">Redirecting to Empire...</p>
      </div>
    </div>
  );
}