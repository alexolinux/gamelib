// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importa a rota de consoles
const consoleRoutes = require('./routes/consoleRoutes');

// Importa a rota de games
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Adicione este middleware para permitir requisições de qualquer origem
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Define um prefixo comum para todas as rotas da API
app.use('/api/consoles', consoleRoutes);
app.use('/api/games', gameRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

/* // Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importa a rota de consoles
const consoleRoutes = require('./routes/consoleRoutes');

// Importa a rota de games
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Adicione este middleware para permitir requisições do frontend
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Gamelib está funcionando!');
});

// Define o prefixo '/api/consoles' para as rotas de console
app.use('/api/consoles', consoleRoutes);

// Define o prefixo p/ as rotas de games
app.use('/api/games', gameRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); */
