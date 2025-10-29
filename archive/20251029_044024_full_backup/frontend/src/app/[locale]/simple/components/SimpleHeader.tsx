
import React from 'react';

export default function SimpleHeader() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        margin: '0 0 10px 0',
        fontWeight: 'bold'
      }}>
        🌟 Simple Layout Demo
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        opacity: 0.9,
        margin: 0
      }}>
        Clean and modular component structure
      </p>
    </header>
  );
}
