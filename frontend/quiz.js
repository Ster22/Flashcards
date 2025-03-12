document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://localhost:5000/api";
  const quizSetup = document.getElementById("quiz-setup");
  const quizContainer = document.getElementById("quiz-container");
  const nextBtn = document.getElementById("next-btn");
  const startQuizBtn = document.getElementById("start-quiz-btn");
  const questionCountSelect = document.getElementById("question-count");
  const categorySelect = document.getElementById("category-select");
  const scoreDisplay = document.getElementById("score");

  let flashcards = [];
  let current = 0;
  let isCheckingAnswer = false;
  let randomFlashcards = [];
  let correctAnswers = 0;
  let totalQuestions = 0;

  // Pobierz kategorie i wypełnij listę
  async function loadCategories() {
      try {
          const response = await fetch(`${API_URL}/categories`);
          const categories = await response.json();
          categories.forEach(category => {
              const option = document.createElement("option");
              option.value = category;
              option.textContent = category;
              categorySelect.appendChild(option);
          });
      } catch (err) {
          console.error("Błąd pobierania kategorii:", err);
      }
  }

  // Rozpocznij quiz
  async function startQuiz() {
      const category = categorySelect.value;
      totalQuestions = parseInt(questionCountSelect.value);

      try {
          const response = await fetch(`${API_URL}/flashcards/${category}`);
          flashcards = await response.json();
          randomFlashcards = flashcards.sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
          current = 0;
          correctAnswers = 0;
          isCheckingAnswer = false;

          quizSetup.style.display = "none";
          quizContainer.style.display = "block";
          nextBtn.style.display = "block";
          scoreDisplay.style.display = "block";

          updateScore();
          showQuestion();
      } catch (err) {
          console.error("Błąd pobierania fiszek:", err);
      }
  }

  // Pokaż pytanie
  function showQuestion() {
      if (current >= randomFlashcards.length) {
          endQuiz();
          return;
      }

      quizContainer.innerHTML = `
          <div class="quiz-card">
              <h3>${randomFlashcards[current].question}</h3>
              <input type="text" id="answer-input" placeholder="Wpisz odpowiedź">
          </div>
      `;
      nextBtn.textContent = "Sprawdź odpowiedź";
      nextBtn.classList.remove("correct", "incorrect");
      isCheckingAnswer = false;
  }

  // Sprawdź odpowiedź
  function checkAnswer() {
      const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
      const correctAnswer = randomFlashcards[current].answer.trim().toLowerCase();

      if (userAnswer === correctAnswer) {
          nextBtn.classList.add("correct");
          nextBtn.classList.remove("incorrect");
          correctAnswers++;
      } else {
          nextBtn.classList.add("incorrect");
          nextBtn.classList.remove("correct");
      }

      nextBtn.textContent = "Następne pytanie";
      isCheckingAnswer = true;
      updateScore();
  }

  // Aktualizuj wynik
  function updateScore() {
      const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
      scoreDisplay.innerHTML = `
          <p>Poprawne odpowiedzi: ${correctAnswers} / ${totalQuestions}</p>
          <p>Wynik: ${percentage}%</p>
      `;
  }

  // Zakończ quiz
  function endQuiz() {
      quizContainer.innerHTML = `
          <div class="quiz-card">
              <h3>Quiz zakończony!</h3>
              <p>Twój wynik: ${correctAnswers} / ${totalQuestions}</p>
              <p>Procent poprawnych odpowiedzi: ${((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
              <button id="restart-quiz-btn" class="btn-primary">Zacznij od nowa</button>
          </div>
      `;
      nextBtn.style.display = "none";

      const restartQuizBtn = document.getElementById("restart-quiz-btn");
      restartQuizBtn.addEventListener("click", () => {
          quizSetup.style.display = "block";
          quizContainer.style.display = "none";
          scoreDisplay.style.display = "none";
      });
  }

  // Następne pytanie
  nextBtn.addEventListener("click", () => {
      if (isCheckingAnswer) {
          current++;
          showQuestion();
      } else {
          checkAnswer();
      }
  });

  // Rozpocznij quiz
  startQuizBtn.addEventListener("click", startQuiz);

  // Załaduj kategorie po załadowaniu strony
  loadCategories();
});