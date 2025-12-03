document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.querySelector('.read-more-about');
  const modal = document.querySelector('.read-more-modal');
  const closeBtn = document.querySelector('.close-button-about');

  openBtn.addEventListener('click', () => {
    modal.classList.add('is-open');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modal.classList.remove('is-open');
    }
  });
});
