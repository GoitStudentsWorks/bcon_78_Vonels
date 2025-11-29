import axios from 'axios';

/* ------------------ HELPERS ------------------ */

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getYears(yearStart, yearEnd) {
  if (yearStart === null && yearEnd === null) return 'Information missing';
  if (yearEnd === null) return `${yearStart}-present`;
  return `${yearStart} - ${yearEnd}`;
}

function showLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
}

/* ---------- CREATE BIOGRAPHY HTML WITH TOGGLE ---------- */
function createBiographyHTML(actorBiography, limit = 250) {
  if (!actorBiography) actorBiography = 'Information missing';

  const isLong = actorBiography.length > limit;
  const shortText = actorBiography.slice(0, limit);

  return `
    <span id="bio-text">${isLong ? shortText : actorBiography}</span>
    ${
      isLong
        ? `<button id="bio-toggle" class="bio-toggle-btn">
            <svg class="modal-icon" width="20" height="20">
              <use href="../img/sprite.svg#icon-dots-horizontal"></use>
            </svg>
          </button>`
        : ''
    }
  `;
}

function setupBioToggle(actorBiography) {
  const bioToggleBtn = document.querySelector('#bio-toggle');
  const bioText = document.querySelector('#bio-text');

  if (!bioToggleBtn) return;

  let expanded = false;
  bioToggleBtn.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      bioText.textContent = actorBiography;
      bioToggleBtn.innerHTML = `
        <svg class="modal-icon" width="20" height="20">
          <use href="../img/sprite.svg#icon-modal-up"></use>
        </svg>
      `;
    } else {
      bioText.textContent = actorBiography.slice(0, 250);
      bioToggleBtn.innerHTML = `
        <svg class="modal-icon" width="20" height="20">
          <use href="../img/sprite.svg#icon-dots-horizontal"></use>
        </svg>
      `;
    }
  });
}

/* ------------------ API CONNECTION ------------------ */

const api = axios.create({
  baseURL: 'https://sound-wave.b.goit.study/api',
});

/* ------------------ MAIN RENDER FUNCTION ------------------ */

async function init(id) {
  try {
    showLoader();
    const { data } = await api.get(`/artists/${id}/albums`);
    createAlbumList(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    hideLoader();
  }
}

function createAlbumList(actorInfo) {
  const {
    strArtistThumb: actorImg,
    strArtist: actorName,
    intFormedYear,
    intDiedYear,
    genres,
    strGender: actorGender,
    intMembers: members,
    strCountry: actorCountry,
    strBiographyEN: actorBiography,
    albumsList,
  } = actorInfo;

  const container = document.querySelector('.modal');
  container.innerHTML = '';

  const genresHTML = genres?.map(g => `<span>${g}</span>`).join(' ') || '';

  /* ---------- ALBUMS + TRACKS ---------- */
  const albumsHTML = (albumsList || [])
    .slice(0, 8)
    .map(({ strAlbum, tracks }) => {
      const tracksHTML = (tracks || [])
        .map(
          ({ strTrack, intDuration, movie }) => `
          <li class="track">
            <span class="title">${strTrack}</span>
            <span class="time">${formatDuration(intDuration)}</span>
            ${
              movie
                ? `<a href="${movie}" class="yt-btn">
                    <svg class="modal-icon-more-text" width="20" height="20">
                      <use href="../img/sprite.svg#icon-YouTube"></use>
                    </svg>
                  </a>`
                : ''
            }
          </li>`
        )
        .join('');

      return `
        <div class="album-card">
          <h3>${strAlbum}</h3>
          <div class="table-header">
            <span>Track</span>
            <span>Time</span>
            <span>Link</span>
          </div>
          <ul class="track-list">
            ${tracksHTML || '<li>No tracks found</li>'}
          </ul>
        </div>
      `;
    })
    .reduce((acc, curr, index, arr) => {
      if (index % 2 === 0) acc.push(`<div class="albums-thumb">${curr}`);
      else acc[acc.length - 1] += curr + `</div>`;
      if (index === arr.length - 1 && index % 2 === 0)
        acc[acc.length - 1] += `</div>`;
      return acc;
    }, [])
    .join('');

  /* ---------- MAIN MODAL MARKUP ---------- */
  const markup = `
    <h1 class="actor-name">${actorName}</h1>
    <div class="actor">
      <img class="actor-img" src="${actorImg}" alt="${actorName}"/>
      <ul class="actor-info">
        <div class="actor-info-container">
          <li><h2>Years active</h2><p>${getYears(
            intFormedYear,
            intDiedYear
          )}</p></li>
          <li><h2>Sex</h2><p>${actorGender || 'Information missing'}</p></li>
        </div>
        <div class="actor-info-container">
          <li><h2>Members</h2><p>${members || 'Information missing'}</p></li>
          <li><h2>Country</h2><p>${
            actorCountry || 'Information missing'
          }</p></li>
        </div>
        <li><h2>Biography</h2>${createBiographyHTML(actorBiography)}</li>
        <li class="actor-cards">${genresHTML}</li>
      </ul>
    </div>

    <div class="albums">
      <h2>Albums</h2>
      <div class="albums-cards">
        ${albumsHTML}
      </div>
    </div>
  `;

  container.innerHTML = markup;

  /* ---------- SETUP BIO TOGGLE ---------- */
  setupBioToggle(actorBiography);
}

/* ------------------ INIT CALL ------------------ */
// document.addEventListener('click', event => {
//   const btn = event.target.closest('.learn-more-btn');
//   const container = document.querySelector('.modal-overlay');
//   container.classList.add('is-open');
//   if (!btn) return;

//   const artistId = btn.dataset.artistId;
//   console.log(btn.dataset.artistId);
//   init(artistId);
// });
