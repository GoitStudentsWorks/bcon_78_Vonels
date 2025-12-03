import axios from 'axios';
import {
  createArtistCards,
  showArtistsLoader,
  hideArtistsLoader,
  clearArtistsList,
} from './artisterror';
import { renderPagination } from './artist';

const BASE_URL = 'https://sound-wave.b.goit.study';
const PER_PAGE = 8;

let currentPage = 1;
let totalPages = 0;
let selectedGenre = '';
let sortOrder = '';
let searchQuery = '';

function getElements() {
  return {
    filtersToggleBtn: document.querySelector('.filters-toggle-btn'),
    filtersPanel: document.querySelector('.filters-panel'),
    genreListMobile: document.querySelector('.genre-list'),
    sortListMobile: document.querySelector('.sort-list'),
    searchInput: document.getElementById('artist-search'),
    searchInputDesktop: document.getElementById('artist-search-desktop'),
    resetBtn: document.querySelectorAll('.reset-btn'),
    emptyState: document.querySelector('.empty-state'),
    resetFiltersBtn: document.querySelector('.reset-filters-btn'),
    sortOptionsDesktop: document.querySelector('.sort-options-desktop'),
    genreOptionsDesktop: document.querySelector('.genre-options-desktop'),
    filterDropdownBtns: document.querySelectorAll('.filter-dropdown-btn'),
    filterGroupHeaders: document.querySelectorAll('.filter-group-header'),
  };
}

async function fetchGenres() {
  try {
    const response = await axios.get(`${BASE_URL}/api/genres`);
    const data = response.data;

    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.name || item.genre || item.title || String(item);
        }
        return String(item);
      });
    }

    if (typeof data === 'object' && data !== null) {
      return Object.values(data).map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.name || item.genre || item.title || String(item);
        }
        return String(item);
      });
    }

    return [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

async function populateGenres() {
  const elements = getElements();
  const genres = await fetchGenres();

  if (elements.genreOptionsDesktop) {
    elements.genreOptionsDesktop.innerHTML =
      '<li class="filter-option-item active" data-genre="">All Genres</li>';
    genres.forEach(genre => {
      const li = document.createElement('li');
      li.className = 'filter-option-item';
      li.textContent = genre;
      li.setAttribute('data-genre', genre);
      elements.genreOptionsDesktop.appendChild(li);
    });
  }

  if (elements.genreListMobile) {
    elements.genreListMobile.innerHTML =
      '<li class="dropdown-item" data-genre="">All Genres</li>';
    genres.forEach(genre => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.textContent = genre;
      li.setAttribute('data-genre', genre);
      elements.genreListMobile.appendChild(li);
    });
  }
}

function initPanel() {
  const elements = getElements();

  if (elements.sortListMobile) {
    const defaultItem = elements.sortListMobile.querySelector(
      '.sort-item[data-sort=""]'
    );
    if (defaultItem) defaultItem.classList.add('active');
  }

  if (elements.sortOptionsDesktop) {
    const defaultItem = elements.sortOptionsDesktop.querySelector(
      '.filter-option-item[data-sort=""]'
    );
    if (defaultItem) defaultItem.classList.add('active');
  }
}

