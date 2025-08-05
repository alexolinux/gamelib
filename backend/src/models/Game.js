const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  releaseDate: {
    type: Date,
    default: null,
  },
  cover: {
    type: String, // URL da imagem da capa
    default: null,
  },
  metacriticRating: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  userRating: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  status: {
    type: String,
    enum: ['Backlog', 'Played', 'I Wanna Play!'],
    default: 'Backlog',
  },
  isWishlist: {
    type: Boolean,
    default: false,
  },
  // Referência ao console, crucial para o requisito de associação
  console: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Console',
    required: true,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
