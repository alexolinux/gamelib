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
        <h1 className="text-3xl font-bold">Game Library</h1>
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
        <GameCatalog games={games} fetchGames={() => fetchGames(selectedConsole?._id)} showWishlist={showWishlist} setEditingGame={setEditingGame} />
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
    </div>
  );
};

export default App;
