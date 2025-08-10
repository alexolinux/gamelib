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
  const [showWishlist, setShowWishlist] = useState(false);

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
  }, [showWishlist]);

  const handleSelectConsole = (console) => {
    setSelectedConsole(console);
    fetchGames(console?._id);
  };
  
  // New button style for the design revamp
  const newButtonStyle = "px-6 py-2 font-bold transition-all duration-300 border border-violet-400/20 bg-slate-900/70 backdrop-blur-sm rounded-full shadow-md hover:border-violet-400 hover:shadow-violet-400/30";

  return (
    <div 
      className="min-h-screen text-white font-sans flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-black/70 flex flex-col flex-1">
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
            fetchConsoles={fetchConsoles}
            fetchGames={fetchGames}
            showWishlist={showWishlist}
            setShowWishlist={setShowWishlist}
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
    </div>
  );
};

export default App;
