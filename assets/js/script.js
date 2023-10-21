// Define the questions array at the global scope
var questions = [];
var score = 0;
var playing = false;
var timeremaining = 60;
var canPlaySound = true;
var action;
var startTime; // Variable to store the start time

/* Function to play sound */
function playSound(audioURL) {
    if (canPlaySound === true) {
        var audio = new Audio(audioURL);
        audio.play();
    }
}

// Function to show an element by changing its display style to 'block'
function show(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

/* Function to hide an element by changing its display style to 'none' */
function hide(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Wrap code in a event listener to Start/Reset button
document.getElementById('startReset').addEventListener('click', function() {
    startGame();
});

/* Function to start/update/stop countdown timer */
var timerInterval;

function startCountdown() {
    startTime = new Date().getTime(); // Store the start time
    updateTimer(); // Initial timer display
    var interval = 1000; // Update the timer every second
    timerInterval = setInterval(updateTimer, interval);
}

function updateTimer() {
    var currentTime = new Date().getTime();
    var elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    var remainingSeconds = timeremaining - elapsedSeconds;

    if (remainingSeconds > 0) {
        document.getElementById("timeremainingvalue").innerHTML = remainingSeconds;
    } else {
        stopCountdown();

        if (playing) {
            show("gameOver");
            document.getElementById("gameOver").innerHTML = "<p>Game over!</p><p>Your score is " + score + ".</p>";
            hide("timeremaining");
            hide("correct");
            hide("incorrect");
            playing = false;
        }

        document.getElementById("startReset").innerHTML = "START GAME";
    }
}

function stopCountdown() {
    clearInterval(timerInterval);
}

/* Function to start the game */
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    timeremaining = 60;
    document.getElementById("scoreValue").innerHTML = score;
    document.getElementById("timeremainingvalue").innerHTML = timeremaining;
    show("timeRemaining");
    hide("gameOver");
    hide("correct");
    hide("incorrect");
    document.getElementById("startReset").innerHTML = "RESET GAME";
    stopCountdown(); // Ensure any previous countdown is stopped
    startCountdown();
    questions.length = 0; // Clear previous questions
    for (var i = 0; i < 10; i++) {
        questions.push(generateQuestion());
    }
    playing = true; // Set the game state to "playing"
    displayQuestion();
}

/* Function to generate random addition and subtraction questions */
function generateQuestion() {
    var minNumber = 1;
    var maxNumber = 50;
    var num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    var operator = Math.random() < 0.5 ? '+' : '-';
    var answer;
    var num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    if (operator === '+') {
        answer = num1 + num2;
    } else {
        // Ensure there are no negative answers
        if (num1 < num2) {
            var temp = num1;
            num1 = num2;
            num2 = temp;
        }
        answer = num1 - num2;
    }

    var questionText = num1 + ' ' + operator + ' ' + num2;
    // Ensure the answer is a positive integer
    if (answer < 0) {
        return generateQuestion();
    }

    return {
        text: questionText,
        answer: answer
    };
}

/* Display a question and answer choices */
function displayQuestion() {
    var question = questions[currentQuestionIndex];
    document.getElementById('question-area').textContent = question.text;
    var answers = [];
    
    // Generate a list of unique answer choices including the correct answer
    answers.push(question.answer);
    while (answers.length < 4) {
        var randomAnswer = Math.floor(Math.random() * 40);
        if (!answers.includes(randomAnswer)) {
            answers.push(randomAnswer);
        }
    }

    // Shuffle the answer choices for a random order
    answers = shuffleArray(answers);
    
    function createClickHandler(answer) {
        return function () {
            checkAnswer(answer);
        };
    }
    
    for (var i = 0; i < 4; i++) {
        var box = document.getElementById('box' + (i + 1));
        box.textContent = answers[i];
        box.onclick = createClickHandler(answers[i]);
    }
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/* Check if the selected answer is correct */
function checkAnswer(selectedAnswer) {
    var question = questions[currentQuestionIndex];
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

/* Function to display correct or try again message */
function displayCorrect() {
    var correctDiv = document.getElementById('correct');
    correctDiv.style.display = 'block'; // Make the "Correct!" message visible

    // Use a named function for the setTimeout callback
    function hideCorrectDiv() {
        correctDiv.style.display = 'none'; // Hide the message after a certain time (e.g., 1 second)
    }

    setTimeout(hideCorrectDiv, 1000);
}

function displayIncorrect() {
    var incorrectDiv = document.getElementById('incorrect');
    incorrectDiv.style.display = 'block';
    playSound("assets/sounds/no_meow.mp3");

    // Use a named function for the setTimeout callback
    function hideIncorrectDiv() {
        incorrectDiv.style.display = 'none';
    }

    setTimeout(hideIncorrectDiv, 1000);
}

/* Function to end the game */
function endGame() {
    var gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.innerHTML = 'Game Over';
    gameOverDiv.style.display = 'block';
}

/* Define a click event handler function for the Start/Reset button */
function handleClick() {
    startGame();
    document.getElementById('gameOver').style.display = 'none';
}

// Add the click event listener using the handler function
document.getElementById('startReset').addEventListener('click', handleClick);
