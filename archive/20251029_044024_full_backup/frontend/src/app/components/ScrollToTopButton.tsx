
"use client";

import React, { useState, useEffect } from 'react';
import { useMobile } from '@/app/hooks/useMobile';

interface ScrollToTopButtonProps {
  showAfterScroll?: number;
  bottomOffset?: string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  showAfterScroll = 300,
  bottomOffset
}) => {
  const isMobile = useMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterScroll) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [showAfterScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: bottomOffset || (isMobile ? '80px' : '24px'),
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
        border: 'none',
        color: '#000',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        animation: 'fadeInUp 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 255, 136, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.4)';
      }}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      ⬆️
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
};

export default ScrollToTopButton;
