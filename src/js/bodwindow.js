const refs = {
  gallery: document.querySelector('#gallery'),
  backgroundModal: document.querySelector('.background-modal'),
  closeBtn: document.querySelector('.closeBtn'),
  modal: document.querySelector('.modal'),
  modalContent: document.querySelector('.modal-content-first-part'),
  loader: document.querySelector('.loader'),
};

// const globalVariables = {
//   backgroundModalScrollTop: 0
// }

let contentAvailable = false;

function createModalArtistInfo(data) {
  if (data === null || data === undefined) return;
  if (contentAvailable) {
    return;
  } else {
    refs.modalContent.innerHTML = '';
    const modalArtistInfo = createArtistCardInfo(data);

    // 1
    refs.modalContent.insertAdjacentHTML('beforeend', modalArtistInfo);
    data.strBiographyEN = data.strBiographyEN || 'information missing';
    setupShowMore(data.strBiographyEN, 300);

    const tagContainer = document.querySelector('#modal-tags-list');
    const dynamicTags = createTagItems(data);

    const albumList = addGallery(data.albumsList);

    // 2
    tagContainer.insertAdjacentHTML('beforeend', dynamicTags);
    // 3
    refs.modalContent.insertAdjacentHTML('beforeend', albumList);

    contentAvailable = true;
  }
}

function disableModal() {
  refs.backgroundModal.classList.remove('is-active');
  refs.gallery.classList.remove('previous-content');
  contentAvailable = false;
}

// !MARKUP HTML
function createArtistCardInfo(artistInfo) {
  let yearStart = artistInfo.intFormedYear;
  let yearEnd = artistInfo.intDiedYear;

  let yearsText = `${yearStart}-${yearEnd}`;
  if (yearStart === null && yearEnd === null) {
    yearsText = 'information missing';
  } else if (yearEnd === null) {
    yearsText = `${yearStart}-present`;
  }

  return `<h3 class="modal-artist-name">${artistInfo.strArtist}</h3>
  <div class="modal-artist-wrapper">
    <img class="modal-artist-info-img" width="272" height="167" src="${
      artistInfo.strArtistThumb
    }" alt="${artistInfo.strArtist}"/>
    <div class="modal-artist-full-info">
      <ul class="modal-info-list">
        <li class="modal-info-item">
          <h4 class="modal-info-title">Years active</h4>
          <p class ="modal-info-text">${yearsText}</p>
        </li>
        <li class="modal-info-item">
          <h4 class="modal-info-title">Sex</h4>
          <p class ="modal-info-text">${
            artistInfo.strGender || 'information missing'
          }</p>
        </li>
        <li class="modal-info-item">
          <h4 class="modal-info-title">Members</h4>
          <p class ="modal-info-text">${
            artistInfo.intMembers || 'information missing'
          }</p>
        </li>
        <li class="modal-info-item">
          <h4 class="modal-info-title">Country</h4>
          <p class ="modal-info-text">${
            artistInfo.strCountry || 'information missing'
          }</p>
        </li>
      </ul>
      <div class="modal-biography">
        <h4 class="modal-info-title">Biography</h4>
        <div class="modal-biography-container">
          <p id="modal-biography-content" class="modal-info-text"></p>
          <button id="modal-biography-button"></button>
        </div>
      </div>
      <ul id="modal-tags-list" class="modal-tags-list">
      </ul>
    </div>
  </div>`;
}

// !MARKUP FOR TAGS
function createTagItems(artistInfo) {
  if (!artistInfo.genres) return '';

  return artistInfo.genres
    .map(genre => `<li class="modal-tag-item">${genre}</li>`.repeat(1))
    .join('');
}

