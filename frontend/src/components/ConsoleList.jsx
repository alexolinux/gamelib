import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const ConsoleList = ({ consoles, selectedConsole, onSelectConsole, fetchConsoles, fetchGames, showWishlist, setShowWishlist }) => {
  const [loading, setLoading] = useState(false);
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
  }, [menuRef]);

  const handleDelete = async (consoleId) => {
    if (window.confirm('Are you sure you want to delete this console? This will also delete all associated games.')) {
      try {
        await api.delete(`/consoles/${consoleId}`);
        fetchConsoles();
        fetchGames();
        onSelectConsole(null);
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
        alert('All games cleared from console successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error clearing games from console.');
      }
    }
  };

  const toggleMenu = (consoleId) => {
    setOpenMenuId(openMenuId === consoleId ? null : consoleId);
  };

  const baseButtonClasses = "w-full text-left px-4 py-2 rounded-lg border-2 transition-all duration-300 ease-in-out font-semibold";
  const baseConsoleButtonClasses = "flex justify-between items-center bg-slate-800 rounded-lg border-2 transition-all duration-300 ease-in-out font-semibold";

  const buttonStyle = (isActive) => 
    `${baseButtonClasses} ${isActive 
      ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/50' 
      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-400/20'}`;

  const consoleButtonStyle = (isActive) =>
    `${baseConsoleButtonClasses} ${isActive 
      ? 'bg-indigo-700 border-indigo-600 shadow-lg shadow-indigo-600/50' 
      : 'hover:bg-slate-700 border-slate-700 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-400/20'}`;

  return (
    <div className="w-64 p-6 bg-slate-900/70 backdrop-blur-sm border-r border-slate-800">
      <h2 className="text-2xl font-bold mb-4">Consoles</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => {
              setShowWishlist(false);
              onSelectConsole(null);
            }}
            className={buttonStyle(!selectedConsole && !showWishlist)}
          >
            All Games
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setShowWishlist(true);
              onSelectConsole(null);
            }}
            className={buttonStyle(showWishlist)}
          >
            My Wishlist
          </button>
        </li>
      </ul>
      <div className="mt-6 space-y-2">
        {consoles.map(consoleItem => (
          <div key={consoleItem._id} className="relative">
            <div className={consoleButtonStyle(selectedConsole?._id === consoleItem._id && !showWishlist)}>
              <button
                onClick={() => {
                  setShowWishlist(false);
                  onSelectConsole(consoleItem);
                }}
                className="flex-1 text-left px-4 py-2"
              >
                {consoleItem.name}
              </button>
              <button onClick={() => toggleMenu(consoleItem._id)} className="px-4 py-2 hover:bg-slate-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            {openMenuId === consoleItem._id && (
              <div ref={menuRef} className="absolute right-0 top-0 mt-12 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleList;
