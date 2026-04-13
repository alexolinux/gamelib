const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  console: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Console',
    required: true,
  },
  isWishlist: {
    type: Boolean,
    default: false,
  },
  rawgId: {
    type: Number,
    unique: true,
    sparse: true,
    default: null,
  },
  releaseDate: Date,
  cover: String,
  metacriticRating: Number,
  userRating: {
    type: Number,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['Backlog', 'Played', 'I Wanna Play!'],
    default: 'Backlog',
  },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
