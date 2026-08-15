const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Retained only to preserve records created before the IGDB migration.
  rawgId: {
    type: Number,
    sparse: true, // This is the crucial fix.
    default: null,
  },
  igdbId: {
    type: Number,
  },
}, { timestamps: true });

consoleSchema.index(
  { igdbId: 1 },
  { unique: true, partialFilterExpression: { igdbId: { $type: 'number' } } }
);

const Console = mongoose.model('Console', consoleSchema);

module.exports = Console;
