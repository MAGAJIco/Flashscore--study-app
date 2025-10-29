
'use client';

import React, { useState, useEffect } from 'react';

export function ApiTest() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus(`Error: ${err.message}`));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Test</h2>
      <p>{status}</p>
    </div>
  );
}
