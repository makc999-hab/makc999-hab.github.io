// script.js - Полный функционал для сайта нейросетей с ЮKassa

// ==================== ИНИЦИАЛИЗАЦИЯ FIREBASE ====================
const firebaseConfig = {
    apiKey: "AIzaSyASqc9Jo5ODXA2byMbxwiGpkaN3D8LjAgA",
    authDomain: "emailpassword-2b4ee.firebaseapp.com",
    projectId: "emailpassword-2b4ee",
    storageBucket: "emailpassword-2b4ee.firebasestorage.app",
    messagingSenderId: "709991576503",
    appId: "1:709991576503:web:4eb22f1d2ab40aee9fae32",
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ==================== DOM ЭЛЕМЕНТЫ ====================
const userMenu = document.getElementById('userMenu');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const modalActionBtn = document.getElementById('modalActionBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const searchInput = document.getElementById('searchInput');
const categoryChips = document.querySelectorAll('.category-chip');
const cardsGrid = document.getElementById('cardsGrid');

// ==================== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ====================
let currentUser = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let recentBots = JSON.parse(localStorage.getItem('recentBots')) || [];
let isLoginMode = true;
let userTokens = JSON.parse(localStorage.getItem('userTokens')) || {
    balance: 0,
    purchases: []
};

// ==================== КОНФИГУРАЦИЯ БОТОВ ====================
const botsData = [
    // ===== ПОПУЛЯРНЫЕ =====
    {
        id: 'chatgpt52',
        name: 'ChatGPT 5.2',
        description: 'Новейшая нейросеть от OpenAI. Модель ChatGPT 5.2 является мощнейшей нейросетью в мире для решения задач и бизнес кейсов.',
        tags: ['Тексты', 'Код', 'Анализ', 'Бизнес'],
        rating: 4.98,
        users: '65 493',
        tokenPrice: 30,
        badge: 'NEW',
        category: 'популярные'
    },
    {
        id: 'nano-banana',
        name: 'Nano Banana Pro',
        description: 'Лучшая нейросеть для генерации изображений и редактирования фотографий. Создание и редактирование фотографий на основе нейросетей Google.',
        tags: ['Изображения', 'Редактирование', 'Дизайн'],
        rating: 4.90,
        users: '93 688',
        tokenPrice: 55,
        badge: 'HOT',
        category: 'популярные'
    },
    {
        id: 'video-generator',
        name: 'Генератор видео',
        description: 'Генерация реалистичного видео по тексту и картинке. Нейросеть точно передаст движение, освещение и эмоции.',
        tags: ['Видео', 'Анимация', 'Творчество'],
        rating: 4.98,
        users: '689 010',
        tokenPrice: 150,
        badge: 'HOT',
        category: 'популярные'
    },
    {
        id: 'presentation-pro',
        name: 'Генератор презентаций PRO',
        description: 'Мощная нейросеть для генерации стильных презентаций за 5 минут. Автоматическая верстка, подбор изображений и анимаций.',
        tags: ['Презентации', 'Бизнес', 'Дизайн'],
        rating: 5.00,
        users: '498 760',
        tokenPrice: 300,
        badge: 'TOP',
        category: 'популярные'
    },
    // ===== ТВОРЧЕСТВО =====
    {
        id: 'image-generator',
        name: 'Генератор изображений',
        description: 'Измени стиль своей фотографии или создай картинку по тексту. Универсальный инструмент для творчества.',
        tags: ['Изображения', 'Творчество', 'Дизайн'],
        rating: 4.85,
        users: '234 567',
        tokenPrice: 50,
        badge: '',
        category: 'творчество'
    },
    {
        id: 'suno',
        name: 'Suno',
        description: 'Нейросеть для генерации музыки и песен длительностью до 8 минут. Создавай уникальные треки с помощью AI.',
        tags: ['Музыка', 'Аудио', 'Творчество'],
        rating: 4.92,
        users: '156 789',
        tokenPrice: 60,
        badge: 'NEW',
        category: 'творчество'
    },
    {
        id: 'sora2',
        name: 'Sora 2',
        description: 'Лучшая нейросеть для генерации видео от OpenAI. Создавай реалистичные видео любой сложности.',
        tags: ['Видео', 'AI', 'Творчество'],
        rating: 4.99,
        users: '789 012',
        tokenPrice: 300,
        badge: 'NEW',
        category: 'творчество'
    },
    {
        id: 'image-animation',
        name: 'Оживление картинок',
        description: 'Создай анимацию своей фотографии. Оживляй изображения и создавай уникальные анимированные арты.',
        tags: ['Анимация', 'Изображения', 'Творчество'],
        rating: 4.78,
        users: '45 678',
        tokenPrice: 200,
        badge: '',
        category: 'творчество'
    },
    {
        id: 'google-veo',
        name: 'Google Veo 3.1',
        description: 'Лучшая модель для генерации видео от Google. Высокое качество и реалистичность.',
        tags: ['Видео', 'Google', 'AI'],
        rating: 4.95,
        users: '123 456',
        tokenPrice: 300,
        badge: 'HOT',
        category: 'творчество'
    },
    {
        id: 'midjourney',
        name: 'Midjourney',
        description: 'Самый мощный генератор изображений в мире. Создавай уникальные арты, иллюстрации и концепт-арты.',
        tags: ['Изображения', 'Дизайн', 'Арт'],
        rating: 4.9,
        users: '856K',
        tokenPrice: 30,
        badge: '',
        category: 'творчество'
    },
    {
        id: 'kling-turbo',
        name: 'Kling 2.5 Turbo',
        description: 'Создавай качественные видео в лучшей нейросети от Kling. Быстрая генерация и отличное качество.',
        tags: ['Видео', 'Анимация', 'Kling'],
        rating: 4.88,
        users: '67 890',
        tokenPrice: 200,
        badge: 'TURBO',
        category: 'творчество'
    },
    {
        id: 'feb-photo',
        name: 'Фотосессия к 14 февраля',
        description: 'Нейросеть, которая умеет создавать фото в стиле 14-го февраля. Романтичные и праздничные изображения.',
        tags: ['Фото', 'Праздник', 'Романтика'],
        rating: 4.75,
        users: '12 345',
        tokenPrice: 55,
        badge: 'СЕЗОН',
        category: 'творчество'
    },
    {
        id: 'feb-song',
        name: 'Песня к 14 февраля',
        description: 'Нейросеть, которая создаст песню про твою вторую половинку. Уникальная музыка в подарок.',
        tags: ['Музыка', 'Праздник', 'Романтика'],
        rating: 4.82,
        users: '8 765',
        tokenPrice: 60,
        badge: 'СЕЗОН',
        category: 'творчество'
    },
    {
        id: 'love-card',
        name: 'Открытка в стиле Love is...',
        description: 'Нейросеть, которая создает открытки в стиле Love is... Романтичные и трогательные изображения.',
        tags: ['Открытки', 'Дизайн', 'Романтика'],
        rating: 4.79,
        users: '6 543',
        tokenPrice: 55,
        badge: '',
        category: 'творчество'
    },
    {
        id: 'eleven-labs',
        name: 'Eleven Labs (озвучка текста)',
        description: 'Нейросеть, которая умеет озвучивать любой текст разными голосами. Реалистичная озвучка с эмоциями.',
        tags: ['Аудио', 'Озвучка', 'Голос'],
        rating: 4.94,
        users: '234 567',
        tokenPrice: 60,
        badge: 'AUDIO',
        category: 'творчество'
    },
    // ===== ПРЯМЫЕ НЕЙРОСЕТИ =====
    {
        id: 'gemini-pro',
        name: 'Gemini 3 Pro',
        description: 'Самая мощная нейросеть от Google. Мультимодальная модель для работы с текстом, изображениями и видео.',
        tags: ['Текст', 'Мульти', 'Google'],
        rating: 4.95,
        users: '345 678',
        tokenPrice: 25,
        badge: 'PRO',
        category: 'прямые нейросети'
    },
    {
        id: 'chatgpt51',
        name: 'ChatGPT 5.1',
        description: 'Новая модель от OpenAI, которая знает ответ на любой вопрос. Улучшенная логика и понимание.',
        tags: ['Тексты', 'Код', 'Анализ'],
        rating: 4.92,
        users: '456 789',
        tokenPrice: 25,
        badge: '',
        category: 'прямые нейросети'
    },
    {
        id: 'chatgpt5',
        name: 'ChatGPT 5',
        description: 'Мощнейшая модель от OpenAI, которая умеет думать. Решение сложных задач и глубокий анализ.',
        tags: ['Тексты', 'Код', 'Логика'],
        rating: 4.89,
        users: '567 890',
        tokenPrice: 25,
        badge: '',
        category: 'прямые нейросети'
    },
    {
        id: 'kling26',
        name: 'Kling 2.6',
        description: 'Новейшая модель от Kling, которая генерирует видео со звуком. Полный пакет аудиовизуального контента.',
        tags: ['Видео', 'Аудио', 'Kling'],
        rating: 4.97,
        users: '89 012',
        tokenPrice: 300,
        badge: 'AUDIO',
        category: 'прямые нейросети'
    },
    // ===== УЧЕБА И РАБОТА =====
    {
        id: 'presentation-generator',
        name: 'Генератор презентаций',
        description: 'Нейросеть которая создает презентации за 5 минут. Автоматическая структура, дизайн и контент.',
        tags: ['Презентации', 'Бизнес', 'Учеба'],
        rating: 4.93,
        users: '123 456',
        tokenPrice: 300,
        badge: 'FAST',
        category: 'учеба и работа'
    },
    {
        id: 'claude',
        name: 'Claude',
        description: 'Анализ документов и работа с длинными текстами. Отлично подходит для научных работ и исследований.',
        tags: ['Документы', 'Анализ', 'Наука'],
        rating: 4.7,
        users: '234K',
        tokenPrice: 35,
        badge: '',
        category: 'учеба и работа'
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        description: 'Поиск с AI и актуальными данными. Идеально для исследований и поиска проверенной информации.',
        tags: ['Поиск', 'Исследования', 'Факты'],
        rating: 4.8,
        users: '345K',
        tokenPrice: 40,
        badge: '',
        category: 'учеба и работа'
    }
];

// ==================== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПУТИ К ИКОНКЕ ====================
function getIconPath(botId) {
    switch(botId) {
        case 'chatgpt52': return 'images/chatgpt.webp';
        case 'nano-banana': return 'images/nanobananapro.png';
        case 'video-generator': return 'images/generatorvidio.webp';
        case 'presentation-pro': return 'images/generatoppresent.png';
        case 'image-generator': return 'images/generatorimg.webp';
        case 'suno': return 'images/suno.webp';
        case 'sora2': return 'images/sora2.webp';
        case 'image-animation': return 'images/ojivimg.webp';
        case 'google-veo': return 'images/googleveo.webp';
        case 'midjourney': return 'images/midjorney.webp';
        case 'kling-turbo': return 'images/king.webp';
        case 'feb-photo': return 'images/potosesii.png';
        case 'feb-song': return 'images/songfefral.webp';
        case 'love-card': return 'images/loveis.webp';
        case 'eleven-labs': return 'images/elevenlabs.webp';
        case 'gemini-pro': return 'images/gemini3pro.webp';
        case 'chatgpt51': return 'images/chatgpt.webp';
        case 'chatgpt5': return 'images/chatgpt.webp';
        case 'kling26': return 'images/king26.webp';
        case 'presentation-generator': return 'images/generatoppresent.png';
        case 'claude': return 'images/claude.webp';
        case 'perplexity': return 'images/perplexity.webp';
        default: return 'images/chatgpt.webp';
    }
}

// ==================== ОТОБРАЖЕНИЕ КАРТОЧЕК ====================
function renderBots(botsToRender = botsData) {
    if (!cardsGrid) return;
    
    cardsGrid.innerHTML = '';
    
    botsToRender.forEach(bot => {
        const isFavorite = favorites.includes(bot.id);
        const card = document.createElement('div');
        card.className = 'neural-card';
        card.dataset.botId = bot.id;
        card.dataset.category = bot.category;
        
        card.innerHTML = `
            ${bot.badge ? `<span class="card-badge">${bot.badge}</span>` : ''}
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div class="card-icon">
                    <img src="${getIconPath(bot.id)}" 
                         alt="${bot.name}" 
                         class="bot-icon-image">
                </div>
                <span class="card-token-price-top">⚡ ${bot.tokenPrice}</span>
            </div>
            <h3 class="card-title">${bot.name}</h3>
            <p class="card-description">${bot.description}</p>
            <div class="card-tags">
                ${bot.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-stats-container">
                <div class="card-stats">
                    <span class="stat"><span class="stat-star">★</span> ${bot.rating}</span>
                    <span class="stat">👤 ${bot.users}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-bot="${bot.id}">
                    ${isFavorite ? '★' : '☆'}
                </button>
                <button class="use-btn" data-bot="${bot.id}">Использовать</button>
            </div>
        `;
        
        cardsGrid.appendChild(card);
    });
    
    attachBotEventHandlers();
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
function attachBotEventHandlers() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const botId = btn.dataset.bot;
            toggleFavorite(botId);
        });
    });
    
    document.querySelectorAll('.use-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Пожалуйста, войдите в систему', 'warning');
                openLoginModal();
                return;
            }
            
            const botId = btn.dataset.bot;
            const bot = botsData.find(b => b.id === botId);
            
            addToRecentBots(bot);
            
            // Открываем чат с ботом
            openBotChat(bot);
        });
    });
}

// ==================== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ====================
auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        updateUIForLoggedInUser(user);
        // Загружаем баланс токенов пользователя
        loadUserTokens(user);
    } else {
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser(user) {
    userMenu.innerHTML = `
        <div class="user-profile">
            <span class="user-email">${user.email}</span>
            <span class="user-tokens" style="color: #C084FC; font-weight: 600;">⚡ ${userTokens.balance}</span>
            <button class="btn-outline" id="profileBtn">Профиль</button>
            <button class="btn-outline" id="logoutBtn">Выйти</button>
        </div>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('profileBtn').addEventListener('click', openProfile);
}

function updateUIForLoggedOutUser() {
    userMenu.innerHTML = `
        <button class="btn-outline" id="loginBtn">Войти</button>
        <button class="btn-primary" id="registerBtn">Регистрация</button>
    `;
    
    document.getElementById('loginBtn').addEventListener('click', () => openLoginModal(true));
    document.getElementById('registerBtn').addEventListener('click', () => openLoginModal(false));
}

function logout() {
    auth.signOut().then(() => {
        userTokens = { balance: 0, purchases: [] };
        localStorage.setItem('userTokens', JSON.stringify(userTokens));
        showNotification('Вы успешно вышли из системы', 'success');
    }).catch(error => {
        showNotification('Ошибка при выходе: ' + error.message, 'error');
    });
}

// ==================== ЗАГРУЗКА БАЛАНСА ТОКЕНОВ ====================
async function loadUserTokens(user) {
    try {
        const response = await fetch('/api/get-user-tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.uid,
                email: user.email
            })
        });
        
        const data = await response.json();
        if (data.balance !== undefined) {
            userTokens.balance = data.balance;
            localStorage.setItem('userTokens', JSON.stringify(userTokens));
            updateTokenDisplay();
        }
    } catch (error) {
        console.error('Error loading tokens:', error);
    }
}

function updateTokenDisplay() {
    const tokenDisplay = document.querySelector('.user-tokens');
    if (tokenDisplay) {
        tokenDisplay.textContent = `⚡ ${userTokens.balance}`;
    }
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================
function openLoginModal(isLogin = true) {
    isLoginMode = isLogin;
    loginModal.classList.remove('hidden');
    
    if (isLogin) {
        modalTitle.textContent = 'Добро пожаловать!';
        modalSubtitle.textContent = 'Войдите в StudyAI чтобы продолжить';
        modalActionBtn.textContent = 'Войти';
    } else {
        modalTitle.textContent = 'Создать аккаунт';
        modalSubtitle.textContent = 'Зарегистрируйтесь для доступа к нейросетям';
        modalActionBtn.textContent = 'Зарегистрироваться';
    }
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

// ==================== АУТЕНТИФИКАЦИЯ ====================
if (modalActionBtn) {
    modalActionBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email || !password) {
            showNotification('Введите email и пароль', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }
        
        try {
            if (isLoginMode) {
                await auth.signInWithEmailAndPassword(email, password);
                showNotification('Успешный вход!', 'success');
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
                showNotification('Регистрация успешна!', 'success');
            }
            
            loginModal.classList.add('hidden');
            emailInput.value = '';
            passwordInput.value = '';
        } catch (error) {
            let errorMessage = 'Ошибка: ' + error.message;
            showNotification(errorMessage, 'error');
        }
    });
}

// Социальная аутентификация
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        let provider;
        const social = btn.dataset.social;
        
        if (social === 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else {
            showNotification(`Вход через ${btn.textContent} будет доступен позже`, 'info');
            return;
        }
        
        try {
            await auth.signInWithPopup(provider);
            showNotification('Успешный вход!', 'success');
            loginModal.classList.add('hidden');
        } catch (error) {
            showNotification('Ошибка при входе: ' + error.message, 'error');
        }
    });
});

// ==================== ПОКУПКА ПОДПИСКИ (ЮKassa) ====================
async function buySubscription(priceType) {
    if (!currentUser) {
        showNotification('Войдите в систему', 'warning');
        openLoginModal(true);
        return;
    }
    
    try {
        showNotification('Перенаправление на оплату...', 'info');
        
        const response = await fetch('/.netlify/functions/api/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceType: priceType,
                customerEmail: currentUser.email
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Payment failed');
        }
        
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url; // Перенаправляем на страницу оплаты ЮKassa
        } else {
            showNotification('Ошибка при создании платежа', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Ошибка при оплате: ' + error.message, 'error');
    }
}

// ==================== ПОКУПКА ТОКЕНОВ (ЮKassa) ====================
async function buyTokens(tokenAmount) {
    if (!currentUser) {
        showNotification('Войдите в систему', 'warning');
        openLoginModal(true);
        return;
    }
    
    try {
        showNotification('Перенаправление на оплату...', 'info');
        
        const response = await fetch('/.netlify/functions/api/buy-tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenAmount: tokenAmount,
                customerEmail: currentUser.email
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Payment failed');
        }
        
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            showNotification('Ошибка при создании платежа', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Ошибка при оплате: ' + error.message, 'error');
    }
}

// ==================== ПОИСК И ФИЛЬТРАЦИЯ ====================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredBots = botsData.filter(bot => {
            return bot.name.toLowerCase().includes(searchTerm) ||
                   bot.description.toLowerCase().includes(searchTerm) ||
                   bot.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        
        renderBots(filteredBots);
        
        if (filteredBots.length === 0) {
            showNoResultsMessage();
        }
    });
}

categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        const category = chip.textContent.toLowerCase();
        
        if (category === 'все') {
            renderBots(botsData);
        } else {
            const filteredBots = botsData.filter(bot => 
                bot.category.toLowerCase() === category.toLowerCase() ||
                bot.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
            );
            renderBots(filteredBots);
        }
    });
});

// ==================== ИЗБРАННОЕ ====================
function toggleFavorite(botId) {
    if (!currentUser) {
        showNotification('Войдите, чтобы добавлять в избранное', 'warning');
        openLoginModal(true);
        return;
    }
    
    const index = favorites.indexOf(botId);
    if (index === -1) {
        favorites.push(botId);
        showNotification('Добавлено в избранное', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        if (btn.dataset.bot === botId) {
            btn.classList.toggle('active');
            btn.textContent = btn.classList.contains('active') ? '★' : '☆';
        }
    });
}

// ==================== НЕДАВНИЕ БОТЫ ====================
function addToRecentBots(bot) {
    recentBots = recentBots.filter(b => b.id !== bot.id);
    recentBots.unshift({ 
        id: bot.id, 
        name: bot.name, 
        timestamp: Date.now() 
    });
    recentBots = recentBots.slice(0, 10);
    localStorage.setItem('recentBots', JSON.stringify(recentBots));
}

// ==================== ЧАТ С БОТОМ ====================
function openBotChat(bot) {
    // Проверяем достаточно ли токенов
    if (userTokens.balance < bot.tokenPrice) {
        showNotification(`Недостаточно токенов. Нужно ${bot.tokenPrice} ⚡`, 'warning');
        const continueToChat = confirm('У вас недостаточно токенов. Хотите купить токены?');
        if (continueToChat) {
            window.location.href = '/shop.html';
        }
        return;
    }

    // Создаем модальное окно чата
    const chatModal = document.createElement('div');
    chatModal.className = 'modal chat-modal';
    chatModal.id = 'chatModal';
    
    chatModal.innerHTML = `
        <div class="chat-modal-content">
            <div class="chat-header">
                <div class="chat-header-info">
                    <img src="${getIconPath(bot.id)}" alt="${bot.name}" class="chat-bot-icon" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <h3>${bot.name}</h3>
                        <p class="chat-bot-desc">${bot.description.substring(0, 50)}...</p>
                    </div>
                </div>
                <button class="chat-close" id="closeChat">✕</button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    <img src="${getIconPath(bot.id)}" alt="${bot.name}" class="message-avatar" style="width: 36px; height: 36px; border-radius: 50%;">
                    <div class="message-content bot-message">
                        <p>Здравствуйте! Я ${bot.name}. Чем могу помочь?</p>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <textarea id="chatInput" placeholder="Введите сообщение... (Enter для отправки)" rows="1"></textarea>
                    <button class="chat-send-btn" id="sendMessage">📤</button>
                </div>
                <div class="chat-tools">
                    <button class="chat-tool" id="clearChat">🗑️ Очистить</button>
                    <span class="chat-tool" style="background: rgba(124, 58, 237, 0.2);">⚡ ${bot.tokenPrice} за сообщение</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatModal);
    chatModal.classList.remove('hidden');
    
    // Инициализация чата
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const closeBtn = document.getElementById('closeChat');
    const clearBtn = document.getElementById('clearChat');
    
    // Автоматическое расширение textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Отправка сообщения
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Проверяем токены перед отправкой
        if (userTokens.balance < bot.tokenPrice) {
            showNotification('Недостаточно токенов', 'warning');
            chatModal.remove();
            window.location.href = '/shop.html';
            return;
        }
        
        // Добавляем сообщение пользователя
        addMessageToChat(chatMessages, message, 'user', bot);
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Показываем индикатор печати
        const typingId = showTypingIndicator(chatMessages, bot);
        
        try {
            // Вызываем API через Netlify Function
            const response = await fetch('/.netlify/functions/api/proxy/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: message }]
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Убираем индикатор печати
            document.getElementById(typingId)?.remove();
            
            // Списываем токены
            userTokens.balance -= bot.tokenPrice;
            localStorage.setItem('userTokens', JSON.stringify(userTokens));
            updateTokenDisplay();
            
            // Добавляем ответ
            if (data.choices && data.choices[0]) {
                addMessageToChat(chatMessages, data.choices[0].message.content, 'bot', bot);
            } else {
                addMessageToChat(chatMessages, 'Извините, произошла ошибка. Попробуйте позже.', 'bot', bot);
            }
        } catch (error) {
            document.getElementById(typingId)?.remove();
            addMessageToChat(chatMessages, 'Ошибка соединения. Проверьте настройки API.', 'bot', bot);
            console.error('Chat error:', error);
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    closeBtn.addEventListener('click', () => {
        chatModal.remove();
    });
    
    clearBtn.addEventListener('click', () => {
        chatMessages.innerHTML = `
            <div class="message bot">
                <img src="${getIconPath(bot.id)}" alt="${bot.name}" class="message-avatar" style="width: 36px; height: 36px; border-radius: 50%;">
                <div class="message-content bot-message">
                    <p>Здравствуйте! Я ${bot.name}. Чем могу помочь?</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
    });
    
    chatInput.focus();
}

// Вспомогательная функция для добавления сообщения в чат
function addMessageToChat(container, text, sender, bot) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString();
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content user-message">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-avatar user-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <img src="${getIconPath(bot.id)}" alt="${bot.name}" class="message-avatar" style="width: 36px; height: 36px; border-radius: 50%;">
            <div class="message-content bot-message">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Индикатор печати
function showTypingIndicator(container, bot) {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = id;
    typingDiv.innerHTML = `
        <img src="${getIconPath(bot.id)}" alt="${bot.name}" class="message-avatar" style="width: 36px; height: 36px; border-radius: 50%;">
        <div class="message-content bot-message typing-indicator">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return id;
}

// ==================== ПРОФИЛЬ ====================
function openProfile() {
    const profileModal = document.createElement('div');
    profileModal.className = 'modal';
    profileModal.id = 'profileModal';
    
    const recentBotsHTML = recentBots.length > 0 
        ? recentBots.map(bot => `
            <div class="recent-bot-item" data-bot="${bot.id}">
                <span class="recent-bot-icon">
                    <img src="${getIconPath(bot.id)}" style="width: 32px; height: 32px; border-radius: 50%;">
                </span>
                <span class="recent-bot-name">${bot.name}</span>
                <span class="recent-bot-time">${new Date(bot.timestamp).toLocaleTimeString()}</span>
            </div>
        `).join('') 
        : '<p style="color: #71717A; text-align: center;">Нет недавних ботов</p>';
    
    profileModal.innerHTML = `
        <div class="modal-content profile-modal">
            <button class="modal-close" id="closeProfile">✕</button>
            <h2>Профиль пользователя</h2>
            <div class="profile-info">
                <div class="profile-avatar">
                    ${currentUser ? currentUser.email[0].toUpperCase() : '?'}
                </div>
                <div class="profile-details">
                    <p><strong>Email:</strong> ${currentUser ? currentUser.email : 'Неизвестно'}</p>
                    <p><strong>ID:</strong> ${currentUser ? currentUser.uid.slice(0, 8) + '...' : 'Неизвестно'}</p>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <span class="stat-value">⚡ ${userTokens.balance}</span>
                    <span class="stat-label">Токенов</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${favorites.length}</span>
                    <span class="stat-label">В избранном</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${recentBots.length}</span>
                    <span class="stat-label">Недавние</span>
                </div>
            </div>
            
            <div class="profile-section">
                <h3>Недавние боты</h3>
                <div class="recent-bots-list">
                    ${recentBotsHTML}
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-primary" id="goToShop" style="flex: 1;">🛒 Купить токены</button>
                <button class="btn-outline" id="logoutFromProfile" style="flex: 1;">Выйти</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(profileModal);
    profileModal.classList.remove('hidden');
    
    document.getElementById('closeProfile').addEventListener('click', () => {
        profileModal.remove();
    });
    
    document.getElementById('logoutFromProfile').addEventListener('click', () => {
        logout();
        profileModal.remove();
    });
    
    document.getElementById('goToShop').addEventListener('click', () => {
        profileModal.remove();
        window.location.href = '/shop.html';
    });
    
    document.querySelectorAll('.recent-bot-item').forEach(item => {
        item.addEventListener('click', () => {
            const botId = item.dataset.bot;
            const bot = botsData.find(b => b.id === botId);
            profileModal.remove();
            openBotChat(bot);
        });
    });
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

if (themeToggle && themeIcon) {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">✕</button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// ==================== СООБЩЕНИЕ "НИЧЕГО НЕ НАЙДЕНО" ====================
function showNoResultsMessage() {
    let noResults = document.getElementById('noResultsMessage');
    if (!noResults && cardsGrid) {
        noResults = document.createElement('div');
        noResults.id = 'noResultsMessage';
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <span class="no-results-icon">🔍</span>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос</p>
            </div>
        `;
        cardsGrid.appendChild(noResults);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    renderBots();
    
    // Инициализация кнопок на страницах (если они есть)
    initializePageButtons();
});

// Функция для инициализации кнопок на разных страницах
function initializePageButtons() {
    // Кнопки подписки на странице тарифов
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            buySubscription(plan);
        });
    });
    
    // Кнопки покупки токенов на странице магазина
    document.querySelectorAll('.buy-package-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tokens = btn.dataset.tokens;
            buyTokens(parseInt(tokens));
        });
    });
    
    // Отправка сообщения в поддержку
    const sendSupportBtn = document.getElementById('sendSupportMessage');
    if (sendSupportBtn) {
        sendSupportBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Войдите в систему', 'warning');
                openLoginModal(true);
                return;
            }
            
            const name = document.getElementById('supportName')?.value;
            const email = document.getElementById('supportEmail')?.value;
            const message = document.getElementById('supportMessage')?.value;
            
            if (!message) {
                showNotification('Введите сообщение', 'error');
                return;
            }
            
            showNotification('Сообщение отправлено! Мы ответим в ближайшее время', 'success');
            
            // Очищаем форму
            if (document.getElementById('supportName')) document.getElementById('supportName').value = '';
            if (document.getElementById('supportEmail')) document.getElementById('supportEmail').value = '';
            if (document.getElementById('supportMessage')) document.getElementById('supportMessage').value = '';
        });
    }
    
    // FAQ кнопка
    const faqBtn = document.getElementById('openFaq');
    if (faqBtn) {
        faqBtn.addEventListener('click', () => {
            showNotification('FAQ будет доступен позже', 'info');
        });
    }
}