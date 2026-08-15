/*
 * Promotes legacy Metacritic values to the provider-neutral criticRating field.
 * Legacy metacriticRating is retained for traceability. Dry run by default.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const Game = require('../src/models/Game');

const apply = process.argv.includes('--apply');

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be configured.');
  await mongoose.connect(process.env.MONGO_URI);

  const games = await Game.find({
    metacriticRating: { $type: 'number' },
    criticRating: { $exists: false },
  }).lean();
  const report = {
    mode: apply ? 'apply' : 'dry-run',
    migrated: games.map((game) => ({ id: game._id, name: game.name, criticRating: game.metacriticRating })),
  };

  if (apply && games.length) {
    await Game.bulkWrite(games.map((game) => ({
      updateOne: { filter: { _id: game._id }, update: { $set: { criticRating: game.metacriticRating } } },
    })));
  }

  console.log(JSON.stringify(report, null, 2));
  if (!apply) console.log('\nDry-run complete. Rerun with --apply only after reviewing the report.');
}

main()
  .catch((error) => {
    console.error('Rating fields migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
