import { getImagesByQuery } from './js/pixabay-api';
import {
  clearGallery,
  createGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const PER_PAGE = 15;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const searchValue = event.currentTarget.elements['search-text'].value.trim();

  if (!searchValue) {
    iziToast.warning({
      message: 'Please enter a search query 🙂',
      position: 'topRight',
    });
    return;
  }

  query = searchValue;
  page = 1;

  clearGallery();
  hideLoadMoreButton();

  loadImages(false);
}

function onLoadMore() {
  page += 1;
  loadImages(true);
}

async function loadImages(isLoadMore) {
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    const { hits, totalHits } = data;

    hideLoader();

    if (!hits.length && !isLoadMore) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    const maxPage = Math.ceil(totalHits / PER_PAGE);

    if (page < maxPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      if (isLoadMore) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    }

    if (isLoadMore) {
      scrollPage();
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  }
}

function scrollPage() {
  const firstCardRect = document
    .querySelector('.gallery')
    ?.firstElementChild?.getBoundingClientRect();

  if (!firstCardRect) return;

  const cardHeight =
    firstCardRect.height || firstCardRect.bottom - firstCardRect.top;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