async function fetchArtists(page = 1) {
  const elements = getElements();

  if (elements.emptyState) {
    elements.emptyState.classList.add('is-hidden');
  }

  showArtistsLoader();

  const params = { limit: PER_PAGE, page };

  if (selectedGenre) {
    params.genre = selectedGenre;
  }

  if (searchQuery) {
    params.name = searchQuery;
  }

  if (sortOrder) {
    params.sortName = sortOrder === 'name_asc' ? 'asc' : 'desc';
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/artists`, { params });
    const data = response.data;
    const artists = data.artists || [];
    const totalArtists = data.totalArtists || 0;
    totalPages = Math.ceil(totalArtists / PER_PAGE);
    currentPage = page;

    clearArtistsList();

    const paginationEl = document.querySelector('.pagination');

    if (artists.length === 0 && page === 1) {
      if (elements.emptyState) {
        elements.emptyState.classList.remove('is-hidden');
      }
      if (paginationEl) {
        paginationEl.innerHTML = '';
      }
    } else {
      createArtistCards(artists);
      renderPagination(page, totalPages);
    }

    return { artists, totalArtists };
  } catch (error) {
    console.error('Error fetching artists:', error);
    clearArtistsList();
    if (elements.emptyState) {
      elements.emptyState.classList.remove('is-hidden');
    }
    const paginationEl = document.querySelector('.pagination');
    if (paginationEl) {
      paginationEl.innerHTML = '';
    }
    return { artists: [], totalArtists: 0 };
  } finally {
    hideArtistsLoader();
  }
}

function resetFilters() {
  const elements = getElements();

  selectedGenre = '';
  sortOrder = '';
  searchQuery = '';
  currentPage = 1;

  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.searchInputDesktop) elements.searchInputDesktop.value = '';

  [elements.sortListMobile, elements.sortOptionsDesktop].forEach(list => {
    if (!list) return;
    list.querySelectorAll('.sort-item, .filter-option-item').forEach(item => {
      item.classList.remove('active');
    });
    const defaultItem = list.querySelector('[data-sort=""]');
    if (defaultItem) defaultItem.classList.add('active');
  });

  if (elements.genreOptionsDesktop) {
    elements.genreOptionsDesktop
      .querySelectorAll('.filter-option-item')
      .forEach(item => {
        item.classList.remove('active');
      });
    const defaultItem =
      elements.genreOptionsDesktop.querySelector('[data-genre=""]');
    if (defaultItem) defaultItem.classList.add('active');
  }

  fetchArtists(1);
}

function initEventListeners() {
  const elements = getElements();

  function handleGenreSelection(genre) {
    selectedGenre = genre;

    if (elements.genreOptionsDesktop) {
      elements.genreOptionsDesktop
        .querySelectorAll('.filter-option-item')
        .forEach(item => {
          item.classList.toggle(
            'active',
            item.getAttribute('data-genre') === genre
          );
        });
    }

    if (elements.genreListMobile) {
      elements.genreListMobile
        .querySelectorAll('.dropdown-item')
        .forEach(item => {
          item.classList.toggle(
            'active',
            item.getAttribute('data-genre') === genre
          );
        });
    }

    currentPage = 1;
    fetchArtists(1);
  }

  function handleSortSelection(sortValue) {
    sortOrder = sortValue;

    if (elements.sortOptionsDesktop) {
      elements.sortOptionsDesktop
        .querySelectorAll('.filter-option-item')
        .forEach(item => {
          item.classList.toggle(
            'active',
            item.getAttribute('data-sort') === sortValue
          );
        });
    }

    if (elements.sortListMobile) {
      elements.sortListMobile.querySelectorAll('.sort-item').forEach(item => {
        item.classList.toggle(
          'active',
          item.getAttribute('data-sort') === sortValue
        );
      });
    }

    currentPage = 1;
    fetchArtists(1);
  }

  function setupSearch(input, syncInput) {
    if (!input) return;

    let timeout;

    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchQuery = input.value.trim();
        if (syncInput) syncInput.value = input.value;
        currentPage = 1;
        fetchArtists(1);
      }, 500);
    });

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        clearTimeout(timeout);
        searchQuery = input.value.trim();
        if (syncInput) syncInput.value = input.value;
        currentPage = 1;
        fetchArtists(1);
      }
    });
  }

  if (elements.genreOptionsDesktop) {
    elements.genreOptionsDesktop.addEventListener('click', e => {
      const item = e.target.closest('.filter-option-item');
      if (item) handleGenreSelection(item.getAttribute('data-genre') || '');
    });
  }

  if (elements.genreListMobile) {
    elements.genreListMobile.addEventListener('click', e => {
      const item = e.target.closest('.dropdown-item');
      if (item) handleGenreSelection(item.getAttribute('data-genre') || '');
    });
  }

  if (elements.sortOptionsDesktop) {
    elements.sortOptionsDesktop.addEventListener('click', e => {
      const item = e.target.closest('.filter-option-item');
      if (item) handleSortSelection(item.getAttribute('data-sort') || '');
    });
  }

  if (elements.sortListMobile) {
    elements.sortListMobile.addEventListener('click', e => {
      const item = e.target.closest('.sort-item');
      if (item) handleSortSelection(item.getAttribute('data-sort') || '');
    });
  }

  setupSearch(elements.searchInput, elements.searchInputDesktop);
  setupSearch(elements.searchInputDesktop, elements.searchInput);

  if (elements.resetBtn?.length > 0) {
    elements.resetBtn.forEach(btn =>
      btn.addEventListener('click', resetFilters)
    );
  }

  if (elements.resetFiltersBtn) {
    elements.resetFiltersBtn.addEventListener('click', resetFilters);
  }

  if (elements.filtersToggleBtn && elements.filtersPanel) {
    elements.filtersToggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = elements.filtersPanel.classList.contains('is-open');
      elements.filtersPanel.classList.toggle('is-open', !isOpen);
      elements.filtersToggleBtn.classList.toggle('is-open', !isOpen);
    });

    // Close panel when clicking outside (keeps selected filters)
    document.addEventListener('click', e => {
      if (
        !e.target.closest('.filters-panel') &&
        !e.target.closest('.filters-toggle-btn')
      ) {
        elements.filtersPanel.classList.remove('is-open');
        elements.filtersToggleBtn.classList.remove('is-open');
      }
    });
  }

  elements.filterGroupHeaders?.forEach(header => {
    header.addEventListener('click', () => {
      const content = header
        .closest('.filter-group')
        ?.querySelector('.filter-group-content');
      if (content) content.classList.toggle('is-hidden');
    });
  });

  elements.filterDropdownBtns?.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const dropdown = btn.closest('.filter-dropdown');
      const content = dropdown?.querySelector('.filter-dropdown-content');
      
      // Close other dropdowns
      document.querySelectorAll('.filter-dropdown-content').forEach(other => {
        if (other !== content) other.classList.remove('is-open');
      });
      
      if (content) content.classList.toggle('is-open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.filter-dropdown')) {
      document.querySelectorAll('.filter-dropdown-content').forEach(content => {
        content.classList.remove('is-open');
      });
    }
  });
}

async function init() {
  try {
    if (document.readyState === 'loading') {
      await new Promise(resolve =>
        document.addEventListener('DOMContentLoaded', resolve)
      );
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    initEventListeners();
    await populateGenres();
    initPanel();
    await fetchArtists(1);
  } catch (error) {
    console.error('Error initializing filters:', error);
  }
}

export { fetchArtists, resetFilters };

init();
