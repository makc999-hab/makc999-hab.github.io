// DOM
const modal = document.getElementById("loginModal");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.querySelector(".auth.email");

const question = document.getElementById("question");
const messages = document.getElementById("messages");
const askBtn = document.getElementById("ask");

// Открытие модалки
document.querySelector(".btn").onclick = () => {
  modal.classList.remove("hidden");
};

// Закрытие
document.getElementById("closeModal").onclick = () => {
  modal.classList.add("hidden");
};

// Firebase
firebase.initializeApp({
  apiKey: "ВСТАВЬ_СВОЙ_REAL_API_KEY",
  authDomain: "emailpassword-2b4ee.firebaseapp.com"
});

const auth = firebase.auth();

// Логин
loginButton.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      alert("Успешный вход!");
      modal.classList.add("hidden");
      console.log("User:", user.user.email);
    })
    .catch(err => {
      alert(err.message);
    });
};

// AI Chat
askBtn.onclick = async () => {
  const q = question.value;
  if (!q) return;

  messages.innerHTML += `<p><b>Вы:</b> ${q}</p>`;
  question.value = "";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer ТВОЙ_OPENAI_KEY"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: q }]
    })
  });

  const data = await res.json();
  const answer = data.choices[0].message.content;

  messages.innerHTML += `<p><b>ИИ:</b> ${answer}</p>`;
};
  