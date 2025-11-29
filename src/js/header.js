const refs = {
  headerBtnOpenMenu: document.querySelector('.header-button-menu'),
  headerBtnCloseMenu: document.querySelector('.button-close'),
  mobileMenu: document.querySelector('.menu-drive'),
};

const toggleMenu = () => {
  refs.mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');
};

if (refs.headerBtnOpenMenu && refs.mobileMenu) {
  refs.headerBtnOpenMenu.addEventListener('click', toggleMenu);
}
if (refs.headerBtnCloseMenu && refs.mobileMenu) {
  refs.headerBtnCloseMenu.addEventListener('click', toggleMenu);
}
