/*
 * Links existing Gamelib records to IGDB without replacing user data.
 * Run with --apply only after reviewing the default dry-run report.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const Console = require('../src/models/Console');
const Game = require('../src/models/Game');
const igdb = require('../src/services/igdb.service');

const apply = process.argv.includes('--apply');

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be configured.');
  await mongoose.connect(process.env.MONGO_URI);

  const report = {
    mode: apply ? 'apply' : 'dry-run',
    consoles: { linked: [], alreadyLinked: [], unmatched: [] },
    games: { linked: [], alreadyLinked: [], skipped: [], unmatched: [], ambiguous: [] },
  };

  const platforms = await igdb.getPlatforms();
  const consoles = await Console.find().lean();
  const consoleById = new Map(consoles.map((consoleDoc) => [String(consoleDoc._id), consoleDoc]));

  for (const consoleDoc of consoles) {
    if (consoleDoc.igdbId != null) {
      report.consoles.alreadyLinked.push({ id: consoleDoc._id, name: consoleDoc.name, igdbId: consoleDoc.igdbId });
      continue;
    }

    const matches = platforms.filter((platform) => normalize(platform.name) === normalize(consoleDoc.name));
    if (matches.length !== 1) {
      report.consoles.unmatched.push({ id: consoleDoc._id, name: consoleDoc.name, candidates: matches });
      continue;
    }

    const platform = matches[0];
    if (apply) await Console.updateOne({ _id: consoleDoc._id }, { $set: { igdbId: platform.id } });
    consoleDoc.igdbId = platform.id;
    report.consoles.linked.push({ id: consoleDoc._id, name: consoleDoc.name, igdbId: platform.id });
  }

  const games = await Game.find().lean();
  for (const game of games) {
    if (game.igdbId != null) {
      report.games.alreadyLinked.push({ id: game._id, name: game.name, igdbId: game.igdbId });
      continue;
    }

    const consoleDoc = consoleById.get(String(game.console));
    if (!consoleDoc?.igdbId) {
      report.games.skipped.push({ id: game._id, name: game.name, reason: 'console has no IGDB ID' });
      continue;
    }

    const candidates = await igdb.searchGamesForMigration(game.name, consoleDoc.igdbId);
    const exactMatches = candidates.filter((candidate) => normalize(candidate.name) === normalize(game.name));
    if (exactMatches.length === 0) {
      report.games.unmatched.push({ id: game._id, name: game.name, console: consoleDoc.name, candidates });
      continue;
    }
    if (exactMatches.length > 1) {
      report.games.ambiguous.push({ id: game._id, name: game.name, console: consoleDoc.name, candidates: exactMatches });
      continue;
    }

    const match = exactMatches[0];
    if (apply) await Game.updateOne({ _id: game._id }, { $set: { igdbId: match.id } });
    report.games.linked.push({ id: game._id, name: game.name, console: consoleDoc.name, igdbId: match.id });
  }

  // The old schemas created unique indexes for rawgId. They are no longer useful
  // and can block later manual records, while the data itself remains untouched.
  if (apply) {
    for (const collection of [Console.collection, Game.collection]) {
      try {
        await collection.dropIndex('rawgId_1');
      } catch (error) {
        if (error.codeName !== 'IndexNotFound') throw error;
      }
    }
  }

  console.log(JSON.stringify(report, null, 2));
  if (!apply) console.log('\nDry-run complete. Review unmatched/ambiguous records, then rerun with --apply.');
}

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
