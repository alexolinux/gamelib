import React, { useState } from 'react';
import api from '../api';
import GameList from './GameList';

const GameCatalog = ({ games, fetchGames, showWishlist, setEditingGame }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('');

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
    if (window.confirm('Are you sure you want to acquire this game? It will be moved from your wishlist to your backlog.')) {
      try {
        await api.put(`/games/${game._id}`, { ...game, isWishlist: false, status: 'Backlog' });
        fetchGames();
        alert('Game acquired! Have fun!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error moving game to catalog.');
      }
    }
  };

  // Filtragem e ordenação
  const filteredGames = games
    .filter(game => game.name.toLowerCase().includes(search.toLowerCase()))
    .filter(game => !statusFilter || game.status === statusFilter);

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'releaseDate') return new Date(a.releaseDate) - new Date(b.releaseDate);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  if (!games || games.length === 0) {
    return <div className="flex-1 p-6 text-gray-400">No games found.</div>;
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Pesquisar jogo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white w-1/3"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white"
        >
          <option value="name">Name</option>
          <option value="releaseDate">Release Date</option>
          <option value="status">Status</option>
          <option value="rating">Rating</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white"
        >
          <option value="">All</option>
          <option value="Backlog">Backlog</option>
          <option value="Played">Played</option>
          <option value="I Wanna Play!">I Wanna Play!</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 overflow-y-auto w-full">
        {sortedGames.map(game => (
          <div key={game._id} className="bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg flex flex-col transition-transform duration-300 hover:scale-105 border-2 border-transparent hover:border-violet-400 hover:shadow-violet-400/30 overflow-hidden h-[26rem]">
            <div className="relative h-48">
              <img
                src={game.cover || 'https://via.placeholder.com/300x200?text=No+Cover'}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 truncate">{game.name}</h3>
              <div className="flex-grow overflow-hidden">
                {game.console && (
                  <p className="text-gray-400 text-sm mb-1 truncate">
                    <span className="font-semibold">Console:</span> {game.console.name}
                  </p>
                )}
                {game.releaseDate && (
                  <p className="text-gray-400 text-sm mb-1 truncate">
                    <span className="font-semibold">Release:</span> {new Date(game.releaseDate).toLocaleDateString()}
                  </p>
                )}
                {game.metacriticRating && (
                  <p className="text-gray-400 text-sm mb-1 truncate">
                    <span className="font-semibold">Metacritic:</span> {game.metacriticRating}
                  </p>
                )}
                {game.userRating && (
                  <p className="text-gray-400 text-sm mb-1 truncate">
                    <span className="font-semibold">User Rating:</span> {game.userRating}
                  </p>
                )}
                {game.status && (
                  <p className="text-gray-400 text-sm mb-1 truncate">
                    <span className="font-semibold">Status:</span> {game.status}
                  </p>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
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
      </div>
    </div>
  );
};

export default GameCatalog;
