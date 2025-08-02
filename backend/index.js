// gamelib/backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const consoleRoutes = require('./routes/consoleRoutes'); // Importa as rotas de console
const gameRoutes = require('./routes/gameRoutes'); // Importa as rotas de jogo

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamelib';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB!'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rota de teste inicial
app.get('/', (req, res) => {
  res.send('API Gamelib está funcionando!');
});

// Use as rotas de console, prefixadas com '/api/consoles'
app.use('/api/consoles', consoleRoutes); // Agora as rotas de console estão ativas
// Use as rotas de jogo, prefixadas com '/api/games'
app.use('/api/games', gameRoutes); // Agora as rotas de jogo estão ativas

// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});
