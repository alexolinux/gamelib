// gamelib/backend/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // Referência ao modelo Console. Isso cria uma ligação entre Game e Console.
  console: {
    type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar outro documento
    ref: 'Console',                      // Nome do modelo referenciado
    required: true,
  },
  // Informações da API RAWG.io
  rawgId: {
    type: Number, // ID do jogo no RAWG.io
    unique: true, // Garante que não teremos jogos duplicados do RAWG.io
    sparse: true, // Permite que este campo seja nulo para jogos adicionados manualmente
  },
  rawgDetails: {
    type: Object, // Armazenar detalhes completos do jogo do RAWG.io (ex: capa, descrição, etc.)
    default: {},
  },
  // Status do Jogo
  status: {
    type: String,
    enum: ['Played', 'Backlog', 'I Wanna Play It!', 'Wishlist'], // Opções permitidas para o status
    default: 'Backlog', // Status padrão ao adicionar um jogo
    required: true,
  },
  // Avaliação Pessoal
  personalRating: {
    type: Number,
    min: 0,
    max: 5, // Rating de 0 a 5, por exemplo. Você pode ajustar isso.
    default: null, // Nulo se ainda não avaliado
  },
  releaseDate: {
    type: Date,
    default: null,
  },
  coverImage: { // Para upload manual ou URL do RAWG.io
    type: String,
    default: null,
  },
  metacriticScore: { // Pontuação do Metacritic (pode ser obtida do RAWG.io ou manualmente)
    type: Number,
    default: null,
  },
  // Adicione outros campos conforme a necessidade
}, {
  timestamps: true, // Adiciona 'createdAt' e 'updatedAt'
});

module.exports = mongoose.model('Game', gameSchema);
