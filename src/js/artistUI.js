import { init } from './bodwindow';

const artistsList = document.querySelector('.artists-list');
const loader = document.querySelector('.artists-loader');
const paginationEl = document.querySelector('.pagination');

export function showArtistsLoader() {
  loader?.classList.remove('is-hidden');
}

export function hideArtistsLoader() {
  loader?.classList.add('is-hidden');
}

export function clearArtistsList() {
  if (artistsList) artistsList.innerHTML = '';
}

function createGenreElements(genres) {
  if (!Array.isArray(genres) || genres.length === 0) {
    return '';
  }

  const tags = genres
    .map(genre => `<span class="genre-tag">${genre}</span>`)
    .join('');

  return `<div class="artist-genres">${tags}</div>`;
}

export function createArtistCards(artists) {
  const markup = artists
    .map(artist => {
      const biographyText = artist.strBiographyEN || '';

      return `
        <li class="artist-card">
          <img 
            class="img-card"
            src="${artist.strArtistThumb || ''}" 
            alt="${artist.strArtist || 'Artist Photo'}" 
            loading="lazy"
            data-artist-id="${artist._id}"
          >

          ${createGenreElements(artist.genres)}

          <h3 class="artist-name">${artist.strArtist}</h3>

          ${
            biographyText
              ? `<p class="artist-short-info">${biographyText}</p>`
              : ''
          }
          
          <button
            type="button"
            class="learn-more-btn"
            data-artist-id="${artist._id}"
          >
            Learn More
            <svg class="model-open-btm-icon" width="8" height="14">
              <use href="img/sprite.svg#icon-con"></use>
            </svg>
          </button>
        </li>
      `;
    })
    .join('');

  if (artistsList) artistsList.innerHTML = markup;

  document.addEventListener('click', e => {
    if (
      e.target.classList.contains('learn-more-btn') ||
      e.target.classList.contains('img-card')
    ) {
      const actorId = e.target.dataset.artistId;
      init(actorId);
    }
  });
}

function createButton(page, text, currentPage, totalPages) {
  const isActive = page === currentPage ? ' active' : '';
  const isDots = text === '...' ? ' pagination-dots' : '';
  const isDisabled =
    text === '...'
      ? ' disabled'
      : text === 'Prev' && currentPage === 1
      ? ' disabled'
      : text === 'Next' && currentPage === totalPages
      ? ' disabled'
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
  if (!paginationEl) return;

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
      markup += createButton(
        currentPage,
        String(currentPage),
        currentPage,
        totalPages
      );
    }

    if (currentPage < totalPages - 3) {
      markup += `<span class="pagination-dots">...</span>`;
    }

    markup += createButton(
      totalPages,
      String(totalPages),
      currentPage,
      totalPages
    );
  }

  markup += createButton(currentPage + 1, '→', currentPage, totalPages);

  paginationEl.innerHTML = markup;
}

export function clearPagination() {
  if (paginationEl) paginationEl.innerHTML = '';
}

export function initPaginationListener(fetchCallback) {
  if (!paginationEl) return;

  paginationEl.addEventListener('click', e => {
    const btn = e.target.closest('.paginationBtn');
    if (!btn || btn.classList.contains('disabled')) return;

    const page = Number(btn.dataset.page);
    if (isNaN(page)) return;

    fetchCallback(page);
    document
      .querySelector('.section-subtitle')
      ?.scrollIntoView({ behavior: 'smooth' });
  });
}
