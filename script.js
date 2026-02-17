// Firebase config
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
    projectId: "YOUR_FIREBASE_PROJECT",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Элементы
const signupBtn = document.getElementById('signup-btn');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signup = document.getElementById('signup');
const login = document.getElementById('login');
const closeAuth = document.getElementById('close-auth');
const chat = document.getElementById('chat');
const messages = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send');
const checkoutBtn = document.getElementById('checkout-btn');

// Показываем форму регистрации
signupBtn.onclick = () => authForm.classList.remove('hidden');
closeAuth.onclick = () => authForm.classList.add('hidden');

// Регистрация
signup.onclick = () => {
    auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(() => { alert('Успешно!'); authForm.classList.add('hidden'); chat.classList.remove('hidden'); })
        .catch(err => alert(err.message));
}

// Вход
login.onclick = () => {
    auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(() => { alert('Вход успешен'); authForm.classList.add('hidden'); chat.classList.remove('hidden'); })
        .catch(err => alert(err.message));
}

// Чат с ИИ
sendBtn.onclick = async () => {
    const msg = userInput.value;
    messages.innerHTML += `<p><b>Вы:</b> ${msg}</p>`;
    userInput.value = '';
    
    // Запрос к serverless функции
    const res = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    messages.innerHTML += `<p><b>ИИ:</b> ${data.reply}</p>`;
    messages.scrollTop = messages.scrollHeight;
}

// Оплата через Stripe
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
checkoutBtn.onclick = async () => {
    const res = await fetch('/.netlify/functions/checkout', { method: 'POST' });
    const session = await res.json();
    stripe.redirectToCheckout({ sessionId: session.id });
}