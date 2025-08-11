import React, { useState } from 'react';
import api from '../api';

const AddGame = ({ consoles, onGameAdded, onClose }) => {
  const [selectedConsole, setSelectedConsole] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rawgGames, setRawgGames] = useState([]);
  
  // Manual form state
  const [manualName, setManualName] = useState('');
  const [manualReleaseDate, setManualReleaseDate] = useState('');
  const [manualCover, setManualCover] = useState('');
  const [manualMetacritic, setManualMetacritic] = useState('');
  const [manualStatus, setManualStatus] = useState('Backlog');

  const handleSearch = async () => {
    try {
      if (!selectedConsole) {
        alert('Please select a console first.');
        return;
      }
      
      const consoleDoc = consoles.find(c => c._id === selectedConsole);
      if (!consoleDoc || !consoleDoc.rawgId) {
        alert('Selected console does not have a RAWG ID for searching.');
        return;
      }
      
      const response = await api.get('/games/rawg-search', {
        params: {
          query: searchQuery,
          consoleId: selectedConsole
        }
      });
      setRawgGames(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error searching for games.');
    }
  };

  const addGame = async (gamePayload) => {
    try {
      await api.post('/games', gamePayload);
      alert('Game added successfully!');
      onGameAdded();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding game');
    }
  };

  const handleAddRawgGame = (game, isWishlist) => {
    addGame({
      name: game.name,
      console: selectedConsole,
      rawgId: game.id,
      releaseDate: game.released,
      cover: game.background_image,
      metacriticRating: game.metacritic,
      isWishlist
    });
  };

  const handleAddManualGame = async (isWishlist) => {
    addGame({
      name: manualName,
      console: selectedConsole,
      releaseDate: manualReleaseDate,
      cover: manualCover,
      metacriticRating: manualMetacritic,
      isWishlist,
      status: manualStatus
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Game</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Select a console</label>
          <select
            value={selectedConsole}
            onChange={(e) => setSelectedConsole(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          >
            <option value="">Select a console...</option>
            {consoles.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={showManualForm}
            onChange={() => setShowManualForm(!showManualForm)}
            className="form-checkbox"
          />
          <span className="ml-2">Add manually</span>
        </div>
        <div>
          {showManualForm ? (
            // Manual Add Form
            <form onSubmit={(e) => { e.preventDefault(); handleAddManualGame(false); }}>
              <div className="mb-4">
                <label className="block mb-2">Game Name</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Release Date</label>
                <input
                  type="date"
                  value={manualReleaseDate}
                  onChange={(e) => setManualReleaseDate(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={manualCover}
                  onChange={(e) => setManualCover(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Metacritic Rating</label>
                <input
                  type="number"
                  value={manualMetacritic}
                  onChange={(e) => setManualMetacritic(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold flex-grow">
                  Add Game
                </button>
                <button type="button" onClick={() => handleAddManualGame(true)} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold flex-grow">
                  Add to Wishlist
                </button>
              </div>
            </form>
          ) : (
            // RAWG Search Form
            <>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a game..."
                  className="flex-grow p-2 rounded bg-gray-700 border border-gray-600 text-white"
                />
                <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold">
                  Search on RAWG
                </button>
              </div>
              {rawgGames.length > 0 && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg max-h-48 overflow-y-auto">
                  <h3 className="font-bold mb-2">Search Results</h3>
                  {rawgGames.map(game => (
                    <div key={game.id} className="flex items-center p-2 border-b border-gray-600 last:border-0">
                      <span className="flex-grow">{game.name}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => handleAddRawgGame(game, false)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                          Add Game
                        </button>
                        <button onClick={() => handleAddRawgGame(game, true)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">
                          Add to Wishlist
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddGame;
