function Answer(_answer) {
    this.answer = _answer;
    // var answer = _answer;
    // this.setAnswer = function(_answer) {
    //     answer = _answer;
    // }
    // this.getAnswer = function() {
    //     return this.answer;
    // }
}

function Question(_question, _answer, _choices) {
    var question = _question;
    var correct_answer = _answer;
    var choices = _choices;  // pass array at object creation
    this.isCorrect = false;
    this.setQuestion = function (_question) {
        question = _question;
    }
    this.getQuestion = function () {
        return question;
    }
    this.setAnswer = function (_answer) {
        correct_answer = _answer;
    }
    this.getAnswer = function () {
        return correct_answer;
    }
    // pass array of answers ([ans1, ans2, ...])
    this.setChoicesOnce = function (_choices) {
        choices = [];
        _choices.forEach(function(ans) {
            var choice = new Answer(ans);
            choices.push(choice.answer);
        })
    }
    // pass answers separately (ans1, ans2, ...)
    this.setChoices = function () {
        choices = [];
        [].forEach.call(arguments, (function(ans){
            var choice = new Answer(ans);
            choices.push(choice.answer);
        }))
    }
    this.getChoices = function () {
        return choices;
    }
    this.checkAnswer = function(answer){
        this.isCorrect = answer[0].textContent === correct_answer ? true : false;
    }
    this.formatQuestion = function() {
        return {
            question: this.getQuestion(),
            choice1: this.getChoices()[0],
            choice2: this.getChoices()[1],
            choice3: this.getChoices()[2],
            choice4: this.getChoices()[3],
            answer: this.getAnswer()
        }
    }
}

var q1 = new Question('what is 2 + 2 ?', 2, ['2', '4', '6', '8']);

var q2 = new Question();
    q2.setQuestion('what is 3 + 3 ?');
    q2.setChoicesOnce(['2', '4', '6', '8']); // pass choices as an array
    q2.setAnswer(3);

var q3 = new Question();
    q3.setQuestion('what is 4 + 4 ?');
    q3.setChoices('2','4','6','8'); // pass choices separately
    q3.setAnswer(4);

var q4 = new Question('what is 1 + 1 ?', 1, ['2', '4', '6', '8']);

var questionsArr = [ q1.formatQuestion(), q2.formatQuestion(), q3.formatQuestion(), q4.formatQuestion()
                    ,new Question('what is 2 * 3 ?', 3, ['2', '4', '6', '8']).formatQuestion()
                ]

var questionBody = document.querySelector('#question');
var choices = Array.from(document.querySelectorAll('.choice-text'));
var progressText = document.querySelector('#progress-text');
var timeText = document.querySelector('#time-text');
var scoreText = document.querySelector('#score');
var progressBarFull = document.querySelector('#progress-bar-full');
var TimeBarFull = document.querySelector('#time-bar-full');
var TimeBarDiv = document.querySelector('.timeBar-div');
var flag_div = document.querySelector('#flags');
var flagBtn = document.querySelector('#flag-btn');
var nextBtn = document.querySelector('.next-btn');
var previousBtn = document.querySelector('.prev-btn');

var score = 0;
var questionCounter = 1;
var flagedQuestions = [];
var answers = [];
var answeredBefore = [];
var selectedAnswers = [];
var currentQuestion = {};
var usersCookies = getCookies();
var useremail = getCookies()['user'] || '';
var userCookie = JSON.parse(getCookies()[`${useremail}`]) || {};
var highScores = Array.from(JSON.parse(userCookie['highScores'])) || [];

var SCORE_POINTS = Number(localStorage.getItem('SCORE_POINTS')) || 10;
var MAX_QUESTIONS = Number(localStorage.getItem('MAX_QUESTIONS')) || questionsArr.length;
var EXAM_TIME = Number(localStorage.getItem('EXAM_TIME')) || 10;
var questions = JSON.parse(localStorage.getItem('questions')) || questionsArr;


function startTimer(duration, display) {
    var timer = duration, minutes, seconds, timebar = 0;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + " : " + seconds;

        if (--timer < 0) {
            timer = duration;
        }
        if (minutes == 0 && seconds == 0) {
            clearInterval(interval);
            timeText.innerHTML = "Time Over";
            TimeBarDiv.style.width = "0%"
            setTimeout(() => {
                timebar=0;
                // localStorage.setItem('mostRecentScore', score);
                setScore();
                return window.location.replace('/timeout.html');
            }, 2000);
        }
        timebar+=(100/duration);
        TimeBarDiv.style.width = `${(timebar)}%`;
    }, 1000);
}

function startExam() {
    score = 0;
    questionCounter = 1;

    // set right and wrong answers array
    for (var i = 0; i < MAX_QUESTIONS; i++) {
        answers.push(0);
        answeredBefore.push(0);
        flagedQuestions.push(0);
        selectedAnswers.push(0);
    }

    // set exam time
    var timeInSeconds = 60 * EXAM_TIME;
    startTimer(timeInSeconds, timeText);

    // get exam questions
    randomizeQuestions();
    getNewQuestion();

}

function randomizeQuestions() {
    questions.sort(() => Math.random() - 0.5)
}

