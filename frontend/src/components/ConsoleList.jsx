import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const ConsoleList = ({ consoles, selectedConsole, onSelectConsole, onShowAllGames, onShowWishlist, fetchConsoles, fetchGames, showWishlist }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (consoleId) => {
    if (window.confirm('Are you sure you want to delete this console? This will also delete all associated games.')) {
      try {
        await api.delete(`/consoles/${consoleId}`);
        fetchConsoles();
        onShowAllGames();
        alert('Console and all associated games deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting console. Make sure it is empty before deleting.');
      }
    }
  };

  const handleClear = async (consoleId) => {
    if (window.confirm('Are you sure you want to clear all games from this console?')) {
      try {
        await api.delete(`/consoles/${consoleId}/games`);
        fetchGames(consoleId);
        alert('All games for this console have been cleared!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error clearing games.');
      }
    }
  };

  const toggleMenu = (consoleId) => {
    setOpenMenuId(openMenuId === consoleId ? null : consoleId);
  };

  return (
    <aside className="w-64 bg-slate-800/70 backdrop-blur-sm p-6 flex flex-col border-r border-slate-700 h-full">
      <div className="mb-6">
        <button
          onClick={onShowAllGames}
          className={`w-full text-left p-3 rounded-lg mb-2 font-bold transition-colors duration-200 ${
            !selectedConsole && !showWishlist ? 'bg-violet-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          🎮 All Games
        </button>
        <button
          onClick={onShowWishlist}
          className={`w-full text-left p-3 rounded-lg mb-2 font-bold transition-colors duration-200 ${
            showWishlist ? 'bg-violet-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          ✨ My Wishlist
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Consoles</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="-mr-2">
          {consoles.map(consoleItem => (
            <li key={consoleItem._id} className="relative flex justify-between items-center mb-2">
              <button
                onClick={() => onSelectConsole(consoleItem)}
                className={`flex-grow text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedConsole && selectedConsole._id === consoleItem._id ? 'bg-violet-600' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {consoleItem.name}
              </button>
              <div className="absolute right-0 top-0 h-full flex items-center px-2">
                <button onClick={() => toggleMenu(consoleItem._id)} className="px-4 py-2 hover:bg-slate-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              {openMenuId === consoleItem._id && (
                <div ref={menuRef} className="absolute right-0 top-0 mt-12 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                  <button
                    onClick={() => {
                      handleClear(consoleItem._id);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-900 transition-colors"
                  >
                    Clear Games
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(consoleItem._id);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-900 transition-colors"
                  >
                    Delete Console
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ConsoleList;
