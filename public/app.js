// Gamezop Arcade - Core Frontend Application

class GamezopArcade {
  constructor() {
    this.games = [];
    this.filteredGames = [];
    this.activeCategory = 'all';
    this.activeOrientation = 'all';
    this.searchQuery = '';
    this.sortBy = 'popular';
    this.showOnlyFavorites = false;
    this.activeGame = null;
    this.playerMode = 'auto'; // 'phone', 'wide', 'theater'

    // Local Storage keys
    this.FAV_STORAGE_KEY = 'gamezop_favs_v1';
    this.RECENT_STORAGE_KEY = 'gamezop_recents_v1';
    this.favorites = this.loadFavorites();
    this.recentGames = this.loadRecents();

    // DOM Elements
    this.cacheDOMElements();
    this.bindEvents();
    
    // Init
    this.init();
  }

  cacheDOMElements() {
    // Header & Navigation
    this.searchInput = document.getElementById('searchInput');
    this.mobileSearchInput = document.getElementById('mobileSearchInput');
    this.searchClearBtn = document.getElementById('searchClearBtn');
    this.randomGameBtn = document.getElementById('randomGameBtn');
    this.favTabBtn = document.getElementById('favTabBtn');
    this.favCountBadge = document.getElementById('favCountBadge');
    this.apiSettingsBtn = document.getElementById('apiSettingsBtn');
    this.apiStatusDot = document.getElementById('apiStatusDot');
    this.apiStatusLabel = document.getElementById('apiStatusLabel');

    // Banners & Hero
    this.apiInfoBanner = document.getElementById('apiInfoBanner');
    this.bannerConnectBtn = document.getElementById('bannerConnectBtn');
    this.bannerDismissBtn = document.getElementById('bannerDismissBtn');
    this.heroSection = document.getElementById('heroSection');
    this.heroBackdrop = document.getElementById('heroBackdrop');
    this.heroTitle = document.getElementById('heroTitle');
    this.heroCategory = document.getElementById('heroCategory');
    this.heroOrientation = document.getElementById('heroOrientation');
    this.heroDescription = document.getElementById('heroDescription');
    this.heroImage = document.getElementById('heroImage');
    this.heroPlays = document.getElementById('heroPlays');
    this.heroPlaysCount = document.getElementById('heroPlaysCount');
    this.heroPlayBtn = document.getElementById('heroPlayBtn');
    this.heroFavBtn = document.getElementById('heroFavBtn');
    this.heroNewTabBtn = document.getElementById('heroNewTabBtn');

    // Recents
    this.recentSection = document.getElementById('recentSection');
    this.recentContainer = document.getElementById('recentContainer');
    this.clearRecentBtn = document.getElementById('clearRecentBtn');

    // Catalog controls & Grid
    this.categoryPills = document.querySelectorAll('.cat-pill');
    this.orientBtns = document.querySelectorAll('.orient-btn');
    this.sortSelect = document.getElementById('sortSelect');
    this.resultsCountLabel = document.getElementById('resultsCountLabel');
    this.totalGamesBadge = document.getElementById('totalGamesBadge');
    this.filterTagContainer = document.getElementById('filterTagContainer');
    this.gamesGrid = document.getElementById('gamesGrid');
    this.emptyState = document.getElementById('emptyState');
    this.resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Player Modal & Launchpad
    this.playerModal = document.getElementById('playerModal');
    this.closePlayerBtn = document.getElementById('closePlayerBtn');
    this.playerGameTitle = document.getElementById('playerGameTitle');
    this.playerCategoryTag = document.getElementById('playerCategoryTag');
    this.playerOrientationTag = document.getElementById('playerOrientationTag');
    this.viewPhoneBtn = document.getElementById('viewPhoneBtn');
    this.viewWideBtn = document.getElementById('viewWideBtn');
    this.viewTheaterBtn = document.getElementById('viewTheaterBtn');
    this.reloadGameBtn = document.getElementById('reloadGameBtn');
    this.playerFavBtn = document.getElementById('playerFavBtn');
    this.playerFullscreenBtn = document.getElementById('playerFullscreenBtn');
    this.playerPopoutBtn = document.getElementById('playerPopoutBtn');
    this.stageContainer = document.getElementById('stageContainer');
    this.gameLaunchpad = document.getElementById('gameLaunchpad');
    this.launchpadCover = document.getElementById('launchpadCover');
    this.launchpadOrientationBadge = document.getElementById('launchpadOrientationBadge');
    this.launchpadCategory = document.getElementById('launchpadCategory');
    this.launchpadPlays = document.getElementById('launchpadPlays');
    this.launchpadTitle = document.getElementById('launchpadTitle');
    this.launchpadDescription = document.getElementById('launchpadDescription');
    this.launchWindowBtn = document.getElementById('launchWindowBtn');
    this.launchTabBtn = document.getElementById('launchTabBtn');
    this.toggleIframeViewBtn = document.getElementById('toggleIframeViewBtn');
    this.gameFrameWrapper = document.getElementById('gameFrameWrapper');
    this.gameIframe = document.getElementById('gameIframe');
    this.playerLoading = document.getElementById('playerLoading');
    this.playerDescSnippet = document.getElementById('playerDescSnippet');
    this.playerDirectLink = document.getElementById('playerDirectLink');

    // Settings Modal
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    this.settingsCurrentMode = document.getElementById('settingsCurrentMode');
    this.settingsTokenStatus = document.getElementById('settingsTokenStatus');
    this.tokenForm = document.getElementById('tokenForm');
    this.tokenInput = document.getElementById('tokenInput');
    this.toggleTokenVisibility = document.getElementById('toggleTokenVisibility');
    this.settingsAlert = document.getElementById('settingsAlert');
    this.saveTokenBtn = document.getElementById('saveTokenBtn');
    this.saveBtnText = document.getElementById('saveBtnText');
    this.resetDemoBtn = document.getElementById('resetDemoBtn');
  }

  bindEvents() {
    // Search inputs
    const handleSearch = (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (this.searchClearBtn) {
        this.searchClearBtn.classList.toggle('hidden', !this.searchQuery);
      }
      if (this.searchInput && e.target !== this.searchInput) {
        this.searchInput.value = e.target.value;
      }
      if (this.mobileSearchInput && e.target !== this.mobileSearchInput) {
        this.mobileSearchInput.value = e.target.value;
      }
      this.renderGames();
    };

    if (this.searchInput) this.searchInput.addEventListener('input', handleSearch);
    if (this.mobileSearchInput) this.mobileSearchInput.addEventListener('input', handleSearch);

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        if (this.mobileSearchInput) this.mobileSearchInput.value = '';
        this.searchQuery = '';
        this.searchClearBtn.classList.add('hidden');
        this.renderGames();
      });
    }

    // Category Pills
    this.categoryPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.categoryPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeCategory = pill.dataset.cat;
        this.showOnlyFavorites = false;
        this.updateFavButtonState();
        this.renderGames();
      });
    });

    // Orientation buttons
    this.orientBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.orientBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeOrientation = btn.dataset.orientation;
        this.renderGames();
      });
    });

    // Sort select
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderGames();
      });
    }

    // Random Game
    if (this.randomGameBtn) {
      this.randomGameBtn.addEventListener('click', () => this.playRandomGame());
    }

    // Favorites tab toggle
    if (this.favTabBtn) {
      this.favTabBtn.addEventListener('click', () => {
        this.showOnlyFavorites = !this.showOnlyFavorites;
        this.updateFavButtonState();
        this.renderGames();
      });
    }

    // Settings Modal
    if (this.apiSettingsBtn) {
      this.apiSettingsBtn.addEventListener('click', () => this.openSettingsModal());
    }
    if (this.bannerConnectBtn) {
      this.bannerConnectBtn.addEventListener('click', () => this.openSettingsModal());
    }
    if (this.bannerDismissBtn) {
      this.bannerDismissBtn.addEventListener('click', () => {
        this.apiInfoBanner.classList.add('hidden');
      });
    }
    if (this.closeSettingsBtn) {
      this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    }
    if (this.settingsModal) {
      this.settingsModal.addEventListener('click', (e) => {
        if (e.target === this.settingsModal) this.closeSettingsModal();
      });
    }

    // Toggle Token Password Visibility
    if (this.toggleTokenVisibility) {
      this.toggleTokenVisibility.addEventListener('click', () => {
        const isPassword = this.tokenInput.type === 'password';
        this.tokenInput.type = isPassword ? 'text' : 'password';
        this.toggleTokenVisibility.textContent = isPassword ? 'Hide' : 'Show';
      });
    }

    // Token Form Submit
    if (this.tokenForm) {
      this.tokenForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveToken();
      });
    }

    // Reset Demo Button
    if (this.resetDemoBtn) {
      this.resetDemoBtn.addEventListener('click', () => this.handleResetDemo());
    }

    // Reset Filters Button
    if (this.resetFiltersBtn) {
      this.resetFiltersBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }

    // Clear Recents
    if (this.clearRecentBtn) {
      this.clearRecentBtn.addEventListener('click', () => {
        this.recentGames = [];
        this.saveRecents();
        this.renderRecents();
      });
    }

    // Player Modal Controls
    if (this.closePlayerBtn) {
      this.closePlayerBtn.addEventListener('click', () => this.closeGame());
    }
    if (this.reloadGameBtn) {
      this.reloadGameBtn.addEventListener('click', () => {
        if (this.activeGame && this.gameIframe) {
          this.showPlayerLoading(true);
          this.gameIframe.src = this.activeGame.url;
        }
      });
    }
    if (this.playerFullscreenBtn) {
      this.playerFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
    if (this.playerFavBtn) {
      this.playerFavBtn.addEventListener('click', () => {
        if (this.activeGame) {
          this.toggleFavorite(this.activeGame.code);
          this.updatePlayerFavState();
        }
      });
    }

    // Player View Modes
    if (this.viewPhoneBtn) {
      this.viewPhoneBtn.addEventListener('click', () => this.setPlayerMode('phone'));
    }
    if (this.viewWideBtn) {
      this.viewWideBtn.addEventListener('click', () => this.setPlayerMode('wide'));
    }
    if (this.viewTheaterBtn) {
      this.viewTheaterBtn.addEventListener('click', () => this.setPlayerMode('theater'));
    }

    // Iframe load listener
    if (this.gameIframe) {
      this.gameIframe.addEventListener('load', () => {
        if (this.gameIframe.src && this.gameIframe.src !== 'about:blank') {
          this.showPlayerLoading(false);
        }
      });
    }

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        if (!this.playerModal.classList.contains('hidden')) {
          this.closeGame();
        } else if (!this.settingsModal.classList.contains('hidden')) {
          this.closeSettingsModal();
        }
      }
      // '/' to focus search
      if (e.key === '/' && document.activeElement !== this.searchInput && document.activeElement !== this.tokenInput) {
        e.preventDefault();
        if (this.searchInput) this.searchInput.focus();
      }
      // 'f' or 'F' for fullscreen in player
      if ((e.key === 'f' || e.key === 'F') && !this.playerModal.classList.contains('hidden') && document.activeElement !== this.searchInput) {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });
  }

  async init() {
    this.updateFavBadge();
    await this.checkApiStatus();
    await this.fetchGames();
    this.renderRecents();
  }

  // --- API & State Handling ---

  async checkApiStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      this.updateStatusUI(data);
    } catch (err) {
      console.warn('Status check failed:', err);
    }
  }

  updateStatusUI(status) {
    if (!status) return;

    if (status.hasToken) {
      this.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50';
      this.apiStatusLabel.textContent = 'API Connected';
      this.apiStatusLabel.className = 'hidden sm:inline text-emerald-400 font-semibold';
      
      this.settingsCurrentMode.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Live Gamezop v3 API`;
      this.settingsCurrentMode.className = 'font-bold text-emerald-400 flex items-center gap-1.5';
      this.settingsTokenStatus.textContent = `Configured (${status.tokenPreview || 'Active'})`;
      
      const bannerText = document.getElementById('apiBannerText');
      if (bannerText) {
        bannerText.textContent = `Active publisher token connected! Fetching live catalog directly from Gamezop v3 API.`;
      }
    } else {
      this.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm animate-pulse';
      this.apiStatusLabel.textContent = 'Demo Mode';
      this.apiStatusLabel.className = 'hidden sm:inline text-amber-300 font-semibold';

      this.settingsCurrentMode.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> Demo Mode (250+ Games)`;
      this.settingsCurrentMode.className = 'font-bold text-amber-400 flex items-center gap-1.5';
      this.settingsTokenStatus.textContent = 'Not configured (using sample fallback)';
    }
  }

  async fetchGames(refresh = false) {
    this.showSkeletons();

    try {
      const url = `/api/games${refresh ? '?refresh=true' : ''}`;
      const response = await fetch(url);
      const resJson = await response.json();

      if (!response.ok || resJson.success === false) {
        console.warn('API games warning:', resJson);
        this.showErrorMessage(resJson.error || resJson.message || 'Failed to load games.');
        return;
      }

      this.games = Array.isArray(resJson.data) ? resJson.data : [];
      
      // Update badge
      if (this.totalGamesBadge) {
        this.totalGamesBadge.textContent = this.games.length;
      }

      // Setup Hero Spotlight Game
      this.setupHeroSpotlight();

      // Render games catalog
      this.renderGames();

    } catch (err) {
      console.error('Fetch games error:', err);
      this.showErrorMessage('Network error while loading games catalog.');
    }
  }

  showSkeletons() {
    if (!this.gamesGrid) return;
    this.gamesGrid.innerHTML = Array(12).fill('<div class="skeleton-card"></div>').join('');
    this.emptyState.classList.add('hidden');
  }

  showErrorMessage(msg) {
    if (!this.gamesGrid) return;
    this.gamesGrid.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <div class="inline-block p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-4 text-2xl">⚠️</div>
        <h4 class="text-white font-bold text-base mb-1">Catalog Notice</h4>
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-4">${msg}</p>
        <button id="retryBtn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">Try Again</button>
      </div>
    `;
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) retryBtn.addEventListener('click', () => this.fetchGames(true));
  }

  // --- Hero Spotlight ---

  setupHeroSpotlight() {
    if (!this.games || this.games.length === 0) return;

    // Pick Hextris or the first top-rated game
    let spotlight = this.games.find((g) => g.code === 'Ey5Wzu1MZ9l') || this.games[0];
    this.renderHero(spotlight);
  }

  renderHero(game) {
    if (!game) return;

    const img = (game.images && (game.images.cover || game.images.brick || game.images.square)) || `https://static.gamezop.com/${game.code}/cover.jpg`;
    
    this.heroTitle.textContent = game.name || 'Featured Game';
    this.heroCategory.textContent = (game.category && game.category.name) || 'Arcade';
    this.heroOrientation.textContent = game.screen_orientation === 'portrait' ? '📱 Mobile Ready' : '🖥️ Desktop Ready';
    this.heroDescription.textContent = game.description || 'Enjoy playing this game instantly with high speed and zero downloads.';
    this.heroImage.src = img;
    this.heroBackdrop.style.backgroundImage = `url('${img}')`;

    const rating = (game.stats && game.stats.averageRating) ? `⭐ ${game.stats.averageRating}` : '⭐ 4.5';
    this.heroPlays.textContent = rating;
    this.heroPlaysCount.textContent = (game.playCount || '1M+') + ' Plays';

    // Play action
    this.heroPlayBtn.onclick = () => this.launchGameInWindow(game);
    this.heroNewTabBtn.onclick = () => window.open(game.url, '_blank');
    
    // Fav button
    const isFav = this.favorites.includes(game.code);
    this.heroFavBtn.innerHTML = `<span class="text-pink-400">${isFav ? '❤️' : '🤍'}</span> <span>${isFav ? 'Favorited' : 'Favorite'}</span>`;
    this.heroFavBtn.onclick = () => {
      this.toggleFavorite(game.code);
      const nowFav = this.favorites.includes(game.code);
      this.heroFavBtn.innerHTML = `<span class="text-pink-400">${nowFav ? '❤️' : '🤍'}</span> <span>${nowFav ? 'Favorited' : 'Favorite'}</span>`;
      this.renderGames();
    };
  }

  // --- Filtering & Rendering Games ---

  filterAndSortGames() {
    let result = [...this.games];

    // Search query filter
    if (this.searchQuery) {
      result = result.filter((g) => {
        const titleMatch = (g.name || '').toLowerCase().includes(this.searchQuery);
        const descMatch = (g.description || '').toLowerCase().includes(this.searchQuery);
        const catMatch = (g.category && g.category.name || '').toLowerCase().includes(this.searchQuery);
        return titleMatch || descMatch || catMatch;
      });
    }

    // Category filter
    if (this.activeCategory && this.activeCategory !== 'all') {
      result = result.filter((g) => {
        const cat = (g.category && g.category.name) || '';
        return cat.toLowerCase().includes(this.activeCategory.toLowerCase());
      });
    }

    // Orientation filter
    if (this.activeOrientation && this.activeOrientation !== 'all') {
      result = result.filter((g) => g.screen_orientation === this.activeOrientation);
    }

    // Favorites only filter
    if (this.showOnlyFavorites) {
      result = result.filter((g) => this.favorites.includes(g.code));
    }

    // Sorting
    if (this.sortBy === 'popular') {
      result.sort((a, b) => {
        const pA = (a.stats && a.stats.playCount) || 0;
        const pB = (b.stats && b.stats.playCount) || 0;
        return pB - pA;
      });
    } else if (this.sortBy === 'rating') {
      result.sort((a, b) => {
        const rA = (a.stats && a.stats.averageRating) || 0;
        const rB = (b.stats && b.stats.averageRating) || 0;
        return rB - rA;
      });
    } else if (this.sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (this.sortBy === 'name-desc') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    return result;
  }

  renderGames() {
    this.filteredGames = this.filterAndSortGames();

    // Update labels
    if (this.resultsCountLabel) {
      this.resultsCountLabel.textContent = `Showing ${this.filteredGames.length} ${this.filteredGames.length === 1 ? 'game' : 'games'}`;
    }

    this.renderFilterTags();

    if (this.filteredGames.length === 0) {
      this.gamesGrid.innerHTML = '';
      this.emptyState.classList.remove('hidden');
      return;
    }

    this.emptyState.classList.add('hidden');

    const html = this.filteredGames.map((game) => this.createGameCardHTML(game)).join('');
    this.gamesGrid.innerHTML = html;

    // Attach card action listeners
    this.filteredGames.forEach((game) => {
      const card = document.getElementById(`card-${game.code}`);
      if (card) {
        const playBtn = card.querySelector('.card-play-action');
        if (playBtn) playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.launchGameInWindow(game);
        });

        const favBtn = card.querySelector('.card-fav-action');
        if (favBtn) favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(game.code);
          this.renderGames();
        });

        const popoutBtn = card.querySelector('.card-popout-action');
        if (popoutBtn) popoutBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.open(game.url, '_blank');
        });

        // Clicking card anywhere opens game
        card.addEventListener('click', () => this.openGame(game));
      }
    });
  }

  createGameCardHTML(game) {
    const isFav = this.favorites.includes(game.code);
    const catName = (game.category && game.category.name) || 'Arcade';
    const orientationIcon = game.screen_orientation === 'portrait' ? '📱' : '🖥️';
    const rating = (game.stats && game.stats.averageRating) ? game.stats.averageRating.toFixed(1) : '4.2';
    
    // Use cover with fallback
    const coverUrl = (game.images && (game.images.cover || game.images.square || game.images.brick)) || `https://static.gamezop.com/${game.code}/cover.jpg`;
    const fallbackThumb = `https://static.gamezop.com/${game.code}/thumb.png`;

    return `
      <div id="card-${game.code}" class="game-card group cursor-pointer" title="${game.name}">
        <!-- Top Image Container -->
        <div class="relative overflow-hidden aspect-square bg-slate-900">
          <img 
            src="${coverUrl}" 
            alt="${game.name}" 
            class="card-thumb"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackThumb}';"
          >

          <!-- Badges -->
          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/20">
              ${orientationIcon} ${game.screen_orientation === 'portrait' ? 'Mobile' : 'Wide'}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/20 flex items-center gap-1">
              ⭐ ${rating}
            </span>
          </div>

          <!-- Hover Overlay -->
          <div class="play-overlay">
            <div class="flex items-center justify-center mb-3">
              <button class="card-play-action w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center shadow-lg shadow-cyan-400/40 hover:scale-110 active:scale-95 transition">
                <svg class="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <button class="card-fav-action p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-xs text-slate-300 hover:text-pink-400 transition" title="Toggle Favorite">
                ${isFav ? '❤️' : '🤍'}
              </button>
              <button class="card-popout-action p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-xs text-slate-300 hover:text-cyan-400 transition" title="Open in New Tab">
                ↗️
              </button>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="p-3 bg-[#111726] flex flex-col justify-between flex-1">
          <div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span class="font-medium text-cyan-400 truncate max-w-[70%]">${catName}</span>
              <span class="text-[10px] text-slate-400">${game.playCount || '1M+'}</span>
            </div>
            <h4 class="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
              ${game.name}
            </h4>
          </div>
        </div>
      </div>
    `;
  }

  renderFilterTags() {
    if (!this.filterTagContainer) return;

    const tags = [];
    if (this.searchQuery) {
      tags.push({ label: `Search: "${this.searchQuery}"`, action: () => {
        this.searchQuery = '';
        if (this.searchInput) this.searchInput.value = '';
        if (this.mobileSearchInput) this.mobileSearchInput.value = '';
        this.renderGames();
      }});
    }
    if (this.showOnlyFavorites) {
      tags.push({ label: `❤️ Favorites Only`, action: () => {
        this.showOnlyFavorites = false;
        this.updateFavButtonState();
        this.renderGames();
      }});
    }
    if (this.activeCategory !== 'all') {
      tags.push({ label: `Category: ${this.activeCategory}`, action: () => {
        this.activeCategory = 'all';
        this.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
        this.renderGames();
      }});
    }
    if (this.activeOrientation !== 'all') {
      tags.push({ label: `Orientation: ${this.activeOrientation}`, action: () => {
        this.activeOrientation = 'all';
        this.orientBtns.forEach(b => b.classList.toggle('active', b.dataset.orientation === 'all'));
        this.renderGames();
      }});
    }

    if (tags.length === 0) {
      this.filterTagContainer.classList.add('hidden');
      this.filterTagContainer.innerHTML = '';
      return;
    }

    this.filterTagContainer.classList.remove('hidden');
    this.filterTagContainer.innerHTML = `
      <span class="text-xs text-slate-400">Active filters:</span>
      ${tags.map((t, idx) => `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-200">
          <span>${t.label}</span>
          <button data-tag-index="${idx}" class="text-slate-400 hover:text-white">&times;</button>
        </span>
      `).join('')}
      <button id="clearAllTagsBtn" class="text-xs text-cyan-400 hover:underline ml-2">Clear all</button>
    `;

    tags.forEach((t, idx) => {
      const btn = this.filterTagContainer.querySelector(`[data-tag-index="${idx}"]`);
      if (btn) btn.addEventListener('click', t.action);
    });

    const clearAll = document.getElementById('clearAllTagsBtn');
    if (clearAll) clearAll.addEventListener('click', () => this.resetAllFilters());
  }

  resetAllFilters() {
    this.searchQuery = '';
    if (this.searchInput) this.searchInput.value = '';
    if (this.mobileSearchInput) this.mobileSearchInput.value = '';
    if (this.searchClearBtn) this.searchClearBtn.classList.add('hidden');
    this.showOnlyFavorites = false;
    this.activeCategory = 'all';
    this.activeOrientation = 'all';
    this.sortBy = 'popular';
    if (this.sortSelect) this.sortSelect.value = 'popular';

    this.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
    this.orientBtns.forEach(b => b.classList.toggle('active', b.dataset.orientation === 'all'));
    this.updateFavButtonState();
    this.renderGames();
  }

  // --- Favorites Management ---

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(this.FAV_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(this.FAV_STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
    this.updateFavBadge();
  }

  toggleFavorite(code) {
    const idx = this.favorites.indexOf(code);
    if (idx !== -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(code);
    }
    this.saveFavorites();
  }

  updateFavBadge() {
    if (!this.favCountBadge) return;
    const count = this.favorites.length;
    this.favCountBadge.textContent = count;
    this.favCountBadge.classList.toggle('hidden', count === 0);
  }

  updateFavButtonState() {
    if (!this.favTabBtn) return;
    this.favTabBtn.classList.toggle('border-pink-500', this.showOnlyFavorites);
    this.favTabBtn.classList.toggle('bg-pink-500/10', this.showOnlyFavorites);
  }

  // --- Recently Played Management ---

  loadRecents() {
    try {
      return JSON.parse(localStorage.getItem(this.RECENT_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  saveRecents() {
    try {
      localStorage.setItem(this.RECENT_STORAGE_KEY, JSON.stringify(this.recentGames));
    } catch (e) {
      console.warn('Could not save recents:', e);
    }
  }

  addRecent(game) {
    if (!game || !game.code) return;
    this.recentGames = this.recentGames.filter(g => g.code !== game.code);
    this.recentGames.unshift(game);
    if (this.recentGames.length > 8) {
      this.recentGames = this.recentGames.slice(0, 8);
    }
    this.saveRecents();
    this.renderRecents();
  }

  renderRecents() {
    if (!this.recentSection || !this.recentContainer) return;
    if (this.recentGames.length === 0) {
      this.recentSection.classList.add('hidden');
      return;
    }

    this.recentSection.classList.remove('hidden');
    this.recentContainer.innerHTML = this.recentGames.map(g => {
      const img = (g.images && (g.images.cover || g.images.brick || g.images.square)) || `https://static.gamezop.com/${g.code}/cover.jpg`;
      return `
        <div class="recent-card shrink-0 w-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group" data-recent-code="${g.code}">
          <div class="aspect-video relative overflow-hidden bg-slate-950">
            <img src="${img}" alt="${g.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span class="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold">▶</span>
            </div>
          </div>
          <div class="p-2.5">
            <h5 class="text-xs font-bold text-white truncate group-hover:text-cyan-300">${g.name}</h5>
            <span class="text-[10px] text-slate-400">${(g.category && g.category.name) || 'Game'}</span>
          </div>
        </div>
      `;
    }).join('');

    this.recentGames.forEach(g => {
      const el = this.recentContainer.querySelector(`[data-recent-code="${g.code}"]`);
      if (el) el.addEventListener('click', () => this.openGame(g));
    });
  }

  // --- Random Game ---

  playRandomGame() {
    if (!this.games || this.games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.games.length);
    this.openGame(this.games[randomIndex]);
  }

  launchGameInWindow(game) {
    if (!game) return;
    this.addRecent(game);
    const isPortrait = game.screen_orientation === 'portrait';
    const width = isPortrait ? 440 : 1040;
    const height = isPortrait ? 840 : 720;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no`;
    
    // Open dedicated distraction-free game window (bypasses CSP iframe blocks completely)
    const win = window.open(game.url, `gamezop_${game.code}`, windowFeatures);
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.open(game.url, '_blank');
    }
  }

  // --- Game Player Modal & Launchpad ---

  openGame(game) {
    if (!game) return;
    this.activeGame = game;
    this.addRecent(game);

    // Populate Player Header
    this.playerGameTitle.textContent = game.name || 'Gamezop Title';
    this.playerCategoryTag.textContent = (game.category && game.category.name) || 'Game';
    this.playerOrientationTag.textContent = game.screen_orientation === 'portrait' ? '📱 Mobile Portrait' : '🖥️ Desktop Widescreen';
    this.playerDescSnippet.textContent = game.description || 'Instant HTML5 Web Game';

    // Populate Launchpad Card
    const coverUrl = (game.images && (game.images.cover || game.images.brick || game.images.square)) || `https://static.gamezop.com/${game.code}/cover.jpg`;
    if (this.launchpadCover) this.launchpadCover.src = coverUrl;
    if (this.launchpadTitle) this.launchpadTitle.textContent = game.name;
    if (this.launchpadCategory) this.launchpadCategory.textContent = (game.category && game.category.name) || 'Arcade';
    if (this.launchpadDescription) this.launchpadDescription.textContent = game.description;
    if (this.launchpadOrientationBadge) {
      this.launchpadOrientationBadge.textContent = game.screen_orientation === 'portrait' ? '📱 Mobile' : '🖥️ Desktop';
    }
    if (this.launchpadPlays) {
      const rating = (game.stats && game.stats.averageRating) ? `⭐ ${game.stats.averageRating}` : '⭐ 4.5';
      this.launchpadPlays.textContent = `${rating} • ${game.playCount || '1M+'} Plays`;
    }

    // Direct and pop-out links
    if (this.playerPopoutBtn) this.playerPopoutBtn.href = game.url;
    if (this.playerDirectLink) this.playerDirectLink.href = game.url;
    if (this.launchTabBtn) this.launchTabBtn.href = game.url;

    // Launch window button
    if (this.launchWindowBtn) {
      this.launchWindowBtn.onclick = () => this.launchGameInWindow(game);
    }

    // Default: Show Launchpad (guaranteed to never fail with CSP "refused to connect")
    if (this.gameLaunchpad) this.gameLaunchpad.classList.remove('hidden');
    if (this.gameFrameWrapper) this.gameFrameWrapper.classList.add('hidden');
    if (this.gameIframe) this.gameIframe.src = 'about:blank';

    // Setup toggle button for whitelisted publishers trying iframes
    if (this.toggleIframeViewBtn) {
      this.toggleIframeViewBtn.onclick = () => {
        if (this.gameLaunchpad) this.gameLaunchpad.classList.add('hidden');
        if (this.gameFrameWrapper) {
          this.gameFrameWrapper.classList.remove('hidden');
          if (game.screen_orientation === 'portrait') {
            this.setPlayerMode('phone');
          } else {
            this.setPlayerMode('wide');
          }
          this.showPlayerLoading(true);
          this.gameIframe.src = game.url;
        }
      };
    }

    this.updatePlayerFavState();

    // Show modal
    this.playerModal.classList.remove('hidden');
    // Animate in
    setTimeout(() => {
      this.playerModal.classList.remove('opacity-0');
    }, 10);
  }

  closeGame() {
    this.playerModal.classList.add('opacity-0');
    setTimeout(() => {
      this.playerModal.classList.add('hidden');
      if (this.gameIframe) this.gameIframe.src = 'about:blank';
      if (this.gameLaunchpad) this.gameLaunchpad.classList.remove('hidden');
      if (this.gameFrameWrapper) this.gameFrameWrapper.classList.add('hidden');
      this.activeGame = null;
    }, 250);
  }

  showPlayerLoading(show) {
    if (!this.playerLoading) return;
    this.playerLoading.style.display = show ? 'flex' : 'none';
  }

  setPlayerMode(mode) {
    this.playerMode = mode;

    this.viewPhoneBtn.classList.remove('bg-slate-800', 'text-cyan-300');
    this.viewWideBtn.classList.remove('bg-slate-800', 'text-cyan-300');
    this.viewTheaterBtn.classList.remove('bg-slate-800', 'text-cyan-300');

    this.gameFrameWrapper.classList.remove('phone-mode-wrapper', 'theater-mode-wrapper', 'screenfit-mode-wrapper');

    if (mode === 'phone') {
      this.viewPhoneBtn.classList.add('bg-slate-800', 'text-cyan-300');
      this.gameFrameWrapper.classList.add('phone-mode-wrapper');
    } else if (mode === 'theater') {
      this.viewTheaterBtn.classList.add('bg-slate-800', 'text-cyan-300');
      this.gameFrameWrapper.classList.add('theater-mode-wrapper');
    } else {
      this.viewWideBtn.classList.add('bg-slate-800', 'text-cyan-300');
      this.gameFrameWrapper.classList.add('screenfit-mode-wrapper');
    }
  }

  updatePlayerFavState() {
    if (!this.activeGame || !this.playerFavBtn) return;
    const isFav = this.favorites.includes(this.activeGame.code);
    this.playerFavBtn.innerHTML = `<span>${isFav ? '❤️' : '🤍'}</span>`;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.stageContainer && this.stageContainer.requestFullscreen) {
        this.stageContainer.requestFullscreen().catch(err => {
          console.warn('Fullscreen request denied:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // --- Settings & Token Setup Modal ---

  openSettingsModal() {
    this.settingsAlert.classList.add('hidden');
    this.settingsModal.classList.remove('hidden');
  }

  closeSettingsModal() {
    this.settingsModal.classList.add('hidden');
  }

  async handleSaveToken() {
    const token = this.tokenInput.value.trim();
    if (!token) {
      this.showSettingsAlert('Please enter your Gamezop Bearer token.', 'error');
      return;
    }

    this.saveBtnText.textContent = 'Verifying with Gamezop API...';
    this.saveTokenBtn.disabled = true;

    try {
      const res = await fetch('/api/config/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const json = await res.json();

      if (!res.ok || json.success === false) {
        this.showSettingsAlert(json.message || 'Token verification failed with Gamezop API.', 'error');
      } else {
        this.showSettingsAlert(`Success! Token verified. Loaded ${json.totalGames || ''} publisher games.`, 'success');
        this.tokenInput.value = '';
        await this.checkApiStatus();
        await this.fetchGames(true);
        setTimeout(() => this.closeSettingsModal(), 1500);
      }
    } catch (err) {
      this.showSettingsAlert(`Error connecting to server: ${err.message}`, 'error');
    } finally {
      this.saveBtnText.textContent = 'Verify & Connect Token';
      this.saveTokenBtn.disabled = false;
    }
  }

  async handleResetDemo() {
    try {
      await fetch('/api/config/clear-token', { method: 'POST' });
      this.showSettingsAlert('Switched back to Demo Mode with sample games.', 'info');
      await this.checkApiStatus();
      await this.fetchGames(true);
      setTimeout(() => this.closeSettingsModal(), 1200);
    } catch (err) {
      this.showSettingsAlert(`Error: ${err.message}`, 'error');
    }
  }

  showSettingsAlert(msg, type = 'info') {
    this.settingsAlert.classList.remove('hidden', 'bg-rose-500/20', 'text-rose-300', 'border-rose-500/30', 'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30', 'bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/30');
    
    if (type === 'error') {
      this.settingsAlert.classList.add('bg-rose-500/20', 'text-rose-300', 'border', 'border-rose-500/30');
    } else if (type === 'success') {
      this.settingsAlert.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border', 'border-emerald-500/30');
    } else {
      this.settingsAlert.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border', 'border-cyan-500/30');
    }

    this.settingsAlert.textContent = msg;
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GamezopArcade();
});
