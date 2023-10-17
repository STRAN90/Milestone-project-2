//Define the question array at the global scope
const questions = [];

// Wait for DOM to finsih loading before running the game
// Add a click event listener to the start/reset button
document.addEventListener('DOMContentLoaded', function() {
  // Initialize game variables
  let currentQuestionIndex = 0;
  let score = 0;
  let playing = false;
  let timeremaining = 60; // Set desired time

  document.getElementById('startReset').addEventListener('click', () => {
    startGame();
    document.getElementById('gameOver').style.display = 'none';
  });
});

// Function to start or reset the game
function startGame() {
  currentQuestionIndex = 0;
  questions.length = 0; // Clear previous questions
  for (let i = 0; i < 10; i++) { // Generate 10 questions
    questions.push(generateQuestion());
  }
  displayQuestion();

  // Reset the score
  score = 0;
  document.getElementById('scorevalue').textContent = score;

  // Reset the timer
  timeremaining = 60;
  document.getElementById('timeremainingvalue').textContent = timeremaining;

  // Hide game over message
  document.getElementById('gameOver').style.display = 'none';

  // Change the button text to "Reset Game"
  document.getElementById('startReset').textContent = 'Reset Game';

  // Add a timer to count down
  const timerInterval = setInterval(() => {
    timeremaining--;
    document.getElementById('timeremainingvalue').textContent = timeremaining;
    if (timeremaining <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Function to generate random addition and subtraction questions
function generateQuestion() {
  const minNumber = 1;
  const maxNumber = 50;
  let num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  let num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  const operator = Math.random() < 0.5 ? '+' : '-';
  let answer;
  
  if (operator === '+') {
    answer = num1 + num2;
  } else {
    // Ensure there are no negative answers
    if (num1 < num2) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }
    answer = num1 - num2;
  }
  
  const questionText = `${num1} ${operator} ${num2}`;
  
  // Ensure the answer is a positive integer
  if (answer < 0) {
    return generateQuestion();
  }
  
  return { text: questionText, answer };
} 

// Function to display a question and answer choices
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question-area').textContent = question.text;
  
  const answers = [];
  for (let i = 0; i < 4; i++) {
    let randomAnswer;
    do {
      randomAnswer = Math.floor(Math.random() * 40); // Generate random answers
    } while (answers.includes(randomAnswer) || randomAnswer === question.answer);
    answers.push(randomAnswer);
  }
  
  // Replace one of the random answers with the correct answer
  const randomIndex = Math.floor(Math.random() * 4);
  answers[randomIndex] = question.answer;
  
  // Display the answer choices
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById(`box${i + 1}`);
    box.textContent = answers[i];
    box.onclick = () => checkAnswer(answers[i]);
  }
}

// Function to check if the selected answer is correct
function checkAnswer(selectedAnswer) {
  const question = questions[currentQuestionIndex];
  if (selectedAnswer === question.answer) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion(); // Display the next question
    } else {
      endGame();
    }
    displayCorrect(); // Call the function to display the "Correct!" message
  } else {
    displayIncorrect();
  }
}

function displayCorrect() {
  const correctDiv = document.getElementById('correct');
  correctDiv.style.display = 'block'; // Make the "Correct!" message visible
  setTimeout(() => {
    correctDiv.style.display = 'none'; // Hide the message after a certain time (e.g., 1 second)
  }, 1000);
}

function displayIncorrect() {
  const incorrectDiv = document.getElementById('incorrect');
  incorrectDiv.style.display = 'block';
  setTimeout(() => {
    incorrectDiv.style.display = 'none';
  }, 1000);
}

// End the game
function endGame(params) {
  const gameOverDiv = document.getElementById('gameOver');
  gameOverDiv.textContent = 'Game Over';
  gameOverDiv.style.display = 'block';
}

// Add click event to the Start/Reset button
document.getElementById('startReset').addEventListener('click', () => {
  startGame();
  document.getElementById('gameOver').style.display = 'none';
});

