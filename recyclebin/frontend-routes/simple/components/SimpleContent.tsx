
import React from 'react';

export default function SimpleContent() {
  return (
    <main style={{
      flex: 1,
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>📦 Component 1</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            This is a modular component that can be easily reused and maintained separately.
          </p>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>🔧 Component 2</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Each component is in its own file, making the code organized and scalable.
          </p>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>✨ Component 3</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Simple, clean design that focuses on functionality and readability.
          </p>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>🎯 Main Feature Section</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          This layout demonstrates how to structure components in separate files and connect them together 
          for a clean, maintainable codebase.
        </p>
      </div>
    </main>
  );
}
