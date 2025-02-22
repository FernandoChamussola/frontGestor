// project/src/components/AnuncioBarra.jsx
import React from 'react';

const AnuncioBarra = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 90,
      backgroundColor: '#333',
      color: '#fff',
      textAlign: 'center',
      padding: 10,
      boxSizing: 'border-box',
      zIndex: -1
    }}>
      <p>Área reservada para anúncios</p>
    </div>
  );
};

export default AnuncioBarra;

