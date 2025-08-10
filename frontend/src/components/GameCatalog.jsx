import React, { useState } from 'react';
import api from '../api';
import EditGame from './EditGame';

const GameCatalog = ({ games, fetchGames, showWishlist }) => {
  const [editingGame, setEditingGame] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await api.delete(`/games/${gameId}`);
        fetchGames();
        alert('Game deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting game.');
      }
    }
  };

  const handleAcquireGame = async (game) => {
    try {
      await api.put(`/games/${game._id}`, { ...game, isWishlist: false, status: 'Backlog' });
      setSuccessMessage('Game acquired! Have fun!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchGames();
    } catch (error) {
      alert(error.response?.data?.message || 'Error moving game to catalog.');
    }
  };

  if (!games || games.length === 0) {
    return <div className="p-6 text-gray-400">No games found for this console.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {successMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white p-3 rounded-md shadow-md z-50">
          {successMessage}
        </div>
      )}
      {games.map(game => (
        <div key={game._id} className="bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 border-2 border-transparent hover:border-violet-400 hover:shadow-violet-400/30">
          <div className="relative h-48">
            <img 
              src={game.cover || 'https://via.placeholder.com/300x200?text=No+Cover'} 
              alt={game.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-xl font-bold mb-2">{game.name}</h3>
            {game.console && (
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-semibold">Console:</span> {game.console.name}
              </p>
            )}
            {game.releaseDate && (
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-semibold">Release:</span> {new Date(game.releaseDate).toLocaleDateString()}
              </p>
            )}
            {game.metacriticRating && (
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-semibold">Metacritic:</span> {game.metacriticRating}
              </p>
            )}
            {game.userRating && (
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-semibold">User Rating:</span> {game.userRating}
              </p>
            )}
            {game.status && (
              <p className="text-gray-400 text-sm mb-4">
                <span className="font-semibold">Status:</span> {game.status}
              </p>
            )}
            <div className="mt-auto flex space-x-2">
              {showWishlist ? (
                <button 
                  onClick={() => handleAcquireGame(game)} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold"
                >
                  Acquire Game
                </button>
              ) : (
                <button 
                  onClick={() => setEditingGame(game)} 
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-bold"
                >
                  Edit
                </button>
              )}
              <button 
                onClick={() => handleDelete(game._id)} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {editingGame && (
        <EditGame
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onGameUpdated={() => {
            fetchGames();
            setEditingGame(null);
          }}
        />
      )}
    </div>
  );
};

export default GameCatalog;
