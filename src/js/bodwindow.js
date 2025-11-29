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
   BIOGRAPHY TOGGLE
   ============================================================ */

function createBiographyHTML(text, limit = 250) {
  if (!text) text = 'Information missing';

  const tooLong = text.length > limit;
  const shortText = text.slice(0, limit);

  return `
    <span id="bio-text">${tooLong ? shortText : text}</span>
    ${
      tooLong
        ? `<button id="bio-toggle" class="bio-toggle-btn">
            <svg class="modal-icon" width="20" height="20">
              <use href="../img/sprite.svg#icon-dots-horizontal"></use>
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
          <use href="../img/sprite.svg#icon-modal-up"></use>
        </svg>
      `;
    } else {
      textElem.textContent = fullText.slice(0, 250);
      btn.innerHTML = `
        <svg class="modal-icon" width="20" height="20">
          <use href="../img/sprite.svg#icon-dots-horizontal"></use>
        </svg>
      `;
    }
  });
}

/* ============================================================
   MODAL CONTROLS
   ============================================================ */

function attachModalListeners() {
  const overlay = document.querySelector('.modal-overlay');
  const modal = document.querySelector('.modal');
  const exitBtn = document.querySelector('.btn-exit');

  if (!overlay || !modal || !exitBtn) {
    console.error('Modal elements not found in DOM');
    return;
  }

  function closeModal() {
    overlay.classList.remove('is-open');
  }

  exitBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================================
   API
   ============================================================ */

const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api',
});

/* ============================================================
   MAIN RENDER FUNCTION
   ============================================================ */

export async function init(id) {
  try {
    showLoader();
    const container = document.querySelector('.modal-overlay');
    container.classList.add('is-open');
    const { data } = await api.get(`/artists/${id}/albums`);
    createArtistModal(data);
  } catch (err) {
    console.error('Error loading artist:', err);
  } finally {
    hideLoader();
  }
}

/* ============================================================
   BUILD MODAL HTML
   ============================================================ */

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

  const container = document.querySelector('.modal');
  container.innerHTML = '';

  const genresHTML = genres?.map(g => `<span>${g}</span>`).join(' ') || '';

  /* --- Albums --- */
  const albumsHTML = (albumsList || [])
    .slice(0, 8)
    .map(({ strAlbum, tracks }) => {
      const tracksHTML =
        tracks
          ?.map(
            ({ strTrack, intDuration, movie }) => `
          <li class="track">
            <span class="title">${strTrack}</span>
            <span class="time">${formatDuration(intDuration)}</span>
            ${
              movie
                ? `<a href="${movie}" class="yt-btn" target="_blank">
                    <svg class="modal-icon-yt" width="20" height="20">
                      <use href="/img/sprite.svg#icon-YouTube"></use>
                    </svg>
                  </a>`
                : ''
            }
          </li>`
          )
          .join('') || '<li>No tracks found</li>';

      return `
        <div class="album-card">
          <h3>${strAlbum}</h3>
          <div class="table-header">
            <span>Track</span>
            <span>Time</span>
            <span>Link</span>
          </div>
          <ul class="track-list">${tracksHTML}</ul>
        </div>
      `;
    })
    .reduce((acc, item, i, arr) => {
      if (i % 2 === 0) acc.push(`<div class="albums-thumb">${item}`);
      else acc[acc.length - 1] += item + `</div>`;
      if (i === arr.length - 1 && i % 2 === 0) acc[acc.length - 1] += `</div>`;
      return acc;
    }, [])
    .join('');

  /* --- FINAL MARKUP --- */
  container.innerHTML = `
    <button class="btn-exit" type="button">
      <svg class="modal-icon-exit" width="20" height="20">
        <use href="/img/sprite.svg#icon-close"></use>
      </svg>
    </button>

    <h1 class="actor-name">${strArtist}</h1>

    <div class="actor">
      <img class="actor-img" src="${strArtistThumb}" alt="${strArtist}" />

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
      <div class="albums-cards">${albumsHTML}</div>
    </div>
  `;

  setupBioToggle(strBiographyEN);
  attachModalListeners();
}
