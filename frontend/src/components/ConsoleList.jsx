import React from 'react';
import api from '../api';

const ConsoleList = ({ consoles, selectedConsole, onSelectConsole, fetchConsoles, fetchGames, showWishlist, setShowWishlist }) => {
  const handleDelete = async (consoleId) => {
    if (window.confirm('Are you sure you want to delete this console?')) {
      try {
        await api.delete(`/consoles/${consoleId}`);
        fetchConsoles();
        fetchGames();
        alert('Console deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting console.');
      }
    }
  };

  const handleClearGames = async (consoleId) => {
    if (window.confirm('Are you sure you want to clear all games from this console?')) {
      try {
        await api.delete(`/consoles/${consoleId}/games`);
        fetchGames(consoleId);
        alert('Games cleared successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error clearing games.');
      }
    }
  };

  return (
    <aside className="w-64 p-6 bg-gray-800 border-r border-gray-700">
      <h2 className="text-xl font-bold mb-4">Consoles</h2>
      <ul className="space-y-2">
        <li
          className={`cursor-pointer p-3 rounded-lg font-bold transition-colors ${
            !selectedConsole && !showWishlist ? 'bg-teal-600 text-white' : 'hover:bg-gray-700'
          }`}
          onClick={() => {
            onSelectConsole(null);
            setShowWishlist(false);
          }}
        >
          All Games
        </li>
        <li
          className={`cursor-pointer p-3 rounded-lg font-bold transition-colors ${
            showWishlist ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'
          }`}
          onClick={() => {
            onSelectConsole(null);
            setShowWishlist(true);
          }}
        >
          My Wishlist
        </li>
        {consoles.map(consoleItem => (
          <li
            key={consoleItem._id}
            className={`cursor-pointer p-3 rounded-lg transition-colors ${
              selectedConsole?._id === consoleItem._id && !showWishlist ? 'bg-teal-600 text-white' : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between" onClick={() => {
              onSelectConsole(consoleItem);
              setShowWishlist(false);
            }}>
              <span>{consoleItem.name}</span>
            </div>
            {selectedConsole?._id === consoleItem._id && (
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearGames(consoleItem._id); }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-bold"
                >
                  Clear
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(consoleItem._id); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ConsoleList;
