/*
 * Repairs records created by the first IGDB migration implementation, which
 * incorrectly stored IGDB's total rating in userRating (the personal score).
 * It is a dry run unless --apply is explicitly passed.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const Game = require('../src/models/Game');
const igdb = require('../src/services/igdb.service');

const apply = process.argv.includes('--apply');
const EPSILON = 0.0001;

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be configured.');
  await mongoose.connect(process.env.MONGO_URI);

  const report = { mode: apply ? 'apply' : 'dry-run', repaired: [], skipped: [] };
  const games = await Game.find({
    igdbId: { $type: 'number' },
    communityRating: { $exists: false },
    userRating: { $type: 'number' },
  }).lean();

  for (const game of games) {
    const igdbGame = await igdb.getGameRatings(game.igdbId);
    const incorrectlySavedRating = igdbGame?.total_rating ?? igdbGame?.rating;
    if (incorrectlySavedRating == null || Math.abs(game.userRating - incorrectlySavedRating) > EPSILON) {
      report.skipped.push({ id: game._id, name: game.name, reason: 'personal rating does not match the old IGDB value' });
      continue;
    }

    const communityRating = igdbGame.rating ?? igdbGame.total_rating;
    if (apply) {
      await Game.updateOne(
        { _id: game._id },
        { $set: { communityRating }, $unset: { userRating: 1 } }
      );
    }
    report.repaired.push({ id: game._id, name: game.name, communityRating });
  }

  console.log(JSON.stringify(report, null, 2));
  if (!apply) console.log('\nDry-run complete. Rerun with --apply only after reviewing the report.');
}

main()
  .catch((error) => {
    console.error('Rating repair failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
