// project/src/components/Contato.jsx
import React from 'react';

const Contato = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'black',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 20 }}>Fernando Chamussola</h1>
      <p style={{ fontSize: 24, marginBottom: 20 }}>+258 855075735 / +258 879575735</p>
    </div>
  );
};

export default Contato;