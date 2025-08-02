// gamelib/frontend/src/components/GameCard.jsx
import React from 'react';
import './GameCard.css'; // Vamos criar este CSS em breve

function GameCard({ game, onUpdateStatus, onRemoveGame, onAddToWishlist, isWishlist }) {
  // Funções de tratamento de evento
  const handleStatusChange = (e) => {
    onUpdateStatus(game._id, e.target.value);
  };

  const handleRemoveClick = () => {
    onRemoveGame(game._id, game.title);
  };

  const handleAddToWishlistClick = () => {
    onAddToWishlist(game._id, game.title);
  };

  return (
    <div className="game-card">
      <img
        src={game.coverImage || 'https://via.placeholder.com/150x200?text=Sem+Capa'}
        alt={game.title}
        onError={(e) => { // Lida com imagens quebradas
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/150x200?text=Erro+Capa';
        }}
      />
      <div className="game-info">
        <h5>{game.title}</h5>
        <p>Console: {game.console ? game.console.name : 'N/A'}</p>
        <p>Status: {game.status}</p>
        {game.personalRating !== null && game.personalRating !== undefined && (
          <p>Avaliação Pessoal: {game.personalRating}/5</p>
        )}
        {game.metacriticScore !== null && game.metacriticScore !== undefined && (
          <p>Metacritic: {game.metacriticScore}</p>
        )}
        {game.releaseDate && (
            <p>Lançamento: {new Date(game.releaseDate).toLocaleDateString()}</p>
        )}

        <div className="game-actions">
          {isWishlist ? (
            // Ações para jogos na Wishlist
            <button onClick={() => onUpdateStatus(game._id, 'Backlog')}>
              Mover para Backlog
            </button>
          ) : (
            // Ações para jogos no catálogo principal
            <>
              <select value={game.status} onChange={handleStatusChange}>
                <option value="Backlog">Backlog</option>
                <option value="Played">Played</option>
                <option value="I Wanna Play It!">I Wanna Play It!</option>
              </select>
              <button onClick={handleAddToWishlistClick}>Mover para Wishlist</button>
            </>
          )}
          <button onClick={handleRemoveClick} className="delete-btn">
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
