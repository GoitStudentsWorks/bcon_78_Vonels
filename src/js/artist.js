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
// import { data } from 'jquery';
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

async function fetchArtists(page = 1, bool = false) {
  showArtistsLoader();
//   hideArtistsLoadMoreButton();

  try {
    const data = await getArtists(page);
    const artists = data.artists;
    const totalItems = data.totalArtists;

    totalArtistPages = Math.ceil(totalItems / PER_PAGE);

      createArtistCards(artists);
      renderPagination(page, totalArtistPages)

      if (bool) {
          document.querySelector('.artists-list').scrollIntoView({ behavior: 'smooth' });
      }

    if (artists.length === 0) {
      iziToast.error({
        title: 'Поиск не дал результатов',
        message: 'К сожалению, по вашему запросу артистов не найдено.',
        position: 'topRight',
      });
      return;
    }

    // if (currentArtistPage < totalArtistPages) {
    //   showArtistsLoadMoreButton();
    // } else {
    //   hideArtistsLoadMoreButton();
    // }
  } catch (error) {
    iziToast.error({
      title: 'Ошибка',
      message: `Ошибка запроса: ${error.message}`,
      position: 'topRight',
    });
    // hideArtistsLoadMoreButton();
  } finally {
    hideArtistsLoader();
  }
}

// loadMoreBtn.addEventListener('click', async () => {
//   currentArtistPage += 1;
//   await fetchArtists();
// });

fetchArtists();

const paginationEl = document.querySelector('.pagination');
// function renderPagination(currentPage, totalPages) {
//     paginationEl.innerHTML = '';
//     let markup = '';
//     if (totalPages <= 4) {
//         for (let i = 1; i <= totalPages; i++) {
//         markup += `<button class="paginationBtn ${i === currentPage?'active':''}" data-page="${i}">${i}</button>`;
//     }
//         paginationEl.innerHTML = markup;
//         return;
//     }
//     for (let i = 1; i <= 3; i++) {
//         markup += `<button class="paginationBtn" data-page="${i}">${i}</button>`;
//     }
//     markup += `<span class="pagination-dots">...</span>`;
//     markup += `<button class="paginationBtn ${totalPages === currentPage?'active':''}" data-page="${totalPages}">${totalPages}</button>`;
//     paginationEl.innerHTML = markup;    
// }

// paginationEl.addEventListener('click', (e) => {
//     if (!e.target.classList.contains('paginationBtn')) return;
//     const page = Number(e.target.dataset.page);
//     fetchArtists(page);
// })
// const paginationEl = document.querySelector('.pagination-list');

function createButton(page, text, currentPage, totalPages) {
    const isActive = page === currentPage ? ' active' : '';
    const isDots = text === '...' ? ' pagination-dots' : '';
    const isDisabled =
        text === '...' ? ' disabled'
        : (text === 'Prev' && currentPage === 1) ? ' disabled'
        : (text === 'Next' && currentPage === totalPages) ? ' disabled'
        : '';

    return `
        <button 
            class="paginationBtn${isActive}${isDots}${isDisabled}" 
            data-page="${page}"
            ${isDisabled ? 'disabled' : ''}
        >
            ${text}
        </button>
    `;
}

export function renderPagination(currentPage, totalPages) {
    paginationEl.innerHTML = '';
    let markup = '';

    markup += createButton(currentPage - 1, '←', currentPage, totalPages);

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            markup += createButton(i, String(i), currentPage, totalPages);
        }
    } else {
        markup += createButton(1, '1', currentPage, totalPages);
        markup += createButton(2, '2', currentPage, totalPages);
        markup += createButton(3, '3', currentPage, totalPages);

        if (currentPage > 4 && currentPage < totalPages - 2) {
            markup += `<span class="pagination-dots">...</span>`;
        }

        if (currentPage > 3 && currentPage < totalPages - 2) {
            markup += createButton(currentPage, String(currentPage), currentPage, totalPages);
        }

        if (currentPage < totalPages - 3) {
            markup += `<span class="pagination-dots">...</span>`;
        }

        markup += createButton(totalPages, String(totalPages), currentPage, totalPages);
    }

    markup += createButton(currentPage + 1, '→	', currentPage, totalPages);

    paginationEl.innerHTML = markup;
}

paginationEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.paginationBtn');
    if (!btn || btn.classList.contains('disabled')) return;

    const page = Number(btn.dataset.page);
    if (isNaN(page)) return;

    fetchArtists(page, true);
});
