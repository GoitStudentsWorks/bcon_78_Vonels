import axios from 'axios';

/* ============================================================
   HELPERS
============================================================ */

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getYears(yearStart, yearEnd) {
  if (!yearStart && !yearEnd) return 'Information missing';
  if (!yearEnd) return `${yearStart}-present`;
  return `${yearStart} - ${yearEnd}`;
}

function showLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) loader.style.display = 'none';
}

/* ============================================================
   BIO Toggle
============================================================ */

function createBiographyHTML(text, limit = 500) {
  if (!text) text = 'Information missing';
  const tooLong = text.length > limit;
  const shortText = text.slice(0, limit);

  return `
    <span id="bio-text">${tooLong ? shortText : text}</span>
    ${
      tooLong
        ? `<button id="bio-toggle" class="bio-toggle-btn">
              <svg class="modal-icon" width="20" height="20">
                <use href="./img/sprite.svg#icon-dots-horizontal"></use>
              </svg>
           </button>`
        : ''
    }
  `;
}

function setupBioToggle(fullText) {
  const btn = document.querySelector('#bio-toggle');
  const textElem = document.querySelector('#bio-text');
  if (!btn) return;

  let expanded = false;

  btn.addEventListener('click', () => {
    expanded = !expanded;

    if (expanded) {
      textElem.textContent = fullText;
      btn.innerHTML = `
        <svg class="modal-icon" width="20" height="20">
          <use href="./img/sprite.svg#icon-modal-up"></use>
        </svg>`;
    } else {
      textElem.textContent = fullText.slice(0, 250);
      btn.innerHTML = `
        <svg class="modal-icon" width="20" height="20">
          <use href="./img/sprite.svg#icon-dots-horizontal"></use>
        </svg>`;
    }
  });
}

/* ============================================================
   API
============================================================ */

const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api',
});

/* ============================================================
   INIT
============================================================ */

export async function init(id) {
  try {
    showLoader();
    const overlay = document.querySelector('.modal-overlay');
    const container = document.querySelector('.modal');
    document.body.classList.add('modal-open');
    container.innerHTML = '';
    overlay.classList.add('is-open');

    const { data } = await api.get(`/artists/${id}/albums`);
    createArtistModal(data);
  } catch (err) {
    console.error('Error loading artist:', err);
  } finally {
    hideLoader();
  }
}

/* ============================================================
   MAIN MODAL HTML
============================================================ */

let CURRENT_PAGE = 1;
const ALBUMS_PER_PAGE = 8;
let GLOBAL_ALBUMS = [];

function createArtistModal(artist) {
  const {
    strArtistThumb,
    strArtist,
    intFormedYear,
    intDiedYear,
    genres,
    strGender,
    intMembers,
    strCountry,
    strBiographyEN,
    albumsList,
  } = artist;

  GLOBAL_ALBUMS = albumsList || [];
  CURRENT_PAGE = 1;

  const container = document.querySelector('.modal');
  const genresHTML = genres?.map(g => `<span>${g}</span>`).join(' ') || '';

  container.innerHTML = `
    <button class="btn-exit" type="button">
      <svg class="modal-icon-exit" width="20" height="20">
        <use href="./img/sprite.svg#icon-close"></use>
      </svg>
    </button>

    <h1 class="actor-name">${strArtist}</h1>

    <div class="actor">
      <div class="actor-img-wrapper" style="position:relative;">
        <img class="actor-img" src="${strArtistThumb}" alt="${strArtist}" />
      </div>

      <ul class="actor-info">
        <div class="actor-info-container">
          <li><h2>Years active</h2><p>${getYears(
            intFormedYear,
            intDiedYear
          )}</p></li>
          <li><h2>Sex</h2><p>${strGender || 'Information missing'}</p></li>
        </div>

        <div class="actor-info-container">
          <li><h2>Members</h2><p>${intMembers || 'Information missing'}</p></li>
          <li><h2>Country</h2><p>${strCountry || 'Information missing'}</p></li>
        </div>

        <li><h2>Biography</h2>${createBiographyHTML(strBiographyEN)}</li>
        <li class="actor-cards">${genresHTML}</li>
      </ul>
    </div>

    <div class="albums">
      <h2>Albums</h2>
      <div class="albums-cards" id="albums-container"></div>
      <div class="pagination" id="pagination"></div>
    </div>
  `;

  setupBioToggle(strBiographyEN);
  attachModalListeners();

  const wrapper = container.querySelector('.actor-img-wrapper');
  setupHoverVideo(wrapper, albumsList);

  renderAlbumsPage(true);
}

