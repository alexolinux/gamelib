// gamelib/backend/models/Console.js
const mongoose = require('mongoose');

// Define o esquema (schema) para o modelo Console
const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,      // O nome da console é obrigatório
    unique: true,        // Garante que cada nome de console seja único no banco de dados
    trim: true           // Remove espaços em branco do início e fim
  },
  // Você pode adicionar outros campos aqui no futuro, como fabricante, ano de lançamento, etc.
  // <-- NOVO CAMPO -->
  rawgPlatformId: {
    type: Number,    // O ID da plataforma no RAWG.io (ex: PC=4, PlayStation 5=187)
    unique: true,    // Garante unicidade, se necessário
    sparse: true,    // Permite que seja nulo (para consoles sem um ID RAWG.io correspondente)
    default: null
  }
}, {
  timestamps: true // Adiciona automaticamente campos 'createdAt' e 'updatedAt'
});

// Cria e exporta o modelo 'Console' baseado no esquema definido
module.exports = mongoose.model('Console', consoleSchema);
