// gamelib/backend/services/rawgService.js
const axios = require('axios'); // Vamos usar axios para fazer requisições HTTP

const RAWG_API_URL = 'https://api.rawg.io/api';
const RAWG_API_KEY = process.env.RAWG_API_KEY; // A chave da API é carregada das variáveis de ambiente

// Verifica se a chave da API está configurada
if (!RAWG_API_KEY) {
  console.error('❌ RAWG_API_KEY não definida no ambiente. A integração com RAWG.io não funcionará.');
}

// Função para buscar jogos pelo nome
async function searchGames(query, page = 1, pageSize = 20, platformId = null) {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API Key não configurada.');
  }
  try {
    const params = {
      key: RAWG_API_KEY,
      search: query,
      page: page,
      page_size: pageSize,
    };

    if (platformId) { // Adiciona o filtro de plataforma se um ID for fornecido
      params.platforms = platformId;
    }

    const response = await axios.get(`${RAWG_API_URL}/games`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jogos no RAWG.io:', error.message);
    throw new Error('Falha ao buscar jogos no RAWG.io.');
  }
}

// Função para obter detalhes de um jogo específico pelo ID
async function getGameDetails(gameId) {
  if (!RAWG_API_KEY) {
    throw new Error('RAWG API Key não configurada.');
  }
  try {
    const response = await axios.get(`${RAWG_API_URL}/games/${gameId}`, {
      params: {
        key: RAWG_API_KEY,
      },
    });
    return response.data; // Retorna os detalhes do jogo
  } catch (error) {
    console.error(`Erro ao obter detalhes do jogo ${gameId} no RAWG.io:`, error.message);
    throw new Error('Falha ao obter detalhes do jogo no RAWG.io.');
  }
}

module.exports = {
  searchGames,
  getGameDetails,
};
