// project/src/components/Ajuda.jsx
import React from 'react';

const Ajuda = () => {
  return (
    <div>
      <h1>Bem-vindo ao nosso aplicativo!</h1>
      <p>Aqui você encontrará informações sobre como usar o nosso app e gerenciar suas dívidas.</p>

      <h2>Como funciona o app?</h2>
      <p>O nosso app é projetado para ajudá-lo a gerenciar suas dívidas de forma fácil e eficiente. Você pode adicionar, editar e excluir dívidas, além de visualizar um resumo das suas dívidas pendentes.</p>

      <h2>Como adicionar uma dívida?</h2>
      <p>Para adicionar uma dívida, basta acessar a página "Nova Divida" e preencher os campos com as informações da dívida.</p>

      <h2>Como visualizar minhas dívidas?</h2>
      <p>Para visualizar suas dívidas, basta acessar a página "Dividas". Lá você encontrará uma lista de todas as suas dívidas, incluindo as pendentes e as quitadas.</p>

      <h2>Como quitar uma dívida?</h2>
      <p>Para quitar uma dívida, basta acessar a página "Dividas" e clicar no botão "Quitar" ao lado da dívida que você deseja quitar.</p>

      <h2>Importante!</h2>
      <p>As dívidas quitadas serão automaticamente removidas da lista de dívidas pendentes.</p>

      <h2>Contato</h2>
      <p>Se você tiver alguma dúvida ou precisar de ajuda, por favor entre em contato conosco através do nosso formulário de contato.</p>
      <p>
        <a href="/contato">Formulário de contato</a>
      </p>
    </div>
  );
};

export default Ajuda;