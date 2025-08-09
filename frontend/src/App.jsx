import React, { useState, useEffect } from 'react';
import api from './api';
import AddConsole from './components/AddConsole';
import AddGame from './components/AddGame';
import ConsoleList from './components/ConsoleList';
import GameCatalog from './components/GameCatalog';

const App = () => {
  const [consoles, setConsoles] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [showAddConsoleModal, setShowAddConsoleModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false); // New state for Wishlist

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
    fetchGames();
  }, [showWishlist]); // Re-fetch games when showWishlist changes

  const handleSelectConsole = (console) => {
    setSelectedConsole(console);
    fetchGames(console?._id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="p-6 bg-gray-800 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold">Game Library</h1>
        <div className="space-x-4">
          <button onClick={() => setShowAddConsoleModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold">
            Add Console
          </button>
          <button onClick={() => setShowAddGameModal(true)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold">
            Add Game
          </button>
        </div>
      </header>

      <main className="flex">
        <ConsoleList 
          consoles={consoles} 
          selectedConsole={selectedConsole} 
          onSelectConsole={handleSelectConsole}
          fetchConsoles={fetchConsoles}
          fetchGames={fetchGames}
          showWishlist={showWishlist} // Pass to ConsoleList
          setShowWishlist={setShowWishlist} // Pass to ConsoleList
        />
        <GameCatalog games={games} fetchGames={() => fetchGames(selectedConsole?._id)} showWishlist={showWishlist} />
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
    </div>
  );
};

export default App;
