let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// It's good practice to define all DOM element references at the top
let startScreen = document.getElementById('start-screen');
let questionsContainer = document.getElementById('questions');
let timeDisplay = document.getElementById('time');
let finalScoreDisplay = document.getElementById('final-score');
let initialsInput = document.getElementById('initials');
let feedbackContainer = document.getElementById('feedback');
let endScreen = document.getElementById('end-screen');

// Preloading sound effects is a good practice
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  startScreen.classList.add('hide');
  questionsContainer.classList.remove('hide');

  // Reset the currentQuestionIndex and time for quiz restartability
  currentQuestionIndex = 0;
  time = questions.length * 15; // Reset time based on the number of questions

  timerId = setInterval(clockTick, 1000); // Use clockTick function for timer

  getQuestion();
}

function getQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionTitle = document.getElementById('question-title');
  const choices = document.getElementById('choices');

  questionTitle.textContent = currentQuestion.title;
  choices.innerHTML = '';

  currentQuestion.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.className = 'choice-btn'; // It's helpful to add a class for styling and identification
    button.addEventListener('click', questionClick);
    choices.appendChild(button);
  });
}

function questionClick(event) {
  const selectedChoice = event.target.textContent; // Use event.target to identify the clicked button

  // Penalize time or give feedback based on the correctness of the answer
  if (selectedChoice !== questions[currentQuestionIndex].answer) {
    time -= 15;
    sfxWrong.play();
    feedbackContainer.textContent = 'Wrong!';
  } else {
    sfxRight.play();
    feedbackContainer.textContent = 'Correct!';
  }

  feedbackContainer.classList.remove('hide'); // Instead of adding/removing 'feedback', toggle 'hide'
  setTimeout(() => feedbackContainer.classList.add('hide'), 1000);

  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length || time <= 0) {
    endQuiz();
  } else {
    getQuestion();
  }
}

function endQuiz() {
  clearInterval(timerId);
  endScreen.classList.remove('hide');
  finalScoreDisplay.textContent = time;
  questionsContainer.classList.add('hide');
}

function clockTick() {
  time--;
  timeDisplay.textContent = time;
  if (time <= 0) endQuiz();
}

function saveHighScore() {
  const initials = initialsInput.value.trim();
  if (!initials) return;

  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push({ initials, score: time });
  localStorage.setItem('highScores', JSON.stringify(highScores));
  
  // Redirect without using href property to be more compatible with various hosting environments
  window.location.assign('highscores.html');
}

// Event listeners setup
document.getElementById('submit').addEventListener('click', saveHighScore);
document.getElementById('start').addEventListener('click', startQuiz);
// No need for separate onclick for choices; it's handled by questionClick
initialsInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') saveHighScore();
});

