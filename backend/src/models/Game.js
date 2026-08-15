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
  // Retained only to preserve records created before the IGDB migration.
  rawgId: {
    type: Number,
    sparse: true,
    default: null,
  },
  igdbId: {
    type: Number,
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

gameSchema.index(
  { console: 1, igdbId: 1 },
  { unique: true, partialFilterExpression: { igdbId: { $type: 'number' } } }
);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
