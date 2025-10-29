
'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 ${
        hover ? 'transition-all hover:bg-white/10 hover:border-cyan-400/50' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border-b border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border-t border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
};
