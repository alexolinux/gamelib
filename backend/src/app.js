const express = require('express');
const cors = require('cors');
require('dotenv').config();

const consoleRoutes = require('./routes/consoleRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

// Use the cors middleware with a specific origin
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/consoles', consoleRoutes);
app.use('/api/games', gameRoutes);

module.exports = app;
