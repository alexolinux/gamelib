const Console = require('../models/Console');
const Game = require('../models/Game');

// Lógica para obter a lista de consoles
const getConsoles = async (req, res) => {
  try {
    const consoles = await Console.find({});
    res.status(200).json(consoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lógica para criar um novo console
const createConsole = async (req, res) => {
  try {
    const newConsole = new Console(req.body);
    const savedConsole = await newConsole.save();
    res.status(201).json(savedConsole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lógica para editar um console
const updateConsole = async (req, res) => {
  try {
    const updatedConsole = await Console.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedConsole) return res.status(404).json({ message: 'Console não encontrado.' });
    res.status(200).json(updatedConsole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lógica para deletar um console
const deleteConsole = async (req, res) => {
  try {
    const deletedConsole = await Console.findByIdAndDelete(req.params.id);
    if (!deletedConsole) return res.status(404).json({ message: 'Console não encontrado.' });
    res.status(200).json({ message: 'Console excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lógica para limpar todos os jogos de um console
const clearConsole = async (req, res) => {
  try {
    const consoleId = req.params.id;
    await Game.deleteMany({ console: consoleId });
    res.status(200).json({ message: 'Todos os jogos do console foram removidos.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConsoles,
  createConsole,
  updateConsole,
  deleteConsole,
  clearConsole,
};
