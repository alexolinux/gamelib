const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Rota para buscar e listar jogos
router.get('/', gameController.getGames);

// Rota para adicionar um jogo manualmente
router.post('/', gameController.addGameManually);

// Rota para adicionar um jogo via RAWG.io
router.post('/rawg', gameController.addGameFromRawg);

// Rota para editar um jogo
router.put('/:id', gameController.updateGame);

// Rota para deletar um jogo
router.delete('/:id', gameController.deleteGame);

module.exports = router;
