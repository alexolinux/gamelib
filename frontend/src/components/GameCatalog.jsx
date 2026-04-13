import React, { useState } from 'react';
import api from '../api';
import GameList from './GameList';

const GameCatalog = ({ games, fetchGames, showWishlist, setEditingGame, stats }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
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
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'releaseDate') {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      comparison = dateA - dateB;
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'rating') {
      // Prioridade para metacriticRating, fallback para userRating
      const getRating = (g) => g.metacriticRating ?? g.userRating ?? -1;
      comparison = getRating(a) - getRating(b);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (!games || games.length === 0) {
    return <div className="flex-1 p-6 text-gray-400">No games found.</div>;
  }

  return (
    <div className="flex-1 p-4 lg:p-8">
      {/* Stats Bar */}
      {!showWishlist && stats && (
        <div className="mb-8 flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 min-w-[200px] transition-all hover:bg-slate-800/60 hover:border-violet-500/50 group">
            <div className="bg-violet-500/20 p-3 rounded-xl text-violet-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Games</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.total}</p>
            </div>
          </div>

          <div className="flex-shrink-0 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 min-w-[200px] transition-all hover:bg-slate-800/60 hover:border-green-500/50 group">
            <div className="bg-green-500/20 p-3 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Played</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stats.played}</p>
            </div>
          </div>

          {stats.total > 0 && (
            <div className="flex-shrink-0 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 min-w-[200px] transition-all hover:bg-slate-800/60 hover:border-blue-500/50 group">
              <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Completion</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{Math.round((stats.played / stats.total) * 100)}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Pesquisar jogo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white w-full sm:w-1/3"
        />
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 rounded bg-slate-800 text-white"
          >
            <option value="name">Name</option>
            <option value="releaseDate">Release Date</option>
            <option value="status">Status</option>
            <option value="rating">Rating</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 rounded bg-slate-800 text-violet-400 hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700 shadow-sm"
            title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
          >
            {sortOrder === 'asc' ? (
              /* Ascending Icon: Small to Large bars with arrow down */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m0 5l3 3m0 0l3-3m-3 3V10" />
              </svg>
            ) : (
              /* Descending Icon: Large to Small bars with arrow down */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h5M3 8h9M3 12h13m-5 5l3 3m0 0l3-3m-3 3V10" />
              </svg>
            )}
          </button>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 rounded bg-slate-800 text-white"
          >
            <option value="">All</option>
            <option value="Backlog">Backlog</option>
            <option value="Played">Played</option>
            <option value="I Wanna Play!">I Wanna Play!</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 py-8 px-4 overflow-visible w-full">
        {sortedGames.map(game => (
          <div key={game._id} className="bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg flex flex-col transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-violet-400 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] h-[26rem]">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
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
