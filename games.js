// games.js - Game data and related functions

// Game data
const games = [
    {
        id: 1,
        title: "Cyberpunk 2077",
        genre: "RPG, Action",
        price: 499000,
        discount: 20,
        image: "bahan/cyberpunk_20771.JPG",
        featured: true,
        promo: false,
        description: "Cyberpunk 2077 adalah game RPG aksi-petualangan open world yang berlatar di Night City, kota metropolitan yang obsesif dengan kekuasaan, glamor, dan modifikasi tubuh.",
        rating: 4.5,
        developer: "CD Projekt Red",
        releaseDate: "2020-12-10",
        platforms: ["PC", "PlayStation", "Xbox"]
    },
    {
        id: 2,
        title: "The Witcher 3: Wild Hunt",
        genre: "RPG, Adventure",
        price: 299000,
        discount: 0,
        image: "bahan/the_wwh1.JPG",
        featured: true,
        promo: false,
        description: "Game RPG yang memenangkan banyak penghargaan, menceritakan kisah Geralt dari Rivia, pemburu monster di dunia fantasi yang luas.",
        rating: 4.8,
        developer: "CD Projekt Red",
        releaseDate: "2015-05-19",
        platforms: ["PC", "PlayStation", "Xbox", "Switch"]
    },
    {
        id: 3,
        title: "Elden Ring",
        genre: "Action RPG",
        price: 699000,
        discount: 15,
        image: "bahan/elden_ring.jpg",
        featured: true,
        promo: true,
        description: "Game RPG aksi yang dikembangkan oleh FromSoftware, menampilkan dunia terbuka yang luas dengan cerita yang ditulis oleh George R. R. Martin.",
        rating: 4.7,
        developer: "FromSoftware",
        releaseDate: "2022-02-25",
        platforms: ["PC", "PlayStation", "Xbox"]
    },
    {
        id: 4,
        title: "Red Dead Redemption 2",
        genre: "Action, Adventure",
        price: 599000,
        discount: 30,
        image: "bahan/rdr_2.jpg",
        featured: false,
        promo: true,
        description: "Kisah epik penjahat Arthur Morgan dan geng Van der Linde yang terkenal, melarikan diri di jantung Amerika.",
        rating: 4.9,
        developer: "Rockstar Games",
        releaseDate: "2019-11-05",
        platforms: ["PC", "PlayStation", "Xbox"]
    },
    {
        id: 5,
        title: "God of War: Ragnarok",
        genre: "Action, Adventure",
        price: 749000,
        discount: 10,
        image: "bahan/godofwar.jpg",
        featured: true,
        promo: false,
        description: "Kisah lanjutan Kratos dan Atreus saat mereka melakukan perjalanan melalui Nine Realms untuk menghadapi Ragnarok.",
        rating: 4.8,
        developer: "Santa Monica Studio",
        releaseDate: "2022-11-09",
        platforms: ["PlayStation"]
    },
    {
        id: 6,
        title: "Hogwarts Legacy",
        genre: "Action RPG",
        price: 649000,
        discount: 25,
        image: "bahan/hogwarts_legacy1.jpg",
        featured: false,
        promo: true,
        description: "Game RPG aksi yang berlatar di dunia Harry Potter pada abad ke-19, memungkinkan pemain menjadi siswa di Hogwarts.",
        rating: 4.6,
        developer: "Avalanche Software",
        releaseDate: "2023-02-10",
        platforms: ["PC", "PlayStation", "Xbox", "Switch"]
    },
    {
        id: 7,
        title: "Call of Duty: Modern Warfare II",
        genre: "FPS, Action",
        price: 799000,
        discount: 0,
        image: "bahan/cod.jpg",
        featured: true,
        promo: false,
        description: "Kelanjutan dari reboot 2019, menampilkan kampanye single-player yang intens dan multiplayer yang kompetitif.",
        rating: 4.3,
        developer: "Infinity Ward",
        releaseDate: "2022-10-28",
        platforms: ["PC", "PlayStation", "Xbox"]
    },
    {
        id: 8,
        title: "FIFA 23",
        genre: "Sports, Simulation",
        price: 699000,
        discount: 40,
        image: "bahan/fifa23.JPG",
        featured: false,
        promo: true,
        description: "Game simulasi sepak bola terbaru dari EA Sports dengan fitur HyperMotion2 dan FIFA World Cup.",
        rating: 4.2,
        developer: "EA Sports",
        releaseDate: "2022-09-30",
        platforms: ["PC", "PlayStation", "Xbox", "Switch"]
    },
    {
        id: 9,
        title: "Starfield",
        genre: "RPG, Sci-Fi",
        price: 699000,
        discount: 0,
        image: "bahan/starfield.JPG",
        featured: true,
        promo: false,
        description: "Game RPG epik baru dari Bethesda Game Studios yang membawa pemain ke luar angkasa.",
        rating: 4.4,
        developer: "Bethesda Game Studios",
        releaseDate: "2023-09-06",
        platforms: ["PC", "Xbox"]
    },
    {
        id: 10,
        title: "Baldur's Gate 3",
        genre: "RPG, Adventure",
        price: 599000,
        discount: 20,
        image: "bahan/bod.jpg",
        featured: true,
        promo: true,
        description: "Game RPG yang dibuat oleh Larian Studios, berdasarkan aturan Dungeons & Dragons.",
        rating: 4.9,
        developer: "Larian Studios",
        releaseDate: "2023-08-03",
        platforms: ["PC", "PlayStation", "Xbox"]
    }
];