/* ============================================================
   RENDER PAGINATION + ALBUMS
============================================================ */

function renderAlbumsPage(bool) {
  const start = (CURRENT_PAGE - 1) * ALBUMS_PER_PAGE;
  const end = start + ALBUMS_PER_PAGE;
  const items = GLOBAL_ALBUMS.slice(start, end);
  const albumsContainer = document.querySelector('#albums-container');

  albumsContainer.innerHTML = buildAlbumsHTML(items);

  buildPagination();

  if (!bool) {
    document.querySelector('.albums').scrollIntoView({ behavior: 'smooth' });
  }
}

function buildAlbumsHTML(list) {
  return list
    .map(album => {
      const tracksHTML =
        album.tracks
          ?.map(
            t => `
        <li class="track">
          <span class="title">${t.strTrack}</span>
          <span class="time">${formatDuration(t.intDuration)}</span>
          ${
            t.movie
              ? `<a href="${t.movie}" class="yt-btn" target="_blank">
                    <svg class="modal-icon-yt" width="20" height="20">
                      <use href="./img/sprite.svg#icon-YouTube"></use>
                    </svg>
                </a>`
              : ''
          }
        </li>`
          )
          .join('') || '<li>No tracks found</li>';

      return `
        <div class="album-card">
          <h3>${album.strAlbum}</h3>
          <div class="table-header">
            <span>Track</span>
            <span>Time</span>
            <span>Link</span>
          </div>
          <ul class="track-list">${tracksHTML}</ul>
        </div>
      `;
    })
    .reduce((acc, item, i) => {
      if (i % 2 === 0) acc.push(`<div class="albums-thumb">${item}`);
      else acc[acc.length - 1] += item + `</div>`;
      return acc;
    }, [])
    .join('');
}

/* ============================================================
   PAGINATION HTML
============================================================ */

function buildPagination() {
  const totalPages = Math.ceil(GLOBAL_ALBUMS.length / ALBUMS_PER_PAGE);
  const pag = document.querySelector('#pagination');
  const maxVisibleButtons = 3;

  let html = `<button class="page-btn" data-move="-1" ${
    CURRENT_PAGE === 1 ? 'disabled' : ''
  }>←</button>`;

  let start = Math.max(CURRENT_PAGE - 2, 1);
  let end = Math.min(start + maxVisibleButtons - 1, totalPages);
  if (end - start + 1 < maxVisibleButtons) {
    start = Math.max(end - maxVisibleButtons + 1, 1);
  }

  if (start > 1) {
    html += `<button class="page-btn" data-page="1">1</button><span style="padding:0 4px;">...</span>`;
  }

  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn ${
      i === CURRENT_PAGE ? 'active-page' : ''
    }" data-page="${i}">${i}</button>`;
  }

  if (end < totalPages) {
    html += `<span style="padding:0 4px;">...</span><button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="page-btn" data-move="1" ${
    CURRENT_PAGE === totalPages ? 'disabled' : ''
  }>→</button>`;

  pag.innerHTML = html;

  pag.onclick = e => {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;

    const page = btn.dataset.page;
    const move = btn.dataset.move;

    if (page) CURRENT_PAGE = Number(page);
    if (move) CURRENT_PAGE += Number(move);

    renderAlbumsPage(false);
  };
}

/* ============================================================
   VIDEO THUMB
============================================================ */

function setupHoverVideo(imgWrapper, albumsList) {
  if (!imgWrapper) return;

  const firstVideo = albumsList?.[0]?.tracks?.find(t => t.movie)?.movie;
  if (!firstVideo) return;

  const embedUrl = getYoutubeEmbedUrl(firstVideo);
  if (!embedUrl) return;

  const img = imgWrapper.querySelector('.actor-img');
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = 0;
  iframe.style.left = 0;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.display = 'none';

  imgWrapper.appendChild(iframe);

  setTimeout(() => {
    iframe.src = embedUrl;
    iframe.style.display = 'block';
  }, 5000);

  imgWrapper.addEventListener('mouseleave', () => {
    iframe.src = '';
    iframe.style.display = 'none';
  });

  function getYoutubeEmbedUrl(url) {
    const match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    const id = match ? match[1] : null;
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1`;
  }
}

/* ============================================================
   MODAL LISTENERS
============================================================ */

function attachModalListeners() {
  const overlay = document.querySelector('.modal-overlay');
  const exitBtn = document.querySelector('.btn-exit');

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  exitBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}
