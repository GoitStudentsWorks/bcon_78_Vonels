const refs = {
  headerBtnOpenMenu: document.querySelector('.header-button-menu'),
  headerBtnCloseMenu: document.querySelector('.button-close'),
  mobileMenu: document.querySelector('.menu-drive'),
  mobileLinks: document.querySelectorAll('.header-mobile-nav-link'),
  menuLogoLink: document.querySelector('.menu-drive .header-link-logo'),
};

const toggleMenu = () => {
  refs.mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('no-scroll');
};

if (refs.headerBtnOpenMenu) {
  refs.headerBtnOpenMenu.addEventListener('click', toggleMenu);
}

if (refs.headerBtnCloseMenu) {
  refs.headerBtnCloseMenu.addEventListener('click', toggleMenu);
}

if (refs.mobileLinks.length > 0) {
  refs.mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

if (refs.menuLogoLink) {
  refs.menuLogoLink.addEventListener('click', toggleMenu);
}
