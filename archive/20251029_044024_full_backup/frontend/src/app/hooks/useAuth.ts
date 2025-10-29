
"use client";
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = useMemo(() => {
    if (!session?.user) return null;
    
    const sessionUser = session.user as any;
    
    return {
      id: sessionUser.id || sessionUser.email || '',
      name: sessionUser.name,
      email: sessionUser.email,
      image: sessionUser.image,
      provider: sessionUser.provider
    };
  }, [session]);

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated'
  };
}
