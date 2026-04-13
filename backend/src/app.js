const express = require('express');
const cors = require('cors');
require('dotenv').config();

const consoleRoutes = require('./routes/consoleRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

// Use the cors middleware with a specific origin
const origin = process.env.VITE_BACKEND_URL ? process.env.VITE_BACKEND_URL.replace('/api', '') : 'http://localhost:5173';

app.use(cors({
  origin
}));

app.use(express.json());

app.use('/api/consoles', consoleRoutes);
app.use('/api/games', gameRoutes);

module.exports = app;

