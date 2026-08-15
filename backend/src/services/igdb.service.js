const axios = require('axios');

const IGDB_BASE_URL = 'https://api.igdb.com/v4';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

let accessToken;
let accessTokenExpiresAt = 0;

function escapeIgdbSearch(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be configured.');
  }

  const { data } = await axios.post(TWITCH_TOKEN_URL, null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    },
  });

  accessToken = data.access_token;
  // Refresh one minute early, so a request never starts with a nearly-expired token.
  accessTokenExpiresAt = Date.now() + Math.max(data.expires_in - 60, 0) * 1000;
  return accessToken;
}

async function query(endpoint, body) {
  const token = await getAccessToken();
  const { data } = await axios.post(`${IGDB_BASE_URL}/${endpoint}`, body, {
    headers: {
      Accept: 'application/json',
      'Client-ID': process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

function coverUrl(url) {
  if (!url) return null;
  const imageUrl = url.replace('t_thumb', 't_cover_big');
  return imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
}

exports.getPlatforms = async () => query('platforms', 'fields id,name; sort name asc; limit 500;');

exports.searchGames = async (searchTerm, platformId) => {
  const search = escapeIgdbSearch(searchTerm);
  const games = await query(
    'games',
    `search "${search}"; fields id,name,first_release_date,cover.url,aggregated_rating,rating,total_rating,platforms; where platforms = (${Number(platformId)}) & version_parent = null; limit 25;`
  );

  return games.map((game) => ({
    id: game.id,
    name: game.name,
    releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null,
    cover: coverUrl(game.cover?.url),
    criticRating: game.aggregated_rating ?? null,
    communityRating: game.rating ?? game.total_rating ?? null,
  }));
};

exports.getGameRatings = async (igdbId) => {
  const games = await query('games', `fields rating,total_rating; where id = ${Number(igdbId)}; limit 1;`);
  return games[0] || null;
};

// Exported for the one-off migration script. Application routes use the normalized methods above.
exports.searchGamesForMigration = (searchTerm, platformId) => exports.searchGames(searchTerm, platformId);
