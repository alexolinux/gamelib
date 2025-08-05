const Game = require('../models/Game');
const axios = require('axios');

// URL base da API RAWG.io e sua chave
const RAWG_API_URL = 'https://api.rawg.io/api/games';
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Lógica para adicionar um novo jogo manualmente
const addGameManually = async (req, res) => {
  try {
    const { name, releaseDate, cover, metacriticRating, userRating, status, isWishlist, console } = req.body;

    const newGame = new Game({
      name,
      releaseDate,
      cover,
      metacriticRating,
      userRating,
      status,
      isWishlist,
      console
    });

    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lógica para buscar e adicionar um jogo da RAWG.io
const addGameFromRawg = async (req, res) => {
  try {
    const { gameName, consoleId } = req.body;

    if (!gameName || !consoleId) {
      return res.status(400).json({ message: 'Nome do jogo e ID do console são obrigatórios.' });
    }

    // Faz uma requisição para a API da RAWG.io para buscar o jogo
    const response = await axios.get(RAWG_API_URL, {
      params: {
        key: RAWG_API_KEY,
        search: gameName,
        platforms: consoleId, // Filtra por console
      }
    });

    const gameData = response.data.results[0]; // Pega o primeiro resultado da busca

    if (!gameData) {
      return res.status(404).json({ message: 'Jogo não encontrado na RAWG.io.' });
    }

    // Cria uma nova instância do modelo Game com os dados da API
    const newGame = new Game({
      name: gameData.name,
      releaseDate: gameData.released,
      cover: gameData.background_image,
      metacriticRating: gameData.metacritic,
      console: consoleId, // ID do console que foi enviado na requisição
      // O status e o rating do usuário serão definidos com os valores padrão do schema
    });

    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ou adicionar jogo da RAWG.io.', error: error.message });
  }
};

// Lógica para editar um jogo existente
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, releaseDate, cover, metacriticRating, userRating, status, isWishlist, console } = req.body;

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      { name, releaseDate, cover, metacriticRating, userRating, status, isWishlist, console },
      { new: true, runValidators: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lógica para deletar um jogo
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }

    res.status(200).json({ message: 'Jogo deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lógica para buscar e listar jogos
const getGames = async (req, res) => {
  try {
    const { name } = req.query; // Pega o parâmetro 'name' da URL
    let games;

    if (name) {
      // Se um nome for fornecido, busca jogos que contêm o nome
      games = await Game.find({
        name: { $regex: name, $options: 'i' }
      }).populate('console');
    } else {
      // Se nenhum nome for fornecido, lista todos os jogos
      games = await Game.find().populate('console');
    }

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGameManually,
  addGameFromRawg,
  updateGame,
  deleteGame,
  getGames
};
