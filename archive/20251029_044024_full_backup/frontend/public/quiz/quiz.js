async function loadQuestions(subject) {
  const res = await fetch('/quiz/questions.json');
  const data = await res.json();
  return data[subject];
}

function renderQuiz(questions) {
  const container = document.getElementById('quiz-container');
  let score = 0, index = 0;

  function showQuestion() {
    if (index >= questions.length) {
      container.innerHTML = `<h2>Quiz Complete ✅ Score: ${score}/${questions.length}</h2>`;
      return;
    }

    const q = questions[index];
    container.innerHTML = `
      <h2>${q.question}</h2>
      ${q.options.map(opt => `<button>${opt}</button>`).join('')}
    `;

    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.textContent === q.answer) score++;
        index++;
        showQuestion();
      });
    });
  }

  showQuestion();
}

document.getElementById('subject-select').addEventListener('change', async (e) => {
  const subject = e.target.value;
  const questions = await loadQuestions(subject);
  renderQuiz(questions);
});

// Load default (Maths) on start
loadQuestions('maths').then(renderQuiz);