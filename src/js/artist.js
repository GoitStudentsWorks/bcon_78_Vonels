import axios from 'axios';

export const BASE_URL = 'https://sound-wave.b.goit.study';
export const PER_PAGE = 8;

export async function getArtists(page = 1, params = {}) {
  const requestParams = {
    limit: PER_PAGE,
    page,
    ...params,
  };

  try {
    const response = await axios.get(`${BASE_URL}/api/artists`, {
      params: requestParams,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchGenres() {
  try {
    const response = await axios.get(`${BASE_URL}/api/genres`);
    const data = response.data;

    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.name || item.genre || item.title || String(item);
        }
        return String(item);
      });
    }

    if (typeof data === 'object' && data !== null) {
      return Object.values(data).map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.name || item.genre || item.title || String(item);
        }
        return String(item);
      });
    }

    return [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}
