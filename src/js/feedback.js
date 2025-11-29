import Swiper from 'swiper/bundle';

const BASE_URL = 'https://sound-wave.b.goit.study/api';
const FEEDBACKS_ENDPOINT = '/feedbacks';
const API_URL = `${BASE_URL}${FEEDBACKS_ENDPOINT}`;
const STORAGE_KEY = 'project-feedbacks'; // Додано ключ Local Storage

const swiperWrapper = document.querySelector('.swiper-wrapper');
const submitButton = document.querySelector('.feedback-submit-btn');

function createFeedbackMarkup({ name, feedback, rating }) {
  const roundedRating = Math.round(rating);
  const starsMarkup = '⭐'.repeat(roundedRating);

  return `<div class="swiper-slide feedback-card">
        <div class="star-rating-container">
            ${starsMarkup}
        </div>
        <p class="feedback-text">
            "${feedback}"
        </p>
        <p class="feedback-author">
            ${name}
        </p>
        <button type="button" class="feedback-submit-btn">Leave feedback</button>
    </div>
    `;
}

function initSwiper(totalSlides) {
  const swiper = new Swiper('.feedback-slider', {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 30,

    navigation: {
      nextEl: '.feedback-next-btn',
      prevEl: '.feedback-prev-btn',
    },
    pagination: {
      el: '.feedback-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        if (index === 0) {
          return `<span class="${className} pagination-start" aria-label="Go to first slide"></span>`;
        } else if (index === totalSlides - 1) {
          return `<span class="${className} pagination-end" aria-label="Go to last slide"></span>`;
        }
        return `<span class="${className} pagination-middle" aria-label="Go to slide ${
          index + 1
        }"></span>`;
      },
    },
  });
}

async function updateFeedbacks() {
  if (!swiperWrapper) {
    console.error('Swiper wrapper element not found.');
    return;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let apiData = await response.json();

    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const combinedData = [...localData, ...apiData];

    if (combinedData.length === 0) {
      swiperWrapper.innerHTML = `<p class="no-feedback-message">Наразі відгуків немає.</p>`;

      return;
    }

    const feedbacksToRender = combinedData.slice(0, 10);
    const markup = feedbacksToRender.map(createFeedbackMarkup).join('');

    swiperWrapper.innerHTML = markup;

    initSwiper(feedbacksToRender.length);
  } catch (error) {
    console.error('Помилка при оновленні відгуків:', error);
    swiperWrapper.innerHTML = `<p class="error-message">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>`;
  }
}

// -----------------------------------------------------------------
// 2. ЛОГІКА МОДАЛЬНОГО ВІКНА ТА СИНХРОНІЗАЦІЇ
// -----------------------------------------------------------------

// Зробити функцію updateFeedbacks доступною глобально для feedbackwindow.js
window.updateFeedbacks = updateFeedbacks;

// Імпорт функції відкриття модального вікна
import { openModal } from './feedbackwindow';

if (submitButton) {
  submitButton.addEventListener('click', openModal);
}

updateFeedbacks();
