// gamelib/frontend/src/App.jsx
import { useState, useEffect } from 'react';
import ConsoleManager from './components/ConsoleManager'; // Importe o novo componente
import GameManager from './components/GameManager'; // Importe o componente de gerenciamento de jogos
import './App.css'; // Mantenha ou ajuste conforme necessário

function App() {
  const [backendMessage, setBackendMessage] = useState('Conectando ao backend...');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.text();
      })
      .then(data => setBackendMessage(data))
      .catch(error => {
        console.error('Erro ao buscar mensagem do backend:', error);
        setBackendMessage(`Erro ao conectar ao backend: ${error.message}`);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo ao Gamelib!</h1>
        <p>Mensagem do Backend: {backendMessage}</p>
      </header>
      <hr style={{ borderColor: '#444', margin: '40px auto', width: '80%' }} />
      <ConsoleManager />
      <hr style={{ borderColor: '#444', margin: '40px auto', width: '80%' }} />
      <GameManager /> {/* Renderiza o componente de gerenciamento de jogos */}
    </div>
  );
}

export default App;
