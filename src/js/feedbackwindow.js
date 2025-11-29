const modalWindow = document.querySelector('.submit-modal');
const closeBtn = document.querySelector('.submit-button_modal');
export function openModal() {
  modalWindow.classList.add('is-open');
}
export function closeModal() {
  modalWindow.classList.remove('is-open');
}

closeBtn.addEventListener('click', closeModal);
