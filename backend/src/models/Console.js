const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rawgId: {
    type: Number,
    unique: true,
    sparse: true, // This is the crucial fix.
    default: null,
  },
}, { timestamps: true });

const Console = mongoose.model('Console', consoleSchema);

module.exports = Console;
