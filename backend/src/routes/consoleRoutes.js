const express = require('express');
const router = express.Router();
const Console = require('../models/Console');
const Game = require('../models/Game');
const igdbService = require('../services/igdb.service');

// Get all IGDB platforms for the dropdown list
router.get('/igdb-platforms', async (req, res) => {
  try {
    const platforms = await igdbService.getPlatforms();
    const formattedPlatforms = platforms.map(p => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name));
    res.json(formattedPlatforms);
  } catch (error) {
    res.status(502).json({ message: 'Error fetching platforms from IGDB.', error: error.message });
  }
});

// Get all consoles from the database
router.get('/', async (req, res) => {
  try {
    const consoles = await Console.find();
    res.json(consoles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consoles', error });
  }
});

// Create a new console
router.post('/', async (req, res) => {
  const { name, igdbId } = req.body;
  try {
    const newConsole = new Console({ 
      name, 
      igdbId: igdbId ? Number(igdbId) : null
    });
    await newConsole.save();
    res.status(201).json(newConsole);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A console with this name or IGDB ID already exists.' });
    }
    res.status(400).json({ message: 'Error creating console', error: error.message });
  }
});

// Edit a console (only manually added ones)
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const updatedConsole = await Console.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!updatedConsole) return res.status(404).json({ message: 'Console not found' });
    res.json(updatedConsole);
  } catch (error) {
    res.status(400).json({ message: 'Error updating console', error });
  }
});

// Delete a console
router.delete('/:id', async (req, res) => {
  try {
    const gamesCount = await Game.countDocuments({ console: req.params.id });
    if (gamesCount > 0) {
      return res.status(400).json({ message: 'Cannot delete console with associated games. Please clear games first.' });
    }

    const deletedConsole = await Console.findByIdAndDelete(req.params.id);
    if (!deletedConsole) return res.status(404).json({ message: 'Console not found' });

    res.json({ message: 'Console deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting console', error });
  }
});

// Clear all games associated with a console
router.delete('/:id/games', async (req, res) => {
  try {
    const result = await Game.deleteMany({ console: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No games found for this console' });
    }
    res.json({ message: `${result.deletedCount} games deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing games from console', error });
  }
});

module.exports = router;