function getNewQuestion() {
    // get random question
    currentQuestion = questions[questionCounter-1];
    questionBody.innerText = currentQuestion.question;

    // show choices
    choices.forEach(choice => {
        var number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    // set progress
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // add flag button
    if (flagedQuestions[questionCounter-1] === 0) {
        flagBtn.innerHTML = `Flag<i class="fas fa-flag"></i>`;
        flagBtn.setAttribute('onclick', 'flag_question()');
    }
    else {
        flagBtn.innerHTML = `Unflag<i class="far fa-flag"></i>`;
        flagBtn.setAttribute('onclick', `unflag_question(${questionCounter})`);
    }

    // disable buttons
    if(questionCounter === MAX_QUESTIONS){
        nextBtn.style.pointerEvents="none";
        nextBtn.style.cursor="not-allowed";
    }
    else if(questionCounter === 1){
        previousBtn.style.pointerEvents="none";
        previousBtn.style.cursor="not-allowed";
    }
    else{
        nextBtn.style.pointerEvents="auto";
        nextBtn.style.cursor="pointer";
        previousBtn.style.pointerEvents="auto";
        previousBtn.style.cursor="pointer";
    }

    chooseAnswer();
}

var classToApply;
var choiceNumber = 0;
function chooseAnswer() {
    if (answeredBefore[questionCounter-1] !== 1) {
        choices.forEach(choice => {
            choice.parentElement.classList.remove(classToApply);
        })
    }
    else{
        choices.forEach(choice => {
            if(selectedAnswers[questionCounter-1] === choice){
                choice.parentElement.classList.add(classToApply);
            }
            else{
                choice.parentElement.classList.remove(classToApply);
            }
        })
    }
    choices.forEach(choice => {
        choice.addEventListener('click', e => {
            choices.forEach(choice => {
                choice.parentElement.classList.remove(classToApply);
            })
            var selectedChoice = e.target;
            var selectedAnswer = selectedChoice.dataset['number'];

            classToApply = (selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect');
    
            if (classToApply === 'correct') {
                // incrementScore(SCORE_POINTS);
                answers[questionCounter-1] = 1;
            }
            else{
                // decrementScore(SCORE_POINTS);
                answers[questionCounter-1] = 0;
            }

            answeredBefore[questionCounter-1] = 1;
            selectedAnswers[questionCounter-1] = choice;

            if(choiceNumber !== 0){
                if (choiceNumber !== selectedChoice) {
                    choiceNumber.parentElement.classList.remove(classToApply);
                    selectedChoice.parentElement.classList.add(classToApply);
                }
                else{
                    selectedChoice.parentElement.classList.add(classToApply);
                }
            }
            else{
                selectedChoice.parentElement.classList.add(classToApply);
            }
            
            choiceNumber = selectedChoice;
    
            // setTimeout(() => {
            //     selectedChoice.parentElement.classList.remove(classToApply);
            // }, 1000)
        })
    })
}

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

// function decrementScore(num) {
//     score -= num;
//     scoreText.innerText = score;
// }

function flag_question() {
    flag_div.innerHTML += `
        <div id="question-${questionCounter}" class="flex-column flex-center">
            <a class="flag_question" onclick="return_to_question(${questionCounter})">
                Question ${questionCounter}
            </a>
        </div>
    `;
    flagBtn.innerHTML = `Unflag<i class="far fa-flag"></i>`;
    flagBtn.setAttribute('onclick', `unflag_question(${questionCounter})`);
    flagedQuestions[questionCounter-1] = 1;
}

function unflag_question(questionNumber) {
    var unflaggedQuestion = document.querySelector(`#question-${questionNumber}`);
    unflaggedQuestion.remove();
    flagBtn.innerHTML = `Flag<i class="fas fa-flag"></i>`;
    flagBtn.setAttribute('onclick', 'flag_question()');
    flagedQuestions[questionCounter-1] = 0;
}

function next_question() {
    if(questionCounter == MAX_QUESTIONS){
        questionCounter = MAX_QUESTIONS - 1;
    }
    questionCounter++;

    getNewQuestion();
}

function previous_question() {
    if(questionCounter == 1){
        questionCounter = 2
    }
    questionCounter--;

    getNewQuestion();
}

function return_to_question(questionNumber) {
    questionCounter = questionNumber;
    getNewQuestion();
}

function setScore() {
    answers.forEach((ans) => {
        if(ans === 1){
            incrementScore(SCORE_POINTS);
        }
    })
    highScores.push(score);
    highScores.sort((a, b) => {
        return b - a
    })
    userCookie['totalScore'] = MAX_QUESTIONS*SCORE_POINTS;
    userCookie['mostRecentScore'] = score;
    userCookie['highScores'] = JSON.stringify(highScores);

    // set cookie
    var cookieDate = new Date("1/1/2023");
    setCookie(`${useremail}`, `${JSON.stringify(userCookie)}`, cookieDate);
}

function Submit() {
    setScore();
    window.location.replace('/grades.html'); // shouldn't go back to exam page
}


startExam();


// set cookie
function setCookie(cookieName, cookieValue, expiration_date) {
    document.cookie = `${cookieName} = ${cookieValue}; expires = ${expiration_date}`;
}

// get cookie
function getCookies() {
    var key = "user";
    var value = "not found";
    var result = {};
    var data = document.cookie;
    var cookies = data.split(';');
    cookies.forEach(function (el){
        var keyAndValue = el.trim().split("=");
        key = keyAndValue[0];
        value = keyAndValue[1];
        result[`${key}`] = value;
    })
    return result;
}
