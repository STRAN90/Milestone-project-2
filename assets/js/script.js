// Define the questions array at the global scope
const questions = [];
let score = 0;
let playing = false;
let timeremaining = 60;
let canPlaySound = true; 

// Function to play sound 
function playSound(audioURL) {
    if (canPlaySound === true) {
        const audio = new Audio(audioURL);
        audio.play();
    }
}

// Function to show an element by changing its display style to 'block'
function show(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

// Function to hide an element by changing its display style to 'none'
function hide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Wrap your code in a event listener to Start/Reset button
document.getElementById('startReset').addEventListener('click', () => {
    startGame();
});

// Function to start the game
function startGame() {
    // Check if 'playing' is false (not playing)
    if (!playing) {
        currentQuestionIndex = 0;
        // Reset the timer and score
        timeremaining = 60;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        score = 0;
        document.getElementById("scoreValue").innerHTML = score;
        // Change mode to playing
        show("timeRemaining");
        hide("gameOver");
        hide("correct");
        hide("incorrect");
        document.getElementById("startReset").innerHTML = "Reset Game";
        startCountdown();
        questions.length = 0; // Clear previous questions
        for (let i = 0; i < 10; i++) { // Generate 10 questions
            questions.push(generateQuestion());
        }
        displayQuestion();
        playing = true;
    } else {
        // Reset the game completely
        playing = false;
        currentQuestionIndex = 0;
        score = 0;
        document.getElementById("scoreValue").innerHTML = score;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        show("instruction");
        hide("timeRemaining");
        hide("gameOver");
        document.getElementById("startReset").innerHTML = "Start Game";
        // Stop countdown
        stopCountdown();
    }
};

// Function to start countdown
function startCountdown() {
    action = setInterval(function() {
        if (timeremaining > 0) {
            timeremaining -= 1;
            document.getElementById("timeremainingvalue").innerHTML = timeremaining; // Change to 'timeremaining'
        } else { // game over
            stopCountdown();
            show("gameOver");
            document.getElementById("gameOver").innerHTML = "<p>Game over!</p><p>Your score is " + score + ".</p>";
            hide("timeremaining");
            hide("correct");
            hide("incorrect");
            playing = false;
            document.getElementById("startReset").innerHTML = "Start Game";
        }
    }, 1000); //Set the interval to 1000 milliseconds (1 second)
};

//stop counter
function stopCountdown() {
    clearInterval(action);
}

// Generate random addition and subtraction questions
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
    return {
        text: questionText,
        answer
    };
}

// Display a question and answer choices
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

// Check if the selected answer is correct
function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.answer) {
        // Correct answer: Increase the score
        score++;
        document.getElementById("scoreValue").innerHTML = score; // Update the displayed score
        currentQuestionIndex++;
        playSound("assets/sounds/meow.mp3");
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

// Display correct or try again message 
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
    playSound("assets/sounds/no_meow.mp3");
    setTimeout(() => {
        incorrectDiv.style.display = 'none';
    }, 1000);
}

// Function to end the game
function endGame() {
    const gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.textContent = 'Game Over';
    gameOverDiv.style.display = 'block';
}

// Start the game
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("scoreValue").innerHTML = score;
    timeremaining = 60; // Corrected reset of timeremaining
    document.getElementById("timeremainingvalue").innerHTML = timeremaining;
    show("timeRemaining");
    hide("gameOver");
    hide("correct");
    hide("incorrect");
    document.getElementById("startReset").innerHTML = "Reset Game";
    startCountdown();
    questions.length = 0; // Clear previous questions
    for (let i = 0; i < 10; i++) { // Generate 10 questions
        questions.push(generateQuestion());
    }
    displayQuestion();
}

// Add click event to the Start/Reset button
document.getElementById('startReset').addEventListener('click', () => {
    startGame();
    document.getElementById('gameOver').style.display = 'none';
});
