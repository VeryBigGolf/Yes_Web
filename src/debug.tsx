import React from 'react';

export function DebugInfo() {
  return (
    <div style={{ padding: '20px', background: 'white', color: 'black' }}>
      <h1>Debug Info</h1>
      <p>React is working!</p>
      <p>Current time: {new Date().toISOString()}</p>
      <p>User agent: {navigator.userAgent}</p>
    </div>
  );
}
