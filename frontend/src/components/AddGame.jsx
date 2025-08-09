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
      const response = await api.post('/games', gamePayload);
      onGameAdded();
      alert(`Game "${response.data.name}" added successfully to your ${gamePayload.isWishlist ? 'Wishlist' : 'Catalog'}!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding game.');
    }
  };

  const handleAddRawgGame = (game, isWishlist = false) => {
    const newGame = {
      name: game.name,
      console: selectedConsole,
      rawgId: game.id,
      cover: game.background_image,
      releaseDate: game.released,
      metacriticRating: game.metacritic,
      isWishlist: isWishlist,
      status: isWishlist ? 'I Wanna Play!' : 'Backlog',
      userRating: null,
    };
    addGame(newGame);
  };

  const handleAddManualGame = (isWishlist = false) => {
    if (!manualName || !selectedConsole) {
      alert('Please provide a name and select a console.');
      return;
    }
    const newGame = {
      name: manualName,
      console: selectedConsole,
      releaseDate: manualReleaseDate,
      cover: manualCover,
      metacriticRating: manualMetacritic,
      isWishlist: isWishlist,
      status: isWishlist ? 'I Wanna Play!' : 'Backlog',
      userRating: null,
    };
    addGame(newGame);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Game</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="manualAdd"
            checked={showManualForm}
            onChange={(e) => setShowManualForm(e.target.checked)}
            className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="manualAdd" className="ml-2 text-white">Add manually</label>
        </div>

        <div className="space-y-4">
          <select 
            value={selectedConsole}
            onChange={(e) => setSelectedConsole(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="">Select a console...</option>
            {consoles.map(consoleItem => (
              <option key={consoleItem._id} value={consoleItem._id}>{consoleItem.name}</option>
            ))}
          </select>
          
          {showManualForm ? (
            <>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Game Name"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="text"
                value={manualCover}
                onChange={(e) => setManualCover(e.target.value)}
                placeholder="Cover Image URL (optional)"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="date"
                value={manualReleaseDate}
                onChange={(e) => setManualReleaseDate(e.target.value)}
                placeholder="Release Date (optional)"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <input
                type="number"
                value={manualMetacritic}
                onChange={(e) => setManualMetacritic(e.target.value)}
                placeholder="Metacritic Score (optional)"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <div className="flex space-x-2 mt-4">
                <button onClick={() => handleAddManualGame(false)} className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold">
                  Add to Catalog
                </button>
                <button onClick={() => handleAddManualGame(true)} className="flex-1 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold">
                  Add to Wishlist
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex space-x-2">
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
