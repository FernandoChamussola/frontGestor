import React, { useState } from 'react';
import { mensagemm } from '../services/api';


const Contato = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const dados = {
      nome, email, mensagem
    };
    mensagemm(dados);
    setFeedback('Mensagem enviada com sucesso!');
    setNome('');
    setEmail('');
    setMensagem('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2c2c2c',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Fale Conosco</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3a3a3a',
              color: 'white',
              outline: 'none'
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3a3a3a',
              color: 'white',
              outline: 'none'
            }}
          />
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Mensagem"
            rows="4"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3a3a3a',
              color: 'white',
              outline: 'none',
              resize: 'none'
            }}
          />
          <button type="submit" style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}>
            Enviar
          </button>
        </form>
        {feedback && <p style={{ marginTop: '15px', textAlign: 'center', color: '#28a745' }}>{feedback}</p>}
      </div>
    </div>
  );
};

export default Contato;
