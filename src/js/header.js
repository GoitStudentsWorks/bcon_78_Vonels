const refs = {
  headerBtnOpenMenu: document.querySelector('.header-button-menu'),
  headerBtnCloseMenu: document.querySelector('.button-close'),
  mobileMenu: document.querySelector('.menu-drive'),
<<<<<<< HEAD
=======
  mobileLinks: document.querySelectorAll('.header-mobile-nav-link'),
>>>>>>> main
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
<<<<<<< HEAD
=======

  if (refs.mobileLinks.length > 0) {
    refs.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu();
      });
    });
  }
>>>>>>> main
}
