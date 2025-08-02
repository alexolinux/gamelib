// gamelib/backend/routes/consoleRoutes.js
const express = require('express');
const router = express.Router(); // Cria um roteador para lidar com as rotas de console
const Console = require('../models/Console'); // Importa o modelo Console
const Game = require('../models/Game'); // Importa o modelo Game

// --- Rotas para Gerenciamento de Consoles ---

// 1. Criar Nova Console (POST /api/consoles)
router.post('/', async (req, res) => {
  try {
    const { name } = req.body; // Pega o nome da console do corpo da requisição
    if (!name) {
      return res.status(400).json({ message: 'O nome da console é obrigatório.' });
    }

    const newConsole = new Console({ name });
    await newConsole.save(); // Salva a nova console no banco de dados
    res.status(201).json(newConsole); // Retorna a console criada com status 201 (Created)
  } catch (err) {
    if (err.code === 11000) { // Código de erro do MongoDB para duplicata (unique: true)
      return res.status(409).json({ message: 'Já existe uma console com este nome.' });
    }
    console.error('Erro ao criar console:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao criar console.' });
  }
});

// 2. Listar Todas as Consoles (GET /api/consoles)
router.get('/', async (req, res) => {
  try {
    const consoles = await Console.find().sort({ name: 1 }); // Busca todas as consoles e ordena por nome
    res.json(consoles); // Retorna a lista de consoles
  } catch (err) {
    console.error('Erro ao listar consoles:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao listar consoles.' });
  }
});

// 3. Deletar Console por ID (DELETE /api/consoles/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // **VERIFICAÇÃO CRÍTICA:** Verificar se existem jogos associados a esta console
    const associatedGamesCount = await Game.countDocuments({ console: id });
    if (associatedGamesCount > 0) {
      return res.status(400).json({
        message: 'Não é possível deletar esta console. Existem jogos associados a ela.',
        associatedGames: associatedGamesCount,
      });
    }

    const deletedConsole = await Console.findByIdAndDelete(id);

    if (!deletedConsole) {
      return res.status(404).json({ message: 'Console não encontrada.' });
    }
    res.json({ message: 'Console deletada com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar console:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar console.' });
  }
});

// 4. Limpar Dados de uma Console (POST /api/consoles/:id/clear-games)
// Implementação real desta funcionalidade: remover todos os jogos de uma console.
router.post('/:id/clear-games', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a console existe
    const existingConsole = await Console.findById(id);
    if (!existingConsole) {
      return res.status(404).json({ message: 'Console não encontrada.' });
    }

    // Remover todos os jogos associados a esta console
    const result = await Game.deleteMany({ console: id });

    res.status(200).json({
      message: `Todos os ${result.deletedCount} jogos da console "${existingConsole.name}" foram removidos.`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Erro ao limpar jogos da console:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao limpar jogos da console.' });
  }
});

module.exports = router; // Exporta o roteador para ser usado no arquivo principal do backend
