import React, { useState } from 'react';
import api from '../api';

const EditGame = ({ game, onClose, onGameUpdated }) => {
  const [name, setName] = useState(game.name || '');
  const [status, setStatus] = useState(game.status || 'Backlog');
  const [userRating, setUserRating] = useState(game.userRating || '');
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedGame = {
        name,
        status,
        userRating: userRating || null,
        // The isWishlist flag is no longer set here
      };
      await api.put(`/games/${game._id}`, updatedGame);
      onGameUpdated();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating game.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Game</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Game Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="Backlog">Backlog</option>
              <option value="I Wanna Play!">I Wanna Play!</option>
              <option value="Played">Played</option>
            </select>
          </div>
          {status === 'Played' && (
            <div>
              <label className="block text-sm font-medium mb-1">User Rating (0-100)</label>
              <input
                type="number"
                value={userRating}
                onChange={(e) => setUserRating(e.target.value)}
                min="0"
                max="100"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold">
              Cancel
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold">
              Update Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGame;
