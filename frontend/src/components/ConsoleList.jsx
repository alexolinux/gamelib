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
    <aside className="w-full lg:w-64 bg-slate-800/70 backdrop-blur-sm p-4 lg:p-6 flex flex-col border-b lg:border-r border-slate-700 h-auto lg:h-full">
      <div className="mb-4 lg:mb-6 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        <button
          onClick={onShowAllGames}
          className={`whitespace-nowrap flex-shrink-0 lg:w-full text-left p-3 rounded-lg font-bold transition-colors duration-200 ${!selectedConsole && !showWishlist ? 'bg-violet-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
        >
          🎮 All Games
        </button>
        <button
          onClick={onShowWishlist}
          className={`whitespace-nowrap flex-shrink-0 lg:w-full text-left p-3 rounded-lg font-bold transition-colors duration-200 ${showWishlist ? 'bg-violet-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
        >
          ✨ My Wishlist
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2 hidden lg:block">Consoles</h2>
      <div className="flex-grow overflow-x-auto lg:overflow-y-auto pr-0 lg:pr-2 pb-4">
        <ul className="flex lg:flex-col gap-3 -mr-0 lg:-mr-2 pb-32">
          {consoles.map((consoleItem, index) => {
            const isSelected = selectedConsole && selectedConsole._id === consoleItem._id;
            // Open upwards if in the bottom half of the list AND more than 2 items exist
            const isBottomHalf = consoles.length > 2 && index > consoles.length - 3;

            return (
              <li key={consoleItem._id} className="relative flex-shrink-0 lg:flex-shrink-1 flex justify-between items-center min-w-[14rem] lg:min-w-0 group">
                <button
                  onClick={() => onSelectConsole(consoleItem)}
                  className={`flex-grow text-left p-3 pr-12 rounded-lg transition-all duration-300 truncate border-2 ${isSelected
                      ? 'bg-violet-600 border-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.4)]'
                      : 'bg-slate-700 border-transparent hover:bg-slate-600 hover:border-slate-500'
                    }`}
                >
                  {consoleItem.name}
                </button>
                <div className="absolute right-0 top-0 h-full flex items-center px-1">
                  <button onClick={() => toggleMenu(consoleItem._id)} className="p-2 hover:bg-slate-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                {openMenuId === consoleItem._id && (
                  <div
                    ref={menuRef}
                    className={`absolute right-0 z-20 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl ${isBottomHalf ? 'bottom-full mb-2' : 'top-full mt-2'
                      }`}
                  >
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
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default ConsoleList;
