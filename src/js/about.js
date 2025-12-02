document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.querySelector('.read-more-about');
  const modal = document.querySelector('.read-more-modal');
  const closeBtn = document.querySelector('.close-button-about');

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });
});
