import React, { useState, useEffect } from 'react';
import api from './api';
import AddConsole from './components/AddConsole';
import AddGame from './components/AddGame';
import ConsoleList from './components/ConsoleList';
import GameCatalog from './components/GameCatalog';
import EditGame from './components/EditGame';

const App = () => {
  const [consoles, setConsoles] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [showAddConsoleModal, setShowAddConsoleModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const fetchConsoles = async () => {
    try {
      const response = await api.get('/consoles');
      setConsoles(response.data);
    } catch (error) {
      console.error('Error fetching consoles:', error);
    }
  };

  const fetchGames = async (consoleId = null) => {
    try {
      const isWishlistQuery = showWishlist ? 'true' : 'false';
      let url = `/games?isWishlist=${isWishlistQuery}`;
      if (consoleId) {
        url += `&consoleId=${consoleId}`;
      }
      const response = await api.get(url);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchConsoles();
    // Fetch all games by default on initial load
    fetchGames();
  }, []);

  useEffect(() => {
    if (showWishlist) {
      fetchGames(null);
    } else if (selectedConsole) {
      fetchGames(selectedConsole._id);
    } else {
      // Fetches all games (non-wishlist) when no specific console or wishlist is selected
      fetchGames();
    }
  }, [selectedConsole, showWishlist]);

  const handleSelectConsole = (console) => {
    setSelectedConsole(console);
    setShowWishlist(false);
  };
  
  const handleShowAllGames = () => {
    setSelectedConsole(null);
    setShowWishlist(false);
  };

  const handleShowWishlist = () => {
    setShowWishlist(true);
    setSelectedConsole(null);
  };

  const newButtonStyle = "px-6 py-2 font-bold transition-all duration-300 border border-violet-400/20 bg-slate-900/70 backdrop-blur-sm rounded-full shadow-md hover:border-violet-400 hover:shadow-violet-400/30";

  return (
    <div 
      className="min-h-screen text-white font-sans flex flex-col bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed"
    >
      <header className="p-6 bg-slate-900/70 backdrop-blur-sm border-b border-slate-800 shadow-lg flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <img
            src="/gamelib-logo.png"
            alt="GameLib Logo"
            className="h-14 w-14 drop-shadow-lg"
          />
          <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-md animate-pulse">
            GameLib
          </span>
        </div>
        <div className="space-x-4">
          <button 
            onClick={() => setShowAddConsoleModal(true)} 
            className={newButtonStyle}
          >
            Add Console
          </button>
          <button 
            onClick={() => setShowAddGameModal(true)} 
            className={newButtonStyle}
          >
            Add Game
          </button>
        </div>
      </header>

      <main className="flex flex-1">
        <ConsoleList 
          consoles={consoles} 
          selectedConsole={selectedConsole} 
          onSelectConsole={handleSelectConsole}
          onShowAllGames={handleShowAllGames}
          onShowWishlist={handleShowWishlist}
          fetchConsoles={fetchConsoles}
          fetchGames={fetchGames}
          showWishlist={showWishlist}
        />
        <GameCatalog 
          games={games}
          fetchGames={() => fetchGames(selectedConsole?._id)}
          showWishlist={showWishlist}
          setEditingGame={setEditingGame}
          // Adicione as props abaixo se quiser controlar filtros/ordenação no App
          // onSearch={...}
          // onSort={...}
          // onFilter={...}
        />
      </main>

      {showAddConsoleModal && (
        <AddConsole
          onClose={() => setShowAddConsoleModal(false)}
          onConsoleAdded={() => {
            fetchConsoles();
            setShowAddConsoleModal(false);
          }}
        />
      )}

      {showAddGameModal && (
        <AddGame
          consoles={consoles}
          onClose={() => setShowAddGameModal(false)}
          onGameAdded={() => {
            fetchGames(selectedConsole?._id);
            setShowAddGameModal(false);
          }}
        />
      )}
       {editingGame && (
        <EditGame
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onGameUpdated={() => {
            fetchGames(selectedConsole?._id);
            setEditingGame(null);
          }}
        />
      )}
      {/* Footer de créditos */}
      <footer className="w-full text-center py-4 bg-slate-900/70 backdrop-blur-sm border-t border-slate-800 text-gray-400 text-sm mt-auto">
        Created by{' '}
        <a
          href="https://alexolinux.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:underline font-semibold"
        >
          Alex Mendes
        </a>
      </footer>
    </div>
  );
};

export default App;
