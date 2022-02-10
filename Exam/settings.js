// get APIs from: https://opentdb.com/api_config.php

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


var question = document.querySelector('#question');
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
var doneQuestions = [];
var answers = [];
var questionsBody = [];
var questionsChoices = [];
var questionsRightAnswer = [];
var answeredBefore = [];
var selectedAnswers = [];
var currentQuestion = {};



// *****************************************************************
var choices_body = [];
var questions = [];

var SCORE_POINTS = document.querySelector('#question-score');
var EXAM_TIME = document.querySelector('#exam-time');
var correctAnswer = document.querySelector('#correct-answer');

var MAX_QUESTIONS = document.querySelector('#no-of-questions');
var questionsNumberDiv = document.querySelector('.questions-number-container');
var questionsDiv = document.querySelector('.questions-container');


function setQuestionNumber() {
    localStorage.setItem('MAX_QUESTIONS', `${MAX_QUESTIONS.value}`);
    questionsNumberDiv.style.display = 'none';
    questionsDiv.style.display = 'block';

    for (var ch = 2; ch < choices.length; ch++) {
        choices_body.push(choices[ch]);
    }
    for (var i = 0; i < MAX_QUESTIONS.value; i++) {
        doneQuestions[i] = 0;
        questionsBody[i] = '';
        questionsChoices[i] = ['','','',''];
        questionsRightAnswer[i] = 0;
    }

    getNewQuestion();
}

function Done() {
    if(doneQuestions.includes(0)){
        document.querySelector('#finish-alert').style.display = 'block';
        setTimeout(() => {
            document.querySelector('#finish-alert').style.display = 'none';
        }, 3000);
    }
    else{
        localStorage.setItem('SCORE_POINTS', `${SCORE_POINTS.value}`);
        localStorage.setItem('EXAM_TIME', `${EXAM_TIME.value}`);
        localStorage.setItem('questions', JSON.stringify(questions));
        window.location.replace('/index.html');
    }
}

function getNewQuestion() {
    // set progress
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS.value}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS.value) * 100}%`;

    // show question & choices
    choices[1].value = questionsBody[questionCounter-1];
    for (var ch = 2; ch < choices.length; ch++){
        choices[ch].value = questionsChoices[questionCounter-1][ch-2];
    }
    correctAnswer.value = questionsRightAnswer[questionCounter-1];

    // disable buttons
    if(questionCounter == MAX_QUESTIONS.value){
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
        // if(doneQuestions[questionCounter-1] === 0){
        //     // choices_body.forEach(choice => {
        //         choice.value = '';
        //     // })
        // }
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

function setQuestion(){
    var quest;
    var question_body;
    var question_answers = [];
    var correct_answer;
    
    for (var i = 0; i < 4; i++) {
        question_answers.push(0);
    }
    
    // get question content
    question_body = (question.value !== '') ? question.value : '';
    
    // get question answers
    for (var i = 0; i < 4; i++) {
        question_answers[i] = choices_body[i].value;
    }
    
    // get correct answer
    correct_answer = (correctAnswer.value !== 0) ? correctAnswer.value : 0;
    
    question_answers.forEach(ans => {
        if(ans === ''){
            doneQuestions[questionCounter-1] = 0;
        }
        else if(question_body === ''){
            doneQuestions[questionCounter-1] = 0;
        }
        else if(correct_answer === 0){
            doneQuestions[questionCounter-1] = 0;
        }
        else{
            doneQuestions[questionCounter-1] = 1;
        }
    })
    // add question
    quest = new Question(question_body, correct_answer, question_answers);
    questions[questionCounter-1] = quest.formatQuestion();
    
    questionsBody[questionCounter-1] = question_body;
    questionsChoices[questionCounter-1] = question_answers;
    questionsRightAnswer[questionCounter-1] = correct_answer;
}

function next_question() {
    setQuestion();
    
    if(questionCounter == MAX_QUESTIONS.value){
        questionCounter = MAX_QUESTIONS.value - 1;
    }
    
    questionCounter++;

    getNewQuestion();
}

function previous_question() {
    setQuestion();

    if(questionCounter == 1){
        questionCounter = 2
    }
    
    questionCounter--;

    getNewQuestion();
}


