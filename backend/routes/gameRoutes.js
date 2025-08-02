// gamelib/backend/routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Console = require('../models/Console'); // Precisamos do modelo Console para validação
const rawgService = require('../services/rawgService'); // Importa o serviço RAWG.io

// --- Rotas para Gerenciamento de Jogos ---

// 1. Pesquisar Jogo via RAWG.io 
// (GET /api/games/search-rawg?query=<nome_do_jogo>&consoleId=<id_da_console_gamelib>)
router.get('/search-rawg', async (req, res) => {
  try {
    const { query, consoleId } = req.query; // Pega o consoleId também
    if (!query) {
      return res.status(400).json({ message: 'O parâmetro de busca (query) é obrigatório.' });
    }

    let rawgPlatformId = null;
    if (consoleId) {
      const selectedConsole = await Console.findById(consoleId);
      if (selectedConsole && selectedConsole.rawgPlatformId) {
        rawgPlatformId = selectedConsole.rawgPlatformId;
      } else if (consoleId) { // Se o consoleId foi fornecido mas não tem rawgPlatformId
        console.warn(`Console ${selectedConsole ? selectedConsole.name : consoleId} não tem rawgPlatformId mapeado. A busca RAWG.io não será filtrada por plataforma.`);
        // Não precisamos retornar um erro aqui, apenas avisar que não vai filtrar
      }
    }

    // Passa o rawgPlatformId para o serviço de busca
    const results = await rawgService.searchGames(query, 1, 20, rawgPlatformId);
    res.json(results);
  } catch (err) {
    console.error('Erro na busca RAWG:', err);
    res.status(500).json({ message: err.message || 'Erro interno do servidor ao buscar no RAWG.io.' });
  }
});

// 2. Adicionar Novo Jogo (POST /api/games)
// Este endpoint pode ser usado tanto para adicionar um jogo do RAWG.io quanto manualmente.
router.post('/', async (req, res) => {
  try {
    const {
      title,
      consoleId, // O ID da console a qual o jogo pertence
      status = 'Backlog', // Padrão 'Backlog' se não especificado
      personalRating,
      releaseDate,
      coverImage,
      metacriticScore,
      rawgId, // Opcional, se o jogo vier do RAWG.io
      rawgDetails, // Opcional, se o jogo vier do RAWG.io
    } = req.body;

    // Validação básica
    if (!title || !consoleId) {
      return res.status(400).json({ message: 'Título do jogo e ID da console são obrigatórios.' });
    }

    // Verificar se a console existe
    const existingConsole = await Console.findById(consoleId);
    if (!existingConsole) {
      return res.status(404).json({ message: 'Console não encontrada.' });
    }

    // Se um rawgId for fornecido, verificar se o jogo já existe para evitar duplicatas
    if (rawgId) {
      const existingGame = await Game.findOne({ rawgId, console: consoleId });
      if (existingGame) {
        return res.status(409).json({ message: 'Este jogo do RAWG.io já está adicionado para esta console.' });
      }
    }

    const newGame = new Game({
      title,
      console: consoleId,
      status,
      personalRating,
      releaseDate,
      coverImage,
      metacriticScore,
      rawgId,
      rawgDetails,
    });

    await newGame.save();
    // Popula o campo 'console' com os detalhes da console para a resposta
    await newGame.populate('console'); // Mongoose vai preencher o objeto 'console'

    res.status(201).json(newGame);
  } catch (err) {
    console.error('Erro ao adicionar jogo:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao adicionar jogo.' });
  }
});

// 3. Listar Jogos (GET /api/games)
// Pode filtrar por console ID e status, e pesquisar por título.
router.get('/', async (req, res) => {
  try {
    const { consoleId, status, search } = req.query;
    const filter = {};

    if (consoleId) {
      filter.console = consoleId;
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // Busca case-insensitive
    }

    // Popula o campo 'console' para obter os detalhes da console junto com o jogo
    const games = await Game.find(filter).populate('console').sort({ title: 1 });
    res.json(games);
  } catch (err) {
    console.error('Erro ao listar jogos:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao listar jogos.' });
  }
});

// 4. Obter Detalhes de um Jogo Específico (GET /api/games/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id).populate('console');
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }
    res.json(game);
  } catch (err) {
    console.error('Erro ao buscar jogo por ID:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar jogo.' });
  }
});


// 5. Atualizar/Editar Jogo (PUT /api/games/:id)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, consoleId, status, personalRating, releaseDate, coverImage, metacriticScore } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (consoleId) {
      const existingConsole = await Console.findById(consoleId);
      if (!existingConsole) {
        return res.status(404).json({ message: 'Console não encontrada.' });
      }
      updates.console = consoleId;
    }
    if (status) updates.status = status;
    if (personalRating !== undefined) updates.personalRating = personalRating;
    if (releaseDate !== undefined) updates.releaseDate = releaseDate;
    if (coverImage !== undefined) updates.coverImage = coverImage;
    if (metacriticScore !== undefined) updates.metacriticScore = metacriticScore;

    const updatedGame = await Game.findByIdAndUpdate(id, updates, { new: true }).populate('console'); // {new: true} retorna o documento atualizado

    if (!updatedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }
    res.json(updatedGame);
  } catch (err) {
    console.error('Erro ao atualizar jogo:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar jogo.' });
  }
});

// 6. Remover Jogo Existente (DELETE /api/games/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }
    res.json({ message: 'Jogo removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover jogo:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao remover jogo.' });
  }
});

// 7. Marcar Jogo como 'Played', 'Backlog' ou 'I Wanna Play It!' (PATCH /api/games/:id/status)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Played', 'Backlog', 'I Wanna Play It!'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Use Played, Backlog ou I Wanna Play It!.' });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('console');

    if (!updatedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }
    res.json(updatedGame);
  } catch (err) {
    console.error('Erro ao atualizar status do jogo:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar status do jogo.' });
  }
});

// 8. Adicionar à Wishlist / Mover para Wishlist (PATCH /api/games/:id/wishlist)
router.patch('/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedGame = await Game.findByIdAndUpdate(
      id,
      { status: 'Wishlist' }, // Altera o status para Wishlist
      { new: true }
    ).populate('console');

    if (!updatedGame) {
      return res.status(404).json({ message: 'Jogo não encontrado.' });
    }
    res.json(updatedGame);
  } catch (err) {
    console.error('Erro ao mover jogo para Wishlist:', err);
    res.status(500).json({ message: 'Erro interno do servidor ao mover jogo para Wishlist.' });
  }
});


module.exports = router;
