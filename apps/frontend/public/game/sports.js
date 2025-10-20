async function loadQuestions() {
  const res = await fetch("/quiz/questions.json");
  const data = await res.json();
  return data.sports;
}

function renderQuiz(questions) {
  const container = document.getElementById("quiz-container");
  let score = 0,
    index = 0;

  function showQuestion() {
    if (index >= questions.length) {
      container.innerHTML = `<h2>Game Over! 🎉 Your score: ${score}/${questions.length}</h2>`;
      return;
    }

    const q = questions[index];
    container.innerHTML = `
      <h2>${q.question}</h2>
      ${q.options.map((opt) => `<button>${opt}</button>`).join("")}
    `;

    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.textContent === q.answer) score++;
        index++;
        showQuestion();
      });
    });
  }

  showQuestion();
}

loadQuestions().then(renderQuiz);
