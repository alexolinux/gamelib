// gamelib/frontend/src/components/GameManager.jsx
import React, { useState, useEffect } from 'react';
import './GameManager.css';
import AddGameForm from './AddGameForm';
import GameCard from './GameCard';

function GameManager() {
  const [games, setGames] = useState([]);
  const [consoles, setConsoles] = useState([]); // Para listar as consoles disponíveis
  const [selectedConsole, setSelectedConsole] = useState(''); // Para filtrar jogos por console
  const [searchTerm, setSearchTerm] = useState(''); // Para pesquisar jogos
  const [activeTab, setActiveTab] = useState('myGames'); // 'myGames', 'addGame', 'wishlist'

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Função para buscar consoles (necessária para adicionar jogos e filtrar)
  const fetchConsoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/consoles`);
      if (!response.ok) throw new Error('Falha ao buscar consoles.');
      const data = await response.json();
      setConsoles(data);
    } catch (error) {
      console.error('Erro ao buscar consoles:', error.message);
      alert(`Erro ao carregar consoles: ${error.message}`);
    }
  };

  // Função para buscar jogos
  const fetchGames = async () => {
    try {
      let url = `${apiUrl}/api/games?`;
      if (selectedConsole) {
        url += `consoleId=${selectedConsole}&`;
      }
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}&`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao buscar jogos.');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error.message);
      alert(`Erro ao carregar jogos: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchConsoles();
    fetchGames(); // Carrega os jogos iniciais
  }, []);

  // Recarrega jogos quando a console selecionada ou o termo de busca mudam
  useEffect(() => {
    fetchGames();
  }, [selectedConsole, searchTerm]);


  // --- Funções de Manipulação de Jogos (Serão passadas para componentes filhos) ---

  // Função para adicionar um jogo (do RAWG.io ou manual)
  const handleAddGame = async (gameData) => {
    try {
      const response = await fetch(`${apiUrl}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar jogo.');
      }

      alert('Jogo adicionado com sucesso!');
      fetchGames(); // Recarrega a lista de jogos
      setActiveTab('myGames'); // Volta para a aba de "Meus Jogos"
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error.message);
      alert(`Falha ao adicionar jogo: ${error.message}`);
    }
  };

  // Função para remover um jogo
  const handleRemoveGame = async (gameId, gameTitle) => {
    if (!window.confirm(`Tem certeza que deseja remover "${gameTitle}" do seu catálogo?`)) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/games/${gameId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao remover jogo.');
      alert('Jogo removido com sucesso!');
      fetchGames(); // Recarrega a lista de jogos
    } catch (error) {
      console.error('Erro ao remover jogo:', error.message);
      alert(`Falha ao remover jogo: ${error.message}`);
    }
  };

  // Função para atualizar o status de um jogo
  const handleUpdateGameStatus = async (gameId, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/api/games/${gameId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar status do jogo.');
      alert(`Status do jogo atualizado para "${newStatus}"!`);
      fetchGames(); // Recarrega a lista de jogos
    } catch (error) {
      console.error('Erro ao atualizar status do jogo:', error.message);
      alert(`Falha ao atualizar status do jogo: ${error.message}`);
    }
  };

  // Função para adicionar/mover para Wishlist
  const handleAddToWishlist = async (gameId, gameTitle) => {
    if (!window.confirm(`Deseja mover "${gameTitle}" para sua Wishlist?`)) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/games/${gameId}/wishlist`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Falha ao mover para Wishlist.');
      alert(`"${gameTitle}" movido para a Wishlist!`);
      fetchGames(); // Recarrega a lista de jogos
    } catch (error) {
      console.error('Erro ao mover para Wishlist:', error.message);
      alert(`Falha ao mover para Wishlist: ${error.message}`);
    }
  };

  // Renderiza o conteúdo da aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'myGames':
        const myGames = games.filter(g => g.status !== 'Wishlist');
        return (
          <div className="game-gallery">
            <h4>Meus Jogos ({myGames.length})</h4>
            <div className="filters">
              <select
                value={selectedConsole}
                onChange={(e) => setSelectedConsole(e.target.value)}
              >
                <option value="">Todas as Consoles</option>
                {consoles.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Pesquisar jogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="game-list">
              {myGames.length === 0 ? (
                <p>Nenhum jogo encontrado no seu catálogo para esta seleção.</p>
              ) : (
                myGames.map(game => (
                  <GameCard
                    key={game._id}
                    game={game}
                    onUpdateStatus={handleUpdateGameStatus}
                    onRemoveGame={handleRemoveGame}
                    onAddToWishlist={handleAddToWishlist}
                    isWishlist={false} // Indica que não estamos na wishlist
                  />
                ))
              )}
            </div>
          </div>
        );
      case 'addGame':
        return (
          <AddGameForm
            consoles={consoles}
            onGameAdded={handleAddGame}
            onShowMessage={(msg, type) => alert(`${type.toUpperCase()}: ${msg}`)}
          />
        );
      case 'wishlist':
        const wishlistGames = games.filter(g => g.status === 'Wishlist');
        return (
          <div className="wishlist-section">
            <h4>Minha Wishlist ({wishlistGames.length})</h4>
            <div className="game-list">
              {wishlistGames.length === 0 ? (
                <p>Sua Wishlist está vazia. Adicione jogos que você deseja adquirir!</p>
              ) : (
                wishlistGames.map(game => (
                  <GameCard
                    key={game._id}
                    game={game}
                    onUpdateStatus={handleUpdateGameStatus}
                    onRemoveGame={handleRemoveGame}
                    onAddToWishlist={handleAddToWishlist} // Ainda pode ser útil para mover de volta
                    isWishlist={true} // Indica que estamos na wishlist
                  />
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Renderiza o componente principal do GameManager
  return (
    <div className="game-manager-container">
      <h2>Gerenciamento de Jogos</h2>
      <div className="tabs">
        <button
          className={activeTab === 'myGames' ? 'active' : ''}
          onClick={() => setActiveTab('myGames')}
        >
          Meus Jogos
        </button>
        <button
          className={activeTab === 'addGame' ? 'active' : ''}
          onClick={() => setActiveTab('addGame')}
        >
          Adicionar Jogo
        </button>
        <button
          className={activeTab === 'wishlist' ? 'active' : ''}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default GameManager;