// !MARKUP HTML 2 PART
function addGallery(artistInfo) {
  const albumsHTML = artistInfo
    .slice(0, 8)
    .map(({ strAlbum, tracks }) => {
      const tracksHTML = (tracks || [])
        .map(
          ({ strTrack, intDuration, movie }) => `
        <li class="track">
          <span class="title">${strTrack}</span>
          <span class="time">${formatDuration(intDuration)}</span>
          ${movie ? `<a href="${movie}" class="yt-btn">▶</a>` : ''}
        </li>
      `
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
      if (index % 2 === 0) {
        acc.push(`<div class="albums-thumb">${curr}`);
      } else {
        acc[acc.length - 1] += curr + `</div>`;
      }
      if (index === arr.length - 1 && index % 2 === 0) {
        acc[acc.length - 1] += `</div>`;
      }

      return acc;
    }, [])
    .join('');

  return `  <div class="albums">
      <h2>Albums</h2>
			<div class="albums-cards">
      ${albumsHTML}
			</div>
    </div>
  `;
}
// !END MARKUP

export let artistId = '';

// !FUCTION OPEN/CLOSE MODAL
refs.gallery.addEventListener('click', async event => {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (event.target.nodeName !== 'BUTTON') {
    return;
  }

  showLoader();
  // !TAKE ID
  artistId = event.target.dataset.artistId;

  document.body.classList.add('no-scroll');

  // !CALL FUNCTION CREATE INFO ABOUT ARTIST IN MODAL
  await createModalInfo(artistId);

  // !OPEN
  refs.backgroundModal.classList.add('is-active');
  refs.backgroundModal.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  refs.gallery.classList.add('previous-content');
  hideLoader();

  // !CLOSE
  window.addEventListener('keydown', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.code !== 'Escape') {
      return;
    }
    disableModal();
    document.body.classList.remove('no-scroll');
  });

  refs.backgroundModal.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const targetEl = event.target;
    const button = event.target.closest('.modal-close-btn');
    if (targetEl !== event.currentTarget && !button) {
      return;
    }
    disableModal();
    document.body.classList.remove('no-scroll');
  });
});

// !FUNCTION TAKE INFO
async function getArtistInfo(artistId) {
  try {
    let urlArtist = `https://sound-wave.b.goit.study/api/artists/${artistId}/albums`;

    const response = await axios.get(urlArtist);

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

// !FUNCTION CREATE INFO ABOUT ARTIST IN MODAL
async function createModalInfo(artistId) {
  const data = await getArtistInfo(artistId);
  createModalArtistInfo(data);
}

// !FUNCTIONS SECOND PART
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// !LOADER
function showLoader() {
  refs.loader.style.display = 'block';
}

function hideLoader() {
  refs.loader.style.display = 'none';
}

// !SMALLER TEXT
function setupShowMore(fullText, limit) {
  const contentElement = document.querySelector('#modal-biography-content');
  const buttonElement = document.querySelector('#modal-biography-button');

  const svgOpen = `<svg class="modal-icon-more-text" width="20" height="20">
                      <use href="./img/sprite.svg#icon-dots-horizontal"></use>
                  </svg>`;
  const svgClose = `<svg class="modal-icon-less-text" width="20" height="20">
                      <use href="./img/sprite.svg#icon-modal-up"></use>
                  </svg>`;

  if (fullText.length <= limit) {
    contentElement.textContent = fullText;
    buttonElement.style.display = 'none';
    contentElement.appendChild(buttonElement);
    return;
  }

  const collapsedText = fullText.substring(0, limit);
  const expandedText = fullText;

  let isCollapsed = true;
  contentElement.textContent = collapsedText;
  buttonElement.innerHTML = svgOpen;
  contentElement.appendChild(buttonElement);

  buttonElement.addEventListener('click', () => {
    isCollapsed = !isCollapsed;

    if (isCollapsed) {
      contentElement.textContent = collapsedText;
      buttonElement.innerHTML = svgOpen;
      refs.backgroundModal.scrollTo({
        // top: globalVariables.backgroundModalScrollTop,
        top: 0,
        behavior: 'smooth',
      });
      contentElement.appendChild(buttonElement);
    } else {
      contentElement.textContent = expandedText;
      buttonElement.innerHTML = svgClose;
      // globalVariables.backgroundModalScrollTop = refs.backgroundModal.scrollTop;
      contentElement.appendChild(buttonElement);
    }
  });
}
