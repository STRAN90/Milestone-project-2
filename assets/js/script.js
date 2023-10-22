// Define the questions array at the global scope
let questions = [];
let score = 0;
let playing = false;
let timeremaining = 60;
let canPlaySound = true;
let currentQuestionIndex = 0;
let gameIsOver = true;
let timerInterval;

/**  Function to play sound */
function playSound(audioURL) {
    if(canPlaySound === true) {
        const audio = new Audio(audioURL);
        audio.play();
    }
}

/** Function to show an element by changing its display style to 'block' */
function show(elementId) {
const element = document.getElementById(elementId);
    if(element) {
        element.style.display = 'block';
    }
}

/** Function to hide an element by changing its display style to 'none' */
function hide(elementId) {
const element = document.getElementById(elementId);
    if(element) {
        element.style.display = 'none';
    }
}

// Get the Start/Reset button element and add an event listener
const startResetButton = document.getElementById('startReset');
    startResetButton.addEventListener('click', function () {
        if(!gameIsOver) {
            let shouldReset = confirm("Are you sure you want to reset the game?");
            if(shouldReset) {
                resetGame();
            }
        } else {
            startGame();
        }
    });

    /** Function to reset the game */
    function resetGame() {
        gameIsOver = true;
        clearInterval(timerInterval); // Clear the timerInterval
        currentQuestionIndex = 0;
        score = 0;
        timeremaining = 60;
        document.getElementById("scoreValue").innerHTML = score;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        show("startReset");
        hide("timeRemaining");
        hide("gameOver");
        hide("correct");
        hide("incorrect");
        document.getElementById("startReset").innerHTML = "START GAME";
        stopCountdown();
        setAnswerButtonsEnabled(false);
        questions.length = 0;
    }

    /** Function to start/update/stop countdown timer */
    function startCountdown() {
        let startTime = new Date().getTime();
        let interval = 1000; // Set the interval to 1000ms (1 second)
        function updateTimer() {
            let currentTime = new Date().getTime();
            let elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            let remainingSeconds = timeremaining - elapsedSeconds;
            if(remainingSeconds >= 0) {
                document.getElementById("timeremainingvalue").innerHTML = remainingSeconds;
            } else {
                stopCountdown();
                if(!gameIsOver) {
                    show("gameOver");
                    document.getElementById("gameOver").innerHTML = "<p>Game over!</p><p>Your score is " + score + ".</p>";
                    hide("timeremaining");
                    hide("correct");
                    hide("incorrect");
                    gameIsOver = true; // Set the game state to "over"
                }
                document.getElementById("startReset").innerHTML = "START GAME";
            }
        }
        timerInterval = setInterval(updateTimer, interval);
    }

    function stopCountdown() {
        clearInterval(timerInterval);
    }

    /** Function to start the game */
    function startGame() {
        if(gameIsOver) {
            gameIsOver = false;
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
            stopCountdown();
            questions.length = 0;
            for(let i = 0; i < 10; i++) {
                questions.push(generateQuestion());
            }
            displayQuestion();
            startCountdown();
            setAnswerButtonsEnabled(true); // Enable the answer buttons when the game starts
        }
    }

    /** Function to generate random addition and subtraction questions */
    function generateQuestion() {
        let minNumber = 1;
        let maxNumber = 50;
        let firstNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        let operator = Math.random() < 0.5 ? '+' : '-';
        let answer;
        let secondNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        if(operator === '+') {
            answer = firstNum + secondNum ;
        } else {
            // Ensure there are no negative answers
            if(firstNum < secondNum ) {
                let temp = firstNum;
                firstNum = secondNum ;
                secondNum  = temp;
            }
            answer = firstNum - secondNum ;
        }
        let questionText = firstNum + ' ' + operator + ' ' + secondNum;
        // Ensure the answer is a positive integer
        if(answer < 0) {
            return generateQuestion();
        }
        return {
            text: questionText,
            answer: answer
        };
    }

    /** Function to display a question and answer choices */
    function displayQuestion() {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-area').textContent = question.text;
        const answers = [];
        // Generate a list of unique answer choices including the correct answer
        answers.push(question.answer);
        while(answers.length < 4) {
            let randomAnswer = Math.floor(Math.random() * 40);
            if(!answers.includes(randomAnswer)) {
                answers.push(randomAnswer);
            }
        }
        /** Function to shuffle the answer choices for a random order */
        answers = shuffleArray(answers);

        function createClickHandler(answer) {
            return function () {
                checkAnswer(answer);
            };
        }
        for(let i = 0; i < 4; i++) {
            const box = document.getElementById('box' + (i + 1));
            box.textContent = answers[i];
            box.onclick = createClickHandler(answers[i]);
        }
    }

    /** Function to shuffle an array (Fisher-Yates shuffle algorithm */
    function shuffleArray(array) {
        for(let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /** Function to check if the selected answer is correct */
    function checkAnswer(selectedAnswer) {
        const question = questions[currentQuestionIndex];
        if(!gameIsOver) {
            if(selectedAnswer === question.answer) {
                // Correct answer: Increase the score
                score++;
                document.getElementById("scoreValue").innerHTML = score; // Update the displayed score
                currentQuestionIndex++;
                playSound("assets/sounds/meow.mp3");
                if(currentQuestionIndex < questions.length) {
                    displayQuestion(); // Display the next question
                } else {
                    endGame();
                }
                displayCorrect(); // Call the function to display the "Correct!" message
            } else {
                displayIncorrect();
            }
        }
    }

    /** Function to display correct or try again message */
    function displayCorrect() {
        const correctDiv = document.getElementById('correct');
        correctDiv.style.display = 'block'; // Make the "Correct!" message visible
        /* Use a named function for the setTimeout callback */
        function hideCorrectDiv() {
            correctDiv.style.display = 'none'; // Hide the message after a certain time (e.g., 1 second)
        }
        setTimeout(hideCorrectDiv, 1000);
    }

    function displayIncorrect() {
        const incorrectDiv = document.getElementById('incorrect');
        incorrectDiv.style.display = 'block';
        playSound("assets/sounds/no_meow.mp3");
        /* Use a named function for the setTimeout callback */
        function hideIncorrectDiv() {
            incorrectDiv.style.display = 'none';
        }
        setTimeout(hideIncorrectDiv, 1000);
    }

    /** Function to end the game */
    function endGame() {
        const gameOverDiv = document.getElementById('gameOver');
        gameOverDiv.innerHTML = 'Game Over';
        gameOverDiv.style.display = 'block';
        setAnswerButtonsEnabled(false); // Disable the answer buttons when the game ends
    }
    /** Function to set the answer buttons' enabled/disabled state */
    function setAnswerButtonsEnabled(enabled) {
        const answerButtons = document.getElementsByClassName('answer-button');
        for(let i = 0; i < answerButtons.length; i++) {
            answerButtons[i].style.pointerEvents = enabled ? 'auto' : 'none';
        }
    }

    /** Function to define a click event handler function for the Start/Reset button */
    function handleClick() {
        startGame();
        document.getElementById('gameOver').style.display = 'none';
    }

document.addEventListener("DOMContentLoaded", function () {
    // Add the click event listener using the handler function
    document.getElementById('startReset').addEventListener('click', function () {
        if(!playing) {
            startGame();
        }
    });
});