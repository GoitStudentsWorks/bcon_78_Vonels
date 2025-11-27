import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');
let lightbox;

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>

          <ul class="info">
            <li><b>Likes</b> ${likes}</li>
            <li><b>Views</b> ${views}</li>
            <li><b>Comments</b> ${comments}</li>
            <li><b>Downloads</b> ${downloads}</li>
          </ul>
        </li>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('boost');
}

export function hideLoader() {
  loader.classList.add('boost');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('boost');
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('boost');
}
