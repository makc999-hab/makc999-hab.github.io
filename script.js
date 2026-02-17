// Получаем ссылки на элементы DOM
const modal = document.getElementById("loginModal");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.querySelector(".auth.email"); // Кнопка "Войти" для email/password

// Открытие модального окна при клике на кнопку "Start free 14 trial"
document.querySelector(".btn").onclick = () => {
  modal.classList.remove("hidden");
};

// Закрытие модального окна при клике на крестик
document.getElementById("closeModal").onclick = () => {
  modal.classList.add("hidden");
};

// Инициализация Firebase
// Замени "ТВОЙ_API_KEY" и "ТВОЙ_АUTH_DOMAIN" на свои данные из Firebase Console
firebase.initializeApp({
  apiKey: "eae160e9cc7d3392ef33e64a9e004867685ebc20", // Например: "AIzaSyCq3M2h2Q1p7l9d8f6e4c0b5aXyZ"
  authDomain: "emailpassword-2b4ee" // Например: "emailpassword-2b4ee.firebaseapp.com"
});

// Получаем объект для работы с аутентификацией
const auth = firebase.auth();

// Обработчик клика для кнопки "Войти" (Email/Password)
loginButton.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Пользователь успешно вошел
      alert("Успешный вход!");
      modal.classList.add("hidden"); // Скрываем модальное окно после успешного входа
      // Здесь ты можешь добавить логику для обновления UI или перенаправления
      console.log("Вошел пользователь:", userCredential.user);
    })
    .catch(err => {
      // Обработка ошибок входа
      alert("Ошибка входа: " + err.message);
      console.error("Ошибка входа:", err);
    });
};

// Дополнительно: ты можешь добавить обработчик для регистрации, если тебе нужна такая кнопка
// Например, если у тебя есть кнопка "Зарегистрироваться"
/*
const registerButton = document.getElementById("registerButton"); // Пример ID для кнопки регистрации
if (registerButton) {
  registerButton.onclick = () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("Успешная регистрация: " + userCredential.user.email);
        modal.classList.add("hidden");
      })
      .catch((error) => {
        alert("Ошибка регистрации: " + error.message);
      });
  };
}
*/
