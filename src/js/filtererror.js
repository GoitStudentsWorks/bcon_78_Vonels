import axios from 'axios';
import iziToast from 'izitoast';
import {
  createArtistCards,
  showArtistsLoader,
  hideArtistsLoader,
  clearArtistsList,
  hideArtistsLoadMoreButton,
} from './artisterror';

const BASE_URL = 'https://sound-wave.b.goit.study';
const PER_PAGE = 8;

let currentPage = 1;
let totalPages = 0;
let selectedGenre = '';
let sortOrder = '';
let searchQuery = '';

const getElements = () => ({
  filtersToggleBtn: document.querySelector('.filters-toggle-btn'),
  filtersPanel: document.querySelector('.filters-panel'),
  genreDropdownBtn: document.querySelector('.genre-dropdown-btn'),
  genreDropdownList: document.querySelector('.genre-dropdown-list'),
  genreDropdownListDesktop: document.querySelector(
    '.genre-dropdown-list-desktop'
  ),
  genreListMobile: document.querySelector('.genre-list'),
  sortDropdownBtn: document.querySelector('.sort-dropdown-btn'),
  sortDropdownList: document.querySelector('.sort-dropdown-list'),
  sortListMobile: document.querySelector('.sort-list'),
  searchInput: document.getElementById('artist-search'),
  searchInputDesktop: document.getElementById('artist-search-desktop'),
  resetBtn: document.querySelectorAll('.reset-btn'),
  emptyState: document.querySelector('.empty-state'),
  resetFiltersBtn: document.querySelector('.reset-filters-btn'),
  allDropdowns: document.querySelectorAll('.dropdown-list'),
});

async function fetchGenres() {
  try {
    const response = await axios.get(`${BASE_URL}/api/genres`);
    const data = response.data;

    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object' && item !== null) {
          return item.name || item.genre || item.title || String(item);
        }
        return String(item);
      });
    } else if (typeof data === 'object' && data !== null) {
      return Object.values(data).map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object' && item !== null) {
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

  const allGenresItem =
    '<li class="dropdown-item" data-genre="">All Genres</li>';

  if (elements.genreDropdownListDesktop) {
    elements.genreDropdownListDesktop.innerHTML = allGenresItem;
    genres.forEach(genre => {
      const genreName = typeof genre === 'string' ? genre : String(genre);
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.textContent = genreName;
      li.setAttribute('data-genre', genreName);
      elements.genreDropdownListDesktop.appendChild(li);
    });
  }

  if (elements.genreListMobile) {
    elements.genreListMobile.innerHTML = allGenresItem;
    genres.forEach(genre => {
      const genreName = typeof genre === 'string' ? genre : String(genre);
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      li.textContent = genreName;
      li.setAttribute('data-genre', genreName);
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
    if (defaultItem) {
      defaultItem.classList.add('active');
    }
  }
}

function closeAllDropdowns() {
  const elements = getElements();
  elements.allDropdowns.forEach(dropdown => {
    if (dropdown) dropdown.classList.add('is-hidden');
  });
}

function toggleDropdown(dropdownList) {
  if (!dropdownList) return;
  const isOpen = !dropdownList.classList.contains('is-hidden');
  closeAllDropdowns();

  if (!isOpen) {
    dropdownList.classList.remove('is-hidden');
  }
}

function updateDropdownText(button, text) {
  if (!button) return;
  const textElement = button.querySelector('.dropdown-text');
  if (textElement) {
    textElement.textContent = text;
  }
}

async function fetchArtists(page = 1) {
  const elements = getElements();

  if (elements.emptyState) {
    elements.emptyState.classList.add('is-hidden');
  }

  showArtistsLoader();
  hideArtistsLoadMoreButton();

  const params = {
    limit: PER_PAGE,
    page: page,
  };

  if (selectedGenre && selectedGenre !== '') {
    params.genre = selectedGenre;
  }

  try {
    console.log('Fetching artists with params:', params);
    const response = await axios.get(`${BASE_URL}/api/artists`, { params });
    const data = response.data;
    let artists = data.artists || [];
    const totalArtists = data.totalArtists || 0;

    console.log('Received:', artists.length, 'artists, Total:', totalArtists);

    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase();
      artists = artists.filter(artist => {
        const artistName = (artist.strArtist || '').toLowerCase();
        return artistName.includes(query);
      });
    }

    if (sortOrder && artists.length > 0) {
      if (sortOrder === 'name_asc') {
        artists.sort((a, b) => {
          const nameA = (a.strArtist || '').toLowerCase();
          const nameB = (b.strArtist || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      } else if (sortOrder === 'name_desc') {
        artists.sort((a, b) => {
          const nameA = (a.strArtist || '').toLowerCase();
          const nameB = (b.strArtist || '').toLowerCase();
          return nameB.localeCompare(nameA);
        });
      }
    }

    const filteredTotal =
      searchQuery && searchQuery.trim() !== '' ? artists.length : totalArtists;
    totalPages = Math.ceil(filteredTotal / PER_PAGE);
    currentPage = page;

    clearArtistsList();

    if (artists.length === 0 && page === 1) {
      if (elements.emptyState) {
        elements.emptyState.classList.remove('is-hidden');
      }
    } else {
      createArtistCards(artists);
    }

    return { artists, totalArtists: filteredTotal };
  } catch (error) {
    console.error('Error fetching artists:', error);
    clearArtistsList();
    if (elements.emptyState) {
      elements.emptyState.classList.remove('is-hidden');
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

  if (elements.genreDropdownBtn) {
    updateDropdownText(elements.genreDropdownBtn, 'All Genres');
  }
  if (elements.sortDropdownBtn) {
    updateDropdownText(elements.sortDropdownBtn, 'Default');
  }
  if (elements.searchInput) {
    elements.searchInput.value = '';
  }
  if (elements.searchInputDesktop) {
    elements.searchInputDesktop.value = '';
  }
  if (elements.sortListMobile) {
    elements.sortListMobile.querySelectorAll('.sort-item').forEach(item => {
      item.classList.remove('active');
    });
    const defaultItem = elements.sortListMobile.querySelector(
      '.sort-item[data-sort=""]'
    );
    if (defaultItem) {
      defaultItem.classList.add('active');
    }
  }

  closeAllDropdowns();
  fetchArtists(1);
}

function initEventListeners() {
  const elements = getElements();

  const handleGenreSelection = (genre, genreText) => {
    selectedGenre = genre;
    console.log('Genre selected:', genre);
    if (elements.genreDropdownBtn) {
      updateDropdownText(elements.genreDropdownBtn, genreText);
    }
    closeAllDropdowns();
    currentPage = 1;
    fetchArtists(1);
  };

  if (elements.genreDropdownBtn && elements.genreDropdownListDesktop) {
    elements.genreDropdownBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleDropdown(elements.genreDropdownListDesktop);
    });

    elements.genreDropdownListDesktop.addEventListener('click', e => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const genre = item.getAttribute('data-genre') || '';
        handleGenreSelection(genre, item.textContent.trim());
      }
    });
  }

  if (elements.genreListMobile) {
    elements.genreListMobile.addEventListener('click', e => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const genre = item.getAttribute('data-genre') || '';
        handleGenreSelection(genre, item.textContent.trim());
      }
    });
  }

  const handleSortSelection = (sortValue, sortText) => {
    sortOrder = sortValue;
    console.log('Sort selected:', sortValue);
    if (elements.sortDropdownBtn) {
      updateDropdownText(elements.sortDropdownBtn, sortText);
    }
    if (elements.sortListMobile) {
      elements.sortListMobile.querySelectorAll('.sort-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-sort') === sortValue) {
          item.classList.add('active');
        }
      });
    }
    closeAllDropdowns();
    currentPage = 1;
    fetchArtists(1);
  };

  if (elements.sortDropdownBtn && elements.sortDropdownList) {
    elements.sortDropdownBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleDropdown(elements.sortDropdownList);
    });

    elements.sortDropdownList.addEventListener('click', e => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const sort = item.getAttribute('data-sort') || '';
        const sortText = item.textContent.trim();
        handleSortSelection(sort, sortText);
      }
    });
  }

  if (elements.sortListMobile) {
    elements.sortListMobile.addEventListener('click', e => {
      const item = e.target.closest('.sort-item');
      if (item) {
        const sort = item.getAttribute('data-sort') || '';
        const sortText =
          item.querySelector('.sort-option-btn')?.textContent.trim() || '';
        elements.sortListMobile.querySelectorAll('.sort-item').forEach(i => {
          i.classList.remove('active');
        });
        item.classList.add('active');
        handleSortSelection(sort, sortText);
      }
    });
  }

  const handleSearch = (inputElement, otherInputElement) => {
    if (!inputElement) return;
    let searchTimeout;
    inputElement.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = inputElement.value.trim();
        if (otherInputElement) {
          otherInputElement.value = inputElement.value;
        }
        console.log('Search query:', searchQuery);
        currentPage = 1;
        fetchArtists(1);
      }, 500);
    });

    inputElement.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        searchQuery = inputElement.value.trim();
        if (otherInputElement) {
          otherInputElement.value = inputElement.value;
        }
        console.log('Search query (Enter):', searchQuery);
        currentPage = 1;
        fetchArtists(1);
      }
    });
  };

  handleSearch(elements.searchInput, elements.searchInputDesktop);
  handleSearch(elements.searchInputDesktop, elements.searchInput);

  if (elements.resetBtn && elements.resetBtn.length > 0) {
    elements.resetBtn.forEach(btn => {
      btn.addEventListener('click', resetFilters);
    });
  }

  if (elements.resetFiltersBtn) {
    elements.resetFiltersBtn.addEventListener('click', resetFilters);
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-wrapper')) {
      closeAllDropdowns();
    }
  });

  if (elements.filtersToggleBtn && elements.filtersPanel) {
    elements.filtersToggleBtn.addEventListener('click', () => {
      const isHidden = elements.filtersPanel.classList.contains('is-hidden');
      if (isHidden) {
        elements.filtersPanel.classList.remove('is-hidden');
        elements.filtersToggleBtn.classList.add('is-open');
      } else {
        elements.filtersPanel.classList.add('is-hidden');
        elements.filtersToggleBtn.classList.remove('is-open');
      }
    });
  }

  const filterGroupHeaders = document.querySelectorAll('.filter-group-header');
  filterGroupHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const filterGroup = header.closest('.filter-group');
      const content = filterGroup?.querySelector('.filter-group-content');
      if (content) {
        const isHidden = content.classList.contains('is-hidden');
        if (isHidden) {
          content.classList.remove('is-hidden');
        } else {
          content.classList.add('is-hidden');
        }
      }
    });
  });
}

async function init() {
  try {
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const elements = getElements();
    console.log('Initializing filters. Elements found:', {
      genreBtn: !!elements.genreDropdownBtn,
      sortBtn: !!elements.sortDropdownBtn,
      searchInput: !!elements.searchInput,
      resetBtn: !!elements.resetBtn,
    });

    initEventListeners();
    await populateGenres();
    initPanel();
    await fetchArtists(1);
    console.log('Filters initialized successfully');
  } catch (error) {
    console.error('Error initializing filters:', error);
  }
}

export { fetchArtists, resetFilters };

init();
