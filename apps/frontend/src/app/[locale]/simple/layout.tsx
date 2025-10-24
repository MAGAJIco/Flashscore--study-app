import React from 'react';
import SimpleHeader from './components/SimpleHeader';
import SimpleFooter from './components/SimpleFooter';
import '@styles/globals.css';

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <SimpleHeader />
      {children}
      <SimpleFooter />
    </div>
  );
}