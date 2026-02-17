// script.js - Полный функционал для сайта нейросетей

// ==================== ИНИЦИАЛИЗАЦИЯ FIREBASE ====================
const firebaseConfig = {
    apiKey: "AIzaSyBxXXXXXXXXXXXX", // ВАМ НУЖНО НАЙТИ API KEY!
    authDomain: "emailpassword-2b4ee.firebaseapp.com", // ЭТО ПРАВИЛЬНО
    projectId: "emailpassword-2b4ee", // ЭТО ПРАВИЛЬНО
    storageBucket: "emailpassword-2b4ee.appspot.com", // ЭТО ПРАВИЛЬНО
    messagingSenderId: "XXXXXXXXXXXX", // НУЖНО НАЙТИ
    appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX" // НУЖНО НАЙТИ
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

// ==================== КОНФИГУРАЦИЯ БОТОВ ====================
const botsData = [
    // ===== ПОПУЛЯРНЫЕ =====
    {
        id: 'chatgpt52',
        name: 'ChatGPT 5.2',
        icon: '🤖',
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
        icon: '🍌',
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
        icon: '🎬',
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
        icon: '📊',
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
        icon: '🎨',
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
        icon: '🎵',
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
        icon: '🎥',
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
        icon: '🖼️',
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
        icon: '🎬',
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
        icon: '🎨',
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
        icon: '⚡',
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
        icon: '💝',
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
        icon: '💕',
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
        icon: '💌',
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
        icon: '🎙️',
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
        icon: '🔮',
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
        icon: '🤖',
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
        icon: '🧠',
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
        icon: '🎬',
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
        icon: '📽️',
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
        icon: '📝',
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
        icon: '🌐',
        description: 'Поиск с AI и актуальными данными. Идеально для исследований и поиска проверенной информации.',
        tags: ['Поиск', 'Исследования', 'Факты'],
        rating: 4.8,
        users: '345K',
        tokenPrice: 40,
        badge: '',
        category: 'учеба и работа'
    }
];

// ==================== ОТОБРАЖЕНИЕ КАРТОЧЕК ====================
function renderBots(botsToRender = botsData) {
    cardsGrid.innerHTML = '';
    
    botsToRender.forEach(bot => {
        const isFavorite = favorites.includes(bot.id);
        const card = document.createElement('div');
        card.className = 'neural-card';
        card.dataset.botId = bot.id;
        card.dataset.category = bot.category;
        
        card.innerHTML = `
    ${bot.badge ? `<span class="card-badge">${bot.badge}</span>` : ''}
    <div class="card-icon">${bot.icon}</div>
    <h3 class="card-title">${bot.name}</h3>
    <p class="card-description">${bot.description}</p>
    <div class="card-tags">
        ${bot.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
        <span class="card-token-price">${bot.tokenPrice} токенов</span>
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
    
    // Добавляем обработчики для новых кнопок
    attachBotEventHandlers();
}
// ==================== ПЛАТЕЖИ ====================

// Функция для покупки подписки
async function buySubscription(priceType) {
    if (!currentUser) {
        showNotification('Войдите в систему', 'warning');
        openLoginModal(true);
        return;
    }
    
    try {
        showNotification('Перенаправление на оплату...', 'info');
        
        const response = await fetch('/.netlify/functions/functions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'createSubscription',
                priceType: priceType,
                customerEmail: currentUser.email
            })
        });
        
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url; // Перенаправление на Stripe
        } else {
            showNotification('Ошибка при создании платежа', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Ошибка при оплате', 'error');
    }
}

// Функция для покупки токенов бота
async function buyBotTokens(botKey, amount) {
    if (!currentUser) {
        showNotification('Войдите в систему', 'warning');
        openLoginModal(true);
        return;
    }
    
    try {
        showNotification('Перенаправление на оплату...', 'info');
        
        const response = await fetch('/.netlify/functions/functions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'createBotPayment',
                botKey: botKey,
                amount: amount,
                customerEmail: currentUser.email
            })
        });
        
        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            showNotification('Ошибка при создании платежа', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Ошибка при оплате', 'error');
    }
}
// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================
function attachBotEventHandlers() {
    // Кнопки избранного
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const botId = btn.dataset.bot;
            toggleFavorite(botId);
        });
    });
    
    // Кнопки использования
    document.querySelectorAll('.use-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Пожалуйста, войдите в систему', 'warning');
                openLoginModal();
                return;
            }
            
            const botId = btn.dataset.bot;
            const bot = botsData.find(b => b.id === botId);
            
            // Добавляем в недавние
            addToRecentBots(bot);
            
            // Показываем уведомление
            showNotification(`Чат с ${bot.name} откроется после настройки API`, 'info');
        });
    });
}

// ==================== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ====================
auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser(user) {
    userMenu.innerHTML = `
        <div class="user-profile">
            <span class="user-email">${user.email}</span>
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
        showNotification('Вы успешно вышли из системы', 'success');
    }).catch(error => {
        showNotification('Ошибка при выходе: ' + error.message, 'error');
    });
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

closeModal.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.add('hidden');
    }
});

// ==================== АУТЕНТИФИКАЦИЯ ====================
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
        let errorMessage = 'Ошибка: ';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'Пользователь не найден';
                break;
            case 'auth/wrong-password':
                errorMessage += 'Неверный пароль';
                break;
            case 'auth/email-already-in-use':
                errorMessage += 'Email уже используется';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Неверный формат email';
                break;
            default:
                errorMessage += error.message;
        }
        showNotification(errorMessage, 'error');
    }
});

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
            const result = await auth.signInWithPopup(provider);
            showNotification('Успешный вход!', 'success');
            loginModal.classList.add('hidden');
        } catch (error) {
            showNotification('Ошибка при входе: ' + error.message, 'error');
        }
    });
});

// ==================== ПОИСК И ФИЛЬТРАЦИЯ ====================
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
    
    // Обновляем кнопки
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
        icon: bot.icon, 
        timestamp: Date.now() 
    });
    recentBots = recentBots.slice(0, 10);
    localStorage.setItem('recentBots', JSON.stringify(recentBots));
}

// ==================== ПРОФИЛЬ ====================
function openProfile() {
    const profileModal = document.createElement('div');
    profileModal.className = 'modal';
    profileModal.id = 'profileModal';
    profileModal.innerHTML = `
        <div class="modal-content profile-modal">
            <button class="modal-close" id="closeProfile">✕</button>
            <h2>Профиль пользователя</h2>
            <div class="profile-info">
                <div class="profile-avatar">
                    ${currentUser.email[0].toUpperCase()}
                </div>
                <div class="profile-details">
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>ID:</strong> ${currentUser.uid.slice(0, 8)}...</p>
                </div>
            </div>
            
            <div class="profile-stats">
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
                    ${recentBots.length > 0 ? recentBots.map(bot => `
                        <div class="recent-bot-item" data-bot="${bot.id}">
                            <span class="recent-bot-icon">${bot.icon}</span>
                            <span class="recent-bot-name">${bot.name}</span>
                            <span class="recent-bot-time">${new Date(bot.timestamp).toLocaleTimeString()}</span>
                        </div>
                    `).join('') : '<p style="color: #71717A; text-align: center;">Нет недавних ботов</p>'}
                </div>
            </div>
            
            <button class="btn-primary" id="logoutFromProfile" style="width: 100%;">Выйти</button>
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
    
    document.querySelectorAll('.recent-bot-item').forEach(item => {
        item.addEventListener('click', () => {
            profileModal.remove();
            showNotification('Чат с ботом откроется после настройки API', 'info');
        });
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
    
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
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

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ==================== СООБЩЕНИЕ "НИЧЕГО НЕ НАЙДЕНО" ====================
function showNoResultsMessage() {
    let noResults = document.getElementById('noResultsMessage');
    if (!noResults) {
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
});