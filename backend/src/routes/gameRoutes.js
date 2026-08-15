const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Console = require('../models/Console');
const igdbService = require('../services/igdb.service');

// Search games on IGDB
router.get('/igdb-search', async (req, res) => {
  const { query, consoleId } = req.query;
  try {
    if (!query || !String(query).trim()) {
      return res.status(400).json({ message: 'A search query is required.' });
    }
    const consoleDoc = await Console.findById(consoleId);
    if (!consoleDoc || !consoleDoc.igdbId) {
      return res.status(400).json({ message: 'Invalid console or missing IGDB ID.' });
    }
    const games = await igdbService.searchGames(query, consoleDoc.igdbId);
    res.json(games);
  } catch (error) {
    res.status(502).json({ message: 'Error searching games from IGDB.', error: error.message });
  }
});

// Get collection statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Game.countDocuments({ isWishlist: false });
    const played = await Game.countDocuments({ isWishlist: false, status: 'Played' });
    res.json({ total, played });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
});

// Add a game to the catalog (from IGDB or manually)
router.post('/', async (req, res) => {
  const { name, console, igdbId, releaseDate, cover, criticRating, communityRating, userRating, status, isWishlist } = req.body;
  try {
    // IGDB identifies a game globally; a collection can contain it once per console.
    if (igdbId) {
      const existingGame = await Game.findOne({ igdbId, console });
      if (existingGame) {
        return res.status(409).json({ message: 'This game already exists in your catalog for this console.' });
      }
    }

    const newGame = new Game({
      name,
      console,
      igdbId: igdbId || null,
      releaseDate: releaseDate || null,
      cover: cover || null,
      criticRating: criticRating || null,
      communityRating: communityRating || null,
      userRating: userRating || null,
      status: status || (isWishlist ? 'I Wanna Play!' : 'Backlog'),
      isWishlist: isWishlist || false,
    });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: 'Error adding game', error });
  }
});

// Get all games
router.get('/', async (req, res) => {
  const { consoleId, isWishlist } = req.query;
  try {
    const filter = {};
    if (consoleId) {
      filter.console = consoleId;
    }
    if (isWishlist !== undefined) {
      filter.isWishlist = isWishlist === 'true';
    }
    const games = await Game.find(filter).populate('console');
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error });
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('console');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error });
  }
});

// Edit a game
router.put('/:id', async (req, res) => {
  const { name, releaseDate, cover, criticRating, userRating, status, isWishlist } = req.body;
  try {
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { name, releaseDate, cover, criticRating, userRating, status, isWishlist },
      { new: true, runValidators: true }
    );
    if (!updatedGame) return res.status(404).json({ message: 'Game not found' });
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: 'Error updating game', error });
  }
});

// Delete a game
router.delete('/:id', async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game', error });
  }
});

module.exports = router;
