const $ = window.$;

const modalWindow = document.querySelector('.submit-modal');
const overlay = document.querySelector('.submit-feedback');
const closeBtn = document.querySelector('.submit-button_modal');
const form = document.querySelector('.submit-form');
const STORAGE_KEY = 'project-feedbacks';

export function openModal() {
  if (overlay) {
    overlay.classList.add('is-open');
  }
  if (modalWindow) {
    modalWindow.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal() {
  if (overlay) {
    overlay.classList.remove('is-open');
  }
  if (modalWindow) {
    modalWindow.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) {
    closeModal();
  }
});

$(document).ready(() => {
  $('#user-rating-input').raty({
    starType: 'img',
    number: 5,
    path: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images',
    score: 0,
    click: score => {
      $('#rating-score').val(score);
    },
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.username.value.trim();
    const message = form.message.value.trim();
    const rating = Number(form['rating-score'].value);

    if (!name || !message || rating === 0) {
      alert('Please, fill the fields and choose a rating');
      return;
    }

    const newFeedback = {
      id: Date.now().toString(),
      name,
      message,
      rating,
    };

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    saved.push(newFeedback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    form.reset();
    $('#user-rating-input').raty('score', 0);
    document.querySelector('#rating-score').value = 0;

    closeModal();
  });
});
