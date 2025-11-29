const artistsList = document.querySelector('.artists-list');
const loader = document.querySelector('.artists-loader');
const loadMoreBtn = document.querySelector('.artists-load-more-btn');

export function showArtistsLoader() {
  loader.classList.remove('is-hidden');
}
export function hideArtistsLoader() {
  loader.classList.add('is-hidden');
}
export function showArtistsLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}
export function hideArtistsLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}
export function clearArtistsList() {
  artistsList.innerHTML = '';
}

function createGenreElements(genres) {
  if (!Array.isArray(genres) || genres.length === 0) {
    return '';
  }

  const tags = genres
    .map(genre => {
      return `<span class="genre-tag">${genre}</span>`;
    })
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
                    >

                    ${createGenreElements(artist.genres)}

                    <h3 class="artist-name">${artist.strArtist}</h3>

                    ${
                      biographyText
                        ? `<p class="artist-short-info">${biographyText}</p>`
                        : ''
                    }
                    
                    <button 
                        class="learn-more-btn"
                        data-artist-id="${artist._id}"
                    >
                        Learn More
                        

                    </button>
                </li>
            `;
    })
    .join('');

  artistsList.insertAdjacentHTML('beforeend', markup);
}
