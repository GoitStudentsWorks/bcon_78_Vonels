import Swiper from 'swiper/bundle';
import axios from 'axios';

const BASE_URL = 'https://sound-wave.b.goit.study';
// const FEEDBACKS_ENDPOINT = '/api/feedbacks';
const API_URL = `${BASE_URL}/api/feedbacks`;
const STORAGE_KEY = 'project-feedbacks';
const swiperWrapper = document.querySelector('.swiper-wrapper');
const submitButton = document.querySelector('.feedback-submit-btn');
// {
//   FEEDBACKS_ENDPOINT;
// }

// function createRatingStars(rating) {
//     const roundedRating = Math.round(data.rating);
//   const starsMarkup = '⭐'.repeat(roundedRating);
//   return starsMarkup;
// }

function createFeedbackMarkup(data) {
  return data
    .map(
      ({ name, rating, descr }) => `
    <div class="swiper-slide feedback-card">
        <div class="star-rating-container">
            ${rating}
        </div>
        <p class="feedback-text">
            "${descr}"
        </p>
        <p class="feedback-author">
            ${name}
        </p>
    </div>
  `
    )
    .join('');
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

      type: 'custom',
      renderCustom: function (swiper, current, total) {
        const MAX_VISIBLE_BULLETS = 3;

        let html = '';

        const displayCount = Math.min(total, MAX_VISIBLE_BULLETS);

        for (let i = 1; i <= displayCount; i++) {
          let className = 'swiper-pagination-bullet';

          if (i === (current % displayCount || displayCount)) {
            className += ' swiper-pagination-bullet-active';
          }
          html += `<span class="${className}" aria-label="Go to slide ${i}"></span>`;
        }

        return html;
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
    const { data } = await axios.get(API_URL);
    console.log(data);
    const markup = createFeedbackMarkup(data.data);

    swiperWrapper.innerHTML = markup;

    initSwiper(markup.length);
    // } catch (error) {
    //   console.error('Помилка при оновленні відгуків:', error);

    //   // ПРИМУСОВЕ ЗАВАНТАЖЕННЯ Local Storage ПРИ ПОМИЛЦІ API
    //   const localData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    //   if (localData.length > 0) {
    //     const feedbacksToRender = localData.slice(0, 10);
    //     const markup = feedbacksToRender.map(createFeedbackMarkup).join('');

    //     swiperWrapper.innerHTML = markup;
    //     initSwiper(feedbacksToRender.length);
    //   } else {
    //     swiperWrapper.innerHTML = `<p class="error-message">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>`;
    //   }
    // }
  } catch (error) {
    console.error('Помилка при оновленні відгуків:', error);
    swiperWrapper.innerHTML = `<p class="error-message">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>`;
  }
}

// -----------------------------------------------------------------
// 2. ЛОГІКА МОДАЛЬНОГО ВІКНА
// -----------------------------------------------------------------

window.updateFeedbacks = updateFeedbacks;

import { openModal } from '../js/feedbackwindow';

if (submitButton) {
  submitButton.addEventListener('click', openModal);
}

updateFeedbacks();
