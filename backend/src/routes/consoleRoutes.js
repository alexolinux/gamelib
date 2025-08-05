const express = require('express');
const router = express.Router();
const consoleController = require('../controllers/consoleController');

// Rota para buscar e listar consoles (ESTA ROTA ESTAVA FALTANDO)
router.get('/', consoleController.getConsoles);

// Rota para criar um novo console
router.post('/', consoleController.createConsole);

// Rota para editar um console existente
router.put('/:id', consoleController.updateConsole);

// Rota para deletar um console
router.delete('/:id', consoleController.deleteConsole);

// Rota para limpar todos os jogos de um console
router.delete('/:id/clear-games', consoleController.clearConsole);

module.exports = router;
