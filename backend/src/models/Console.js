const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  rawgId: {
    type: Number,
    default: null
  }
});

const Console = mongoose.model('Console', consoleSchema);

module.exports = Console;
