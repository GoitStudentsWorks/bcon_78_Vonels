import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {
  createArtistCards,
  showArtistsLoader,
  hideArtistsLoader,
  showArtistsLoadMoreButton,
  hideArtistsLoadMoreButton,
  clearArtistsList,
} from './artisterror';
// svvvsddsv
const BASE_URL = 'https://sound-wave.b.goit.study'; 
const PER_PAGE = 8;

export async function getArtists(page = 1) {
  const params = {
    limit: PER_PAGE,
    page: page,
  };

  try {
    const response = await axios.get(`${BASE_URL}/api/artists`, { params });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const loadMoreBtn = document.querySelector('.artists-load-more-btn');

let currentArtistPage = 1;
let totalArtistPages = 0;

async function fetchArtists() {
  showArtistsLoader();
  hideArtistsLoadMoreButton();

  try {
    const data = await getArtists(currentArtistPage);
    const artists = data.artists;
    const totalItems = data.totalArtists;

    totalArtistPages = Math.ceil(totalItems / PER_PAGE);

    createArtistCards(artists);

    if (artists.length === 0) {
      iziToast.error({
        title: 'Поиск не дал результатов',
        message: 'К сожалению, по вашему запросу артистов не найдено.',
        position: 'topRight',
      });
      return;
    }

    if (currentArtistPage < totalArtistPages) {
      showArtistsLoadMoreButton();
    } else {
      hideArtistsLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Ошибка',
      message: `Ошибка запроса: ${error.message}`,
      position: 'topRight',
    });
    hideArtistsLoadMoreButton();
  } finally {
    hideArtistsLoader();
  }
}

loadMoreBtn.addEventListener('click', async () => {
  currentArtistPage += 1;
  await fetchArtists();
});
// Auto-fetch disabled - filtererror.js now handles initial loading
// fetchArtists();