// Get all games
function getAllGames() {
    return games;
}

// Get featured games
function getFeaturedGames() {
    return games.filter(game => game.featured);
}

// Get promo games
function getPromoGames() {
    return games.filter(game => game.promo);
}

// Get game by ID
function getGameById(id) {
    return games.find(game => game.id === id);
}

// Get games by genre
function getGamesByGenre(genre) {
    return games.filter(game => 
        game.genre.toLowerCase().includes(genre.toLowerCase())
    );
}

// Search games
function searchGames(query) {
    const searchTerm = query.toLowerCase();
    return games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) || 
        game.genre.toLowerCase().includes(searchTerm) ||
        game.developer.toLowerCase().includes(searchTerm)
    );
}

// Calculate discount price
function calculateDiscountPrice(price, discount) {
    return discount > 0 ? price * (1 - discount/100) : price;
}

// Create game card HTML
function createGameCard(game) {
    const discountPrice = calculateDiscountPrice(game.price, game.discount);
    
    return `
        <div class="col-md-6 col-lg-3">
            <div class="game-card fade-in" data-game-id="${game.id}" tabindex="0" role="button" aria-label="Lihat detail ${game.title}">
                    <img src="${game.image}" class="card-img-top" alt="${game.title}">
                <div class="game-card-body">
                    <h5 class="game-title">${game.title}</h5>
                    <p class="game-genre">${game.genre}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            ${game.discount > 0 ? `
                                <span class="original-price">Rp ${game.price.toLocaleString('id-ID')}</span>
                                <span class="game-price discount">Rp ${discountPrice.toLocaleString('id-ID')}</span>
                            ` : `
                                <span class="game-price">Rp ${game.price.toLocaleString('id-ID')}</span>
                            `}
                        </div>
                        ${game.discount > 0 ? `<span class="badge-discount">-${game.discount}%</span>` : ''}
                    </div>
                    <div class="mt-2">
                        <span class="text-warning">
                            ${'★'.repeat(Math.floor(game.rating))}${'☆'.repeat(5 - Math.floor(game.rating))}
                        </span>
                        <span class="text-secondary ms-2">${game.rating}</span>
                    </div>
                    <button class="btn btn-primary-gamestore w-100 mt-3 buy-btn" data-game-id="${game.id}" data-game-title="${game.title}">
                        <i class="fas fa-shopping-cart me-1"></i> Beli
                    </button>
                    <button class="btn btn-outline-gamestore w-100 mt-2 wishlist-btn" data-game-id="${game.id}" title="Tambah ke Wishlist">
                        <i class="far fa-heart me-1"></i> Tambah ke Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create game detail modal HTML
function createGameDetailModal(game) {
    const discountPrice = calculateDiscountPrice(game.price, game.discount);
    
    return `
        <div class="modal-header">
            <h5 class="modal-title">${game.title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6">
                    <img src="${game.image}" class="img-fluid rounded mb-3" alt="${game.title}">
                </div>
                <div class="col-md-6">
                    <p><strong>Genre:</strong> ${game.genre}</p>
                    <p><strong>Developer:</strong> ${game.developer}</p>
                    <p><strong>Rating:</strong> 
                        <span class="text-warning">
                            ${'★'.repeat(Math.floor(game.rating))}${'☆'.repeat(5 - Math.floor(game.rating))}
                        </span>
                        ${game.rating}
                    </p>
                    <p><strong>Tanggal Rilis:</strong> ${new Date(game.releaseDate).toLocaleDateString('id-ID')}</p>
                    <p><strong>Platform:</strong> ${game.platforms.join(', ')}</p>
                    <hr>
                    <p>${game.description}</p>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            ${game.discount > 0 ? `
                                <span class="original-price">Rp ${game.price.toLocaleString('id-ID')}</span>
                                <span class="game-price discount">Rp ${discountPrice.toLocaleString('id-ID')}</span>
                            ` : `
                                <span class="game-price">Rp ${game.price.toLocaleString('id-ID')}</span>
                            `}
                            ${game.discount > 0 ? `<span class="badge-discount ms-2">-${game.discount}%</span>` : ''}
                        </div>
                        <button type="button" class="btn btn-primary-gamestore modal-buy-btn" data-game-id="${game.id}" data-game-title="${game.title}">Beli Sekarang</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-gamestore" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="btn btn-primary-gamestore modal-wishlist-btn" data-game-id="${game.id}">
                <i class="far fa-heart me-1"></i> Tambah ke Wishlist
            </button>
        </div>
    `;
}