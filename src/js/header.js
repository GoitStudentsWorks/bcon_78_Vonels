const refs = {
  headerBtnOpenMenu: document.querySelector('.header-button-menu'),
  headerBtnCloseMenu: document.querySelector('.button-close'),
  mobileMenu: document.querySelector('.menu-drive'),
  mobileLinks: document.querySelectorAll('.header-mobile-nav-link'),
  menuLogoLink: document.querySelector('.menu-drive .header-link-logo'),
  desktopLinks: document.querySelectorAll('.header-list a'),
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

if (refs.desktopLinks.length > 0) {
  refs.desktopLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      refs.desktopLinks.forEach(item => {
        item.classList.remove('is-active');
      });
      event.currentTarget.classList.add('is-active');
    });
  });
}
