// gamelib/frontend/src/components/ConsoleManager.jsx
import React, { useState, useEffect } from 'react';
import './ConsoleManager.css';

function ConsoleManager() {
  const [consoles, setConsoles] = useState([]);
  const [newConsoleName, setNewConsoleName] = useState('');
  const [newConsoleRawgId, setNewConsoleRawgId] = useState('');
  // Obtém a URL base da API do ambiente (definida no docker-compose.yml)
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Função para buscar e atualizar a lista de consoles
  const fetchConsoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/consoles`);
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setConsoles(data);
    } catch (error) {
      console.error('Erro ao buscar consoles:', error.message);
      alert(`Falha ao carregar consoles: ${error.message}`);
    }
  };

  // Efeito para carregar as consoles quando o componente é montado
  useEffect(() => {
    fetchConsoles();
  }, []); // O array vazio garante que o efeito só rode uma vez na montagem

  // Função para adicionar uma nova console
  const handleAddConsole = async () => {
    if (!newConsoleName.trim()) {
      alert('O nome da console é obrigatório!');
      return;
    }

    // Adapta o rawgPlatformId para ser um número ou null
    const rawgPlatformId = newConsoleRawgId.trim() === '' ? null : Number(newConsoleRawgId);
      if (newConsoleRawgId.trim() !== '' && isNaN(rawgPlatformId)) {
        alert('ID da Plataforma RAWG.io deve ser um número ou vazio.');
        return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/consoles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: newConsoleName,
            rawgPlatformId: rawgPlatformId // <-- PASSA O NOVO CAMPO
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido ao adicionar console.');
      }

      setNewConsoleName('');
      setNewConsoleRawgId(''); // <-- LIMPA O NOVO ESTADO
      fetchConsoles();
      alert('Console adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar console:', error.message);
      alert(`Falha ao adicionar console: ${error.message}`);
    }
  };

  // Função para deletar uma console
  const handleDeleteConsole = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta console?')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/consoles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido ao deletar console.');
      }

      fetchConsoles(); // Recarrega a lista de consoles
      alert('Console deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar console:', error.message);
      alert(`Falha ao deletar console: ${error.message}`);
    }
  };

  // Função placeholder para limpar jogos
  const handleClearGames = async (consoleId, consoleName) => {
    if (!window.confirm(`Tem certeza que deseja REMOVER TODOS OS JOGOS da console "${consoleName}"? Esta ação é irreversível!`)) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/consoles/${consoleId}/clear-games`, {
        method: 'POST', // É um POST porque está realizando uma ação (limpar)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido ao limpar jogos da console.');
      }

      const result = await response.json();
      alert(result.message);
      // Opcional: recarregar a lista de jogos no GameManager se ele estivesse aqui.
      // Como GameManager gerencia seus próprios jogos, ele se atualizará quando a tela for re-renderizada ou navegada.
    } catch (error) {
      console.error('Erro ao limpar jogos da console:', error.message);
      alert(`Falha ao limpar jogos da console: ${error.message}`);
    }
  };

  return (
    <div className="console-manager-container">
      <h3>Gerenciamento de Consoles</h3>

      <div className="add-console-section">
        <input
          type="text"
          placeholder="Nome da nova console (ex: PlayStation 5)"
          value={newConsoleName}
          onChange={(e) => setNewConsoleName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddConsole();
            }
          }}
        />
        <input // <-- NOVO INPUT PARA O ID RAWG.io
          type="number" // Tipo número para o ID
          placeholder="ID RAWG.io (opcional)"
          value={newConsoleRawgId}
          onChange={(e) => setNewConsoleRawgId(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddConsole();
            }
          }}
          min="1" // IDs são positivos
        />
        <button onClick={handleAddConsole}>Adicionar Console</button>
      </div>

      <div className="console-list-section">
        <h4>Consoles Existentes:</h4>
        {consoles.length === 0 ? (
          <p>Nenhuma console cadastrada ainda.</p>
        ) : (
        <ul className="console-list">
          {consoles.length === 0 ? (
            <p>Nenhuma console cadastrada ainda.</p>
          ) : (
            consoles.map(console => (
              <li key={console._id} className="console-item">
                <span>
                  {console.name}
                  {console.rawgPlatformId && <span className="rawg-id-badge">RAWG ID: {console.rawgPlatformId}</span>}
                </span>
                <div className="console-actions">
                  <button
                    className="clear-games-btn" // Nova classe para estilização
                    onClick={() => handleClearGames(console._id, console.name)}
                  >
                    Limpar Jogos
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteConsole(console._id, console.name)}
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
        )}
      </div>
    </div>
  );
}

export default ConsoleManager;
