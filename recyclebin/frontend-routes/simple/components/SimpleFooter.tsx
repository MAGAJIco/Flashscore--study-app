
import React from 'react';

export default function SimpleFooter() {
  return (
    <footer style={{
      background: '#2d3748',
      color: 'white',
      padding: '30px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>About</a>
          <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Contact</a>
          <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Terms</a>
        </div>
        <p style={{ 
          margin: 0, 
          opacity: 0.8,
          fontSize: '0.9rem'
        }}>
          © 2024 Simple Layout Demo. Built with modular components.
        </p>
      </div>
    </footer>
  );
}
