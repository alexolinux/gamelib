const axios = require('axios');

exports.getPlatforms = async () => {
  try {
    const API_KEY = process.env.RAWG_API_KEY;
    const { data } = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
    return data.results;
  } catch (error) {
    console.error('Error fetching platforms from RAWG.io:', error.response ? error.response.data : error.message);
    return [];
  }
};

exports.searchGames = async (query, platformId) => {
  try {
    const API_KEY = process.env.RAWG_API_KEY;
    const { data } = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        key: API_KEY,
        search: query,
        platforms: platformId,
      },
    });
    return data.results;
  } catch (error) {
    console.error('Error searching games on RAWG.io:', error.response ? error.response.data : error.message);
    return [];
  }
};

exports.getGameDetails = async (gameId) => {
  try {
    const API_KEY = process.env.RAWG_API_KEY;
    const { data } = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
    return data;
  } catch (error) {
    console.error('Error fetching game details from RAWG.io:', error.response ? error.response.data : error.message);
    return null;
  }
};
