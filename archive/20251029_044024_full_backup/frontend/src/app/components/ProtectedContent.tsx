'use client';

import { type ReactNode, useState, useEffect } from 'react';

interface ProtectedContentProps {
  children: ReactNode;
  requireAge?: number;
}

export const ProtectedContent = ({ children, requireAge = 18 }: ProtectedContentProps) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check age verification only on client side
    const checkAge = () => {
      try {
        const stored = localStorage.getItem('user_age');
        if (!stored) {
          setIsAllowed(false);
          setIsLoading(false);
          return;
        }
        const age = parseInt(stored, 10);
        setIsAllowed(!isNaN(age) && age >= requireAge);
      } catch (error) {
        console.error('Error checking age:', error);
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAge();
  }, [requireAge]);

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔞</div>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">Restricted Content</h3>
            <p className="text-sm text-yellow-800 mb-4">
              This content is age restricted. You must be {requireAge} or older to access it.
            </p>
            <button
              onClick={() => {
                const age = prompt('Please enter your age:');
                if (age) {
                  const ageNum = parseInt(age, 10);
                  if (!isNaN(ageNum)) {
                    localStorage.setItem('user_age', age);
                    setIsAllowed(ageNum >= requireAge);
                  }
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Verify Age
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};