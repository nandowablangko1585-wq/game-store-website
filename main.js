// main.js - Main JavaScript functionality

// Dark mode only: no toggle provided per project requirement
// The site will always load in dark theme. If a future toggle is desired,
// reintroduce a button with id="darkModeToggle" and implement a handler.

// 2. Filter Games Function
function filterGames(category) {
    const gamesContainer = document.getElementById('gamesContainer') || 
                          document.getElementById('featuredGames') || 
                          document.getElementById('promoGames');
    
    if (!gamesContainer) return;
    
    // Show loading
    gamesContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="loading-spinner mx-auto mb-3"></div>
            <p>Memuat game...</p>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        const filteredGames = category === 'all' 
            ? getAllGames() 
            : getGamesByGenre(category);
        
        if (filteredGames.length > 0) {
            gamesContainer.innerHTML = filteredGames
                .slice(0, 8)
                .map(game => createGameCard(game))
                .join('');
            
            // Update filter buttons state
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.category === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else {
            gamesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-gamepad fa-3x text-secondary mb-3"></i>
                    <h4>Tidak ada game ditemukan</h4>
                    <p class="text-secondary">Coba kategori lain atau gunakan pencarian</p>
                </div>
            `;
        }
    }, 500);
}

// 3. Search Game Function (debounced input handler)
const searchHandler = debounce(function() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const gamesContainer = document.getElementById('gamesContainer') || 
                          document.getElementById('featuredGames');
    
    if (!gamesContainer) return;
    
    if (searchTerm.length < 2) {
        if (searchTerm.length === 0) {
            // Reset to featured games if search is empty
            loadFeaturedGames();
        }
        return;
    }
    
    // Show loading
    gamesContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="loading-spinner mx-auto mb-3"></div>
            <p>Mencari game...</p>
        </div>
    `;
    
    setTimeout(() => {
        const results = searchGamesFromData(searchTerm);
        
        if (results.length > 0) {
            gamesContainer.innerHTML = results
                .slice(0, 8)
                .map(game => createGameCard(game))
                .join('');
            
            showAlert(`Ditemukan ${results.length} game untuk "${searchTerm}"`, 'info');
        } else {
            gamesContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-secondary mb-3"></i>
                    <h4>Tidak ada hasil ditemukan</h4>
                    <p class="text-secondary">Coba kata kunci lain</p>
                </div>
            `;
        }
    }, 500);
}, 300);

// 4. Buy Game Function
function buyGame(gameTitle, gameId) {
    const confirmBuy = confirm(`Apakah Anda yakin ingin membeli "${gameTitle}"?`);
    
    if (confirmBuy) {
        // Add to cart
        addToCart(gameId);
        
        // Show success message
        const modalDiv = createSuccessModal(
            'Pembelian Berhasil!',
            `"${gameTitle}" telah ditambahkan ke keranjang Anda. Silakan lanjutkan ke checkout untuk menyelesaikan pembelian.`
        );
        
        const modal = new bootstrap.Modal(modalDiv);
        modal.show();
    }
}

// 5. View Game Detail Function
function viewGameDetail(gameId) {
    const game = getGameById(gameId);
    
    if (game) {
        // Create or update modal
        let modal = document.getElementById('gameDetailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'gameDetailModal';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.querySelector('.modal-content').innerHTML = createGameDetailModal(game);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

// 6. Add to Wishlist Function
function addToWishlist(gameId) {
    const wishlist = loadFromLocalStorage('wishlist') || [];
    const game = getGameById(gameId);
    
    if (game) {
        if (!wishlist.find(item => item.id === gameId)) {
            wishlist.push({
                id: game.id,
                title: game.title,
                price: game.price,
                discount: game.discount,
                image: game.image,
                addedDate: new Date().toISOString()
            });
            
            saveToLocalStorage('wishlist', wishlist);
            showAlert(`"${game.title}" telah ditambahkan ke wishlist`, 'success');
        } else {
            showAlert(`"${game.title}" sudah ada di wishlist`, 'info');
        }
    }
}

// Load featured games
function loadFeaturedGames() {
    const featuredContainer = document.getElementById('featuredGames');
    if (featuredContainer) {
        const featuredGames = getFeaturedGames().slice(0, 4);
        featuredContainer.innerHTML = featuredGames
            .map(game => createGameCard(game))
            .join('');
    }
}

// Load promo games
function loadPromoGames() {
    const promoContainer = document.getElementById('promoGames');
    if (promoContainer) {
        const promoGames = getPromoGames().slice(0, 4);
        promoContainer.innerHTML = promoGames
            .map(game => createGameCard(game))
            .join('');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load games
    loadFeaturedGames();
    loadPromoGames();
    
    // Enforce dark theme (remove light mode toggle)
    try {
        document.body.setAttribute('data-theme', 'dark');
    } catch (e) {
        // ignore
    }
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', searchHandler);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchHandler);
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                const subscribers = loadFromLocalStorage('newsletterSubscribers') || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    saveToLocalStorage('newsletterSubscribers', subscribers);
                }
                
                showAlert('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
                this.reset();
            } else {
                showAlert('Masukkan alamat email yang valid.', 'warning');
            }
        });
    }
    
    // 'Tanya AI' feature removed per requirement (no AI or light mode).
    
    // Enforce dark theme only (remove saved theme handling)
    document.body.setAttribute('data-theme', 'dark');
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.game-card, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial call to animate elements in view
    animateOnScroll();
    
    // Update page title with current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    const pageTitles = {
        'index': 'Home',
        'store': 'Store',
        'categories': 'Categories',
        'promo': 'Promo & Discount',
        'news': 'Game News',
        'about': 'About Us',
        'contact': 'Contact Us'
    };
    
    if (pageTitles[currentPage] && currentPage !== 'index') {
        document.title = `${pageTitles[currentPage]} - CoreIIGether`;
    }

    // Move floating search control out of the navbar into body (keep search available)
    try {
        const navSearch = document.querySelector('.nav-search');
        if (navSearch && navSearch.parentElement !== document.body) {
            document.body.appendChild(navSearch);
        }
    } catch (err) {
        console.warn('Could not relocate floating search control:', err);
    }
    // Ensure background audio element and floating music button exist on every page load.
    // This allows direct page loads (not only SPA navigation) to still show the music logo
    // and have a single audio element controlled by the floating button.
    (function ensureMusicUI() {
        try {
            if (!document.getElementById('bgAudio')) {
                const audio = document.createElement('audio');
                audio.id = 'bgAudio';
                audio.preload = 'none';
                audio.style.display = 'none';
                const src = document.createElement('source');
                src.src = 'bahan/backsound CIIG.mp3';
                src.type = 'audio/mpeg';
                audio.appendChild(src);
                document.body.appendChild(audio);
            }

            if (!document.getElementById('floatingMusicBtn') && !document.querySelector('.floating-music')) {
                const wrap = document.createElement('div');
                wrap.className = 'floating-music';
                wrap.setAttribute('aria-hidden', 'false');

                const btn = document.createElement('button');
                btn.id = 'floatingMusicBtn';
                btn.title = 'Play / Pause background music';
                btn.innerHTML = '<i class="fas fa-play"></i>';
                wrap.appendChild(btn);

                const lbl = document.createElement('div');
                lbl.className = 'floating-label';
                lbl.textContent = 'Background Music';
                wrap.appendChild(lbl);

                document.body.appendChild(wrap);
            }
        } catch (e) {
            console.warn('Could not ensure music UI:', e);
        }
    })();
    // Defensive persistence watcher removed to keep code minimal and clean.
    // If needed in the future we can reintroduce a lightweight guard here.
    // Initialize background music controls (if present)
    try {
        // support both a primary inline player (musicPlayBtn) and a floating button (floatingMusicBtn)
        const bgAudio = document.getElementById('bgAudio') || document.getElementById('floatingBgAudio');
        const musicBtnPrimary = document.getElementById('musicPlayBtn');
        const musicBtnFloating = document.getElementById('floatingMusicBtn');
        const musicToggle = document.getElementById('musicToggle');

        function updateMusicUI() {
            if (!bgAudio) return;
            const playing = !bgAudio.paused && !bgAudio.ended;
            // primary button shows icon + text when present
            if (musicBtnPrimary) musicBtnPrimary.innerHTML = playing ? '<i class="fas fa-pause me-1"></i> Pause' : '<i class="fas fa-play me-1"></i> Play';
            // floating button shows icon only
            if (musicBtnFloating) musicBtnFloating.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
            if (musicToggle) musicToggle.checked = localStorage.getItem('bgMusicPlaying') === 'true';
        }

        function togglePlayback() {
            if (!bgAudio) return;
            if (bgAudio.paused) {
                bgAudio.play().catch(() => {});
            } else {
                bgAudio.pause();
            }
            const playing = !bgAudio.paused && !bgAudio.ended;
            localStorage.setItem('bgMusicPlaying', playing ? 'true' : 'false');
            updateMusicUI();
        }

        if (musicBtnPrimary) {
            musicBtnPrimary.addEventListener('click', function () {
                togglePlayback();
            });
        }

        if (musicBtnFloating) {
            musicBtnFloating.addEventListener('click', function () {
                togglePlayback();
            });
        }

        if (musicToggle) {
            musicToggle.addEventListener('change', function () {
                if (!bgAudio) return;
                if (this.checked) {
                    bgAudio.play().catch(() => {});
                } else {
                    bgAudio.pause();
                }
                localStorage.setItem('bgMusicPlaying', this.checked ? 'true' : 'false');
                updateMusicUI();
            });
        }

        // Restore previous state (autoplay preference and last playback position)
        const wantPlay = localStorage.getItem('bgMusicPlaying') === 'true';
        const savedTime = parseFloat(localStorage.getItem('bgMusicTime') || '0');
        if (bgAudio) {
            // restore last time if available
            try {
                if (!isNaN(savedTime) && savedTime > 0 && savedTime < bgAudio.duration) {
                    bgAudio.currentTime = savedTime;
                }
            } catch (e) {
                // duration may be unavailable until metadata loaded; set when ready
                bgAudio.addEventListener('loadedmetadata', function () {
                    try {
                        if (!isNaN(savedTime) && savedTime > 0 && savedTime < bgAudio.duration) {
                            bgAudio.currentTime = savedTime;
                        }
                    } catch (ee) {}
                });
            }

            // If user wanted autoplay previously, try to resume playback
            if (wantPlay) {
                bgAudio.play().then(() => updateMusicUI()).catch(() => updateMusicUI());
            } else {
                updateMusicUI();
            }

            // Attach UI update listeners
            bgAudio.addEventListener('play', updateMusicUI);
            bgAudio.addEventListener('pause', updateMusicUI);
            bgAudio.addEventListener('ended', updateMusicUI);

            // Periodically save currentTime so we can resume on next page
            let saveInterval = setInterval(() => {
                try {
                    if (!isNaN(bgAudio.currentTime)) {
                        localStorage.setItem('bgMusicTime', String(bgAudio.currentTime));
                    }
                } catch (e) {}
            }, 2000);

            // Save once more before unloading the page
            window.addEventListener('beforeunload', function () {
                try {
                    if (!isNaN(bgAudio.currentTime)) {
                        localStorage.setItem('bgMusicTime', String(bgAudio.currentTime));
                    }
                } catch (e) {}
            });

            // Clean up interval if needed when page is hidden
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    // ensure time saved
                    try {
                        if (!isNaN(bgAudio.currentTime)) {
                            localStorage.setItem('bgMusicTime', String(bgAudio.currentTime));
                        }
                    } catch (e) {}
                }
            });
        } else {
            updateMusicUI();
        }
    } catch (e) {
        // ignore if elements not present on page
    }
});

// Event delegation for dynamic game cards and controls
document.addEventListener('click', function (e) {
    // Buy button on cards
    const buyBtn = e.target.closest('.buy-btn');
    if (buyBtn) {
        e.stopPropagation();
        const id = parseInt(buyBtn.getAttribute('data-game-id'), 10);
        const title = buyBtn.getAttribute('data-game-title') || '';
        buyGame(title, id);
        return;
    }

    // Modal buy buttons
    const modalBuy = e.target.closest('.modal-buy-btn');
    if (modalBuy) {
        const id = parseInt(modalBuy.getAttribute('data-game-id'), 10);
        const title = modalBuy.getAttribute('data-game-title') || '';
        buyGame(title, id);
        return;
    }

    // Wishlist buttons
    const wishlistBtn = e.target.closest('.modal-wishlist-btn') || e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
        const id = parseInt(wishlistBtn.getAttribute('data-game-id'), 10);
        addToWishlist(id);
        return;
    }

    // Click on game card to view details
    const card = e.target.closest('.game-card');
    if (card && card.hasAttribute('data-game-id')) {
        const id = parseInt(card.getAttribute('data-game-id'), 10);
        viewGameDetail(id);
        return;
    }

    // Filter buttons (store page)
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn && filterBtn.dataset.category) {
        const category = filterBtn.dataset.category;
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        filterGames(category);
        // Update URL param without reloading
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('category', category);
            history.replaceState(null, '', url);
        } catch (e) {
            // ignore if URL constructor not supported
        }
        return;
    }

    // Support link click: open support modal (handled by JS)
    const supportLink = e.target.closest('.support-link');
    if (supportLink) {
        e.preventDefault();
        showSupportModal();
        return;
    }

    // Category cards (categories page) with data-category
    // Scope to elements inside <main> to avoid matching unrelated elements (e.g., nav)
    const categoryCard = e.target.closest('main [data-category]');
    if (categoryCard && categoryCard.dataset.category) {
        const category = categoryCard.dataset.category;
        const currentPage = window.location.pathname.split('/').pop();
        // If already on store page, just filter; otherwise navigate to store with category param
        if (currentPage === 'store.html' || currentPage === 'store') {
            // Update active state for filter buttons if present
            const btn = document.querySelector(`.filter-btn[data-category="${category}"]`);
            if (btn) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            filterGames(category);
        } else {
            window.location.href = `store.html?category=${encodeURIComponent(category)}`;
        }
        return;
    }

    // Hero buy button
    const heroBuy = e.target.closest('#heroBuyBtn');
    if (heroBuy) {
        const id = parseInt(heroBuy.getAttribute('data-game-id'), 10);
        const game = typeof getGameById === 'function' ? getGameById(id) : null;
        if (game) buyGame(game.title, id);
        return;
    }
});

// --- SPA-style navigation: fetch and replace <main> to keep audio element persistent ---
(function () {
    // Only handle same-origin internal HTML pages
    function isSameOriginInternalLink(anchor) {
        if (!anchor || !anchor.href) return false;
        try {
            const url = new URL(anchor.href, window.location.href);
            return url.origin === window.location.origin && url.pathname.endsWith('.html');
        } catch (e) {
            return false;
        }
    }

    async function loadPage(href, push = true) {
        try {
                        // Capture current audio state so we can restore it after replacing <main>
                        const existingAudio = document.getElementById('bgAudio');
                        const savedAudioState = existingAudio ? {
                            currentTime: existingAudio.currentTime || 0,
                            isPlaying: !existingAudio.paused && !existingAudio.ended,
                            volume: existingAudio.volume
                        } : null;

                const res = await fetch(href, { credentials: 'same-origin' });
            if (!res.ok) {
                window.location.href = href; // fallback to full load
                return;
            }
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Replace <main>
            const newMain = doc.querySelector('main');
            const curMain = document.querySelector('main');
            if (newMain && curMain) {
                curMain.replaceWith(newMain);
            }

            // Update title
            if (doc.title) document.title = doc.title;

            // Update URL and history
            if (push) history.pushState({ url: href }, '', href);

                    // Execute inline scripts from the fetched doc (only those inside <main> or marked data-reload)
                    const inlineScripts = Array.from(doc.querySelectorAll('script')).filter(s => !s.src);
            inlineScripts.forEach(s => {
                try {
                    const script = document.createElement('script');
                    script.type = s.type || 'text/javascript';
                    script.text = s.textContent;
                    document.body.appendChild(script).parentNode.removeChild(script);
                } catch (e) {}
            });

                    // Some pages register handlers on DOMContentLoaded; when loading via SPA those
                    // handlers won't run because the event already fired. Dispatch a DOMContentLoaded
                    // and a small custom event so inline page scripts can initialize as if the page
                    // was loaded normally.
                    try {
                        document.dispatchEvent(new Event('DOMContentLoaded'));
                        document.dispatchEvent(new CustomEvent('spa:pageLoaded', { detail: { url: href } }));
                    } catch (e) {
                        // ignore if dispatch fails
                    }

            // Optionally run a small hook if page defines window.pageInit
            if (typeof window.pageInit === 'function') {
                try { window.pageInit(); } catch (e) {}
            }

            // scroll to top of new content
            window.scrollTo(0, 0);
                            // Restore audio state (use savedAudioState to avoid restart)
                    try {
                        if (savedAudioState) {
                            // Prefer the existing audio element if still present
                            let bg = document.getElementById('bgAudio');
                            if (!bg && existingAudio) {
                                // re-attach the previous audio element if it was removed for any reason
                                document.body.appendChild(existingAudio);
                                bg = existingAudio;
                            }

                                        if (bg) {
                                // restore volume immediately
                                try { bg.volume = savedAudioState.volume; } catch (e) {}

                                // attempt to set currentTime (may require loadedmetadata)
                                function trySetTime() {
                                    try {
                                        if (!isNaN(savedAudioState.currentTime) && savedAudioState.currentTime > 0 && savedAudioState.currentTime < bg.duration) {
                                            bg.currentTime = savedAudioState.currentTime;
                                        }
                                    } catch (e) {}
                                }

                                if (bg.readyState > 0) {
                                    trySetTime();
                                } else {
                                    bg.addEventListener('loadedmetadata', trySetTime, { once: true });
                                }

                                // resume playback if it was playing prior to navigation
                                if (savedAudioState.isPlaying) {
                                    bg.play().catch(() => {});
                                }
                            }
                        }
                    } catch (e) {
                        // ignore audio restore errors
                    }
        } catch (err) {
            console.error('SPA load failed, falling back to full navigation', err);
            window.location.href = href;
        }
    }

    // Intercept clicks on internal nav links
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a');
        if (!a) return;
        if (a.target === '_blank' || a.hasAttribute('download') || a.getAttribute('href').startsWith('#')) return;
        if (!isSameOriginInternalLink(a)) return;
        e.preventDefault();
        loadPage(a.getAttribute('href'));
    });

    // Handle back/forward
    window.addEventListener('popstate', function (e) {
        const url = location.pathname.split('/').pop() || 'index.html';
        loadPage(url, false);
    });
})();

// Helper function to search games (separate from the debounced function)
function searchGamesFromData(query) {
    // Call the data search function defined in games.js (global)
    if (typeof window.searchGames === 'function') {
        return window.searchGames(query);
    }
    // Fallback: empty array
    return [];
}

// Create and show support modal
function showSupportModal() {
    const modalId = 'supportModal';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = modalId;
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Support Center</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">Butuh bantuan cepat? Pilih salah satu topik atau hubungi tim support kami.</p>
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="text-white">Topik Populer</h6>
                                <ul class="list-unstyled">
                                    <li><a class="link-light" href="#">Refund & Pengembalian Dana</a></li>
                                    <li><a class="link-light" href="#">Masalah Aktivasi</a></li>
                                    <li><a class="link-light" href="#">Panduan Instalasi</a></li>
                                    <li><a class="link-light" href="#">Laporan Bug</a></li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-white">Hubungi Kami</h6>
                                <p class="mb-1">Email: <a class="link-light" href="mailto:support@coreiigether.id">support@coreiigether.id</a></p>
                                <p class="mb-1">Telepon: <span class="text-muted">(021) 1234-5678 (Senin-Jumat 09:00-17:00)</span></p>
                                <p class="mt-3"><a href="contact.html" class="btn btn-outline-gamestore btn-sm">Buka Halaman Kontak</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-outline-gamestore" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Improve featured/promo loaders to avoid duplicating content on repeated calls
// (replace innerHTML instead of appending)