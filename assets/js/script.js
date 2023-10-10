var playing = false;
var score;

var action;
var timeRemaining;
var correctAnswer;

//functions

// Generate multiply questions and answers 

function generateQA() {
    var x = 1 + Math.round(9 * Math.random());
    var y = 1 + Math.round(9 * Math.random());
    correctAnswer = x * y;
    document.getElementById("question-area").innerHTML = x + "x" + y;
    var correctPosition = 1 + Math.round(3 * Math.random());
    
    //fill one box with the correct answer
    document.getElementById("box" + correctPosition).innerHTML = correctAnswer; 
    
    //fill other boxes with incorrect answers
    var answers = [correctAnswer];
    for (i = 1; i < 5; i++) {
        if (i != correctPosition) {
            var incorrectAnswer;
            do {
                //an incorrect answer
                incorrectAnswer = (1 + Math.round(9 * Math.random())) * (1 + Math.round(9 * Math.random())); 
            } while (answers.indexOf(incorrectAnswer) > -1); document.getElementById("box" + i).innerHTML = incorrectAnswer;
            answers.push(incorrectAnswer);
        }
    }
}


