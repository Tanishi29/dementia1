let wordsLevel1 = ["bart", "simpson", "homer", "marge", "lisa", "maggie", "nelson", "chief Wiggum"];
let distractorWordsLevel1 = ["springfield", "skateboard", "doughnut", "smithers", "itchy", "krusty"];
let wordsLevel2 = ["burns", "moe", "principal Skinner", "otto", "april", "patty", "selma", "carl", "lenny"];
let distractorWordsLevel2 = ["sideshow bob", "porkchop", "flanders", "maggie", "pigeon"];
let index = 0;
let level = 0; 
let nextButton, testButton, startButton, retryButton, nextLevelButton;
let currentRecallIndex = 0;
let recallWords = [];
let userAnswers = [];
let feedback = "";
let currentWords, currentDistractors;
let lives = 3;
let yesButton, noButton; 
let yesX, yesY, noX, noY; 
let buttonWidth = 100;
let buttonHeight = 50;

function preload() {
    yesButton = loadImage("yes.png"); 
    noButton = loadImage("no.png"); 
}

function setup() {
    createCanvas(400, 600);
    textAlign(CENTER, CENTER);
    textSize(24);
    
    yesX = width / 2 - 130;
    yesY = height / 2 + 100;
    noX = width / 2 + 40;
    noY = height / 2 + 100;

    startButton = createButton('Start Level 1');
    startButton.position(140, 370);
    startButton.mousePressed(startLevel);
    
    nextButton = createButton('Next Word');
    nextButton.position(150, 370);
    nextButton.mousePressed(nextWord);
    nextButton.hide();

    testButton = createButton('Test my Knowledge');
    testButton.position(140, 430);
    testButton.mousePressed(startTest);
    testButton.hide();

    retryButton = createButton('Retry Level');
    retryButton.position(140, 430);
    retryButton.mousePressed(restartCurrentLevel);
    retryButton.hide();

    nextLevelButton = createButton('Next Level');
    nextLevelButton.position(140, 430);
    nextLevelButton.mousePressed(startNextLevel);
    nextLevelButton.hide();
}

function draw() {
    background('green');
    
    switch (level) {
        case 0:
            displayTitleScreen();
            break;
        case 1:
            displayLevelTitle("Level 1");
            break;
        case 2:
            displayWord(); 
            break;
        case 3:
            displayRecall();
            break;
        case 4:
            displayPassScreen();
            break;
        case 5:
            displayFailureScreen();
            break;
        case 6:
            displayLevelTitle("Level 2");
            break;
        case 7:
            displayWordLevel2();
            break;
        case 8:
            displayRecallLevel2();
            break;
        default:
            console.log("Invalid level: ", level);
            break;
    }
}

function displayTitleScreen() {
    textSize(32);
    fill(0);
    text("Word Recall Game", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start Level 1!", width / 2, height / 2);
}

function startLevel() {
    level = 1; 
    startButton.hide();
}

function displayLevelTitle(levelTitle) {
    textSize(32);
    fill(0);
    text(levelTitle, width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start!", width / 2, height / 2);
    
    if (levelTitle === "Level 1") {
        startButton.html("Start Level 1");
        startButton.mousePressed(beginLevel1);
    } else if (levelTitle === "Level 2") {
        startButton.html("Start Level 2");
        startButton.mousePressed(beginLevel2);
    }
    startButton.show();
}

function beginLevel1() {
    level = 2;
    index = 0; 
    currentWords = wordsLevel1;
    currentDistractors = distractorWordsLevel1;
    lives = 3; 
    startButton.hide();
    nextButton.show();
}

function displayWord() {
    text(currentWords[index], width / 2, 250);
    
    if (index >= currentWords.length - 1) {
        nextButton.hide();
        testButton.show(); 
    }
}

function nextWord() {
    index++;
    if (index >= currentWords.length) {
        index = currentWords.length - 1; 
    }
}

function startTest() {
    level = 3; 
    currentRecallIndex = 0;
    feedback = "";
    userAnswers = []; 
    testButton.hide();
    nextButton.hide();
    prepareRecallWords(); 
    displayRecall(); 
}

function mousePressed() {
    if (level === 3) { 
        if (mouseX > yesX && mouseX < yesX + buttonWidth && mouseY > yesY && mouseY < yesY + buttonHeight) {
            handleRecallResponse(true);
        } else if (mouseX > noX && mouseX < noX + buttonWidth && mouseY > noY && mouseY < noY + buttonHeight) {
            handleRecallResponse(false);
        }
    } else if (level === 8) { 
        if (mouseX > yesX && mouseX < yesX + buttonWidth && mouseY > yesY && mouseY < yesY + buttonHeight) {
            handleRecallResponseLevel2(true);
        } else if (mouseX > noX && mouseX < noX + buttonWidth && mouseY > noY && mouseY < noY + buttonHeight) {
            handleRecallResponseLevel2(false);
        }
    }
}

function prepareRecallWords() {
    let allWords = currentWords.concat(currentDistractors);
    recallWords = [];
    for (let i = 0; i < currentWords.length; i++) {
        let randomIndex = Math.floor(Math.random() * allWords.length);
        recallWords.push(allWords[randomIndex]);
        allWords.splice(randomIndex, 1); 
    }
}

function displayRecall() {
    text("Did you see this word?", width / 2, 150);
    text(recallWords[currentRecallIndex], width / 2, 200);
    
    textSize(20);
    fill(0);
    text(`Lives: ${lives}`, width - 70, 30);
    
    textSize(20);
    fill(0);
    text(feedback, width / 2, 250);
    textSize(30);
    
    image(yesButton, yesX, yesY, buttonWidth, buttonHeight);
    image(noButton, noX, noY, buttonWidth, buttonHeight);
}

function handleRecallResponse(response) {
    let currentWord = recallWords[currentRecallIndex];
    let correctAnswer = currentWords.includes(currentWord);

    userAnswers.push({ word: currentWord, seen: response, correct: response === correctAnswer });

    if (response !== correctAnswer) {
        lives--; 
        if (lives === 0) {
            level = 5; 
            retryButton.show(); 
            return; 
        }
    }

    currentRecallIndex++;
    
    if (currentRecallIndex >= recallWords.length) {
        checkLivesAndProceed(); 
    } else {
        displayRecall(); 
    }
}

function checkLivesAndProceed() {
    if (lives > 0) {
        level = 4; 
    } else {
        level = 5; 
        retryButton.show(); 
    }
}

function displayPassScreen() {
    background('lightgreen');
    textSize(32);
    fill(0);
    text("You Passed!", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to go to the next level.", width / 2, height / 2);
    nextLevelButton.show();
}

function displayFailureScreen() {
    background('red');
    textSize(32);
    fill(255);
    text("You have no lives left.", width / 2, height / 2 - 50);
    textSize(24);
    text("Retry the level from the start.", width / 2, height / 2);
    retryButton.show();
}

function startNextLevel() {
    level = 6; 
    nextLevelButton.hide();
}

function beginLevel2() {
    level = 7; 
    index = 0; 
    currentWords = wordsLevel2; 
    currentDistractors = distractorWordsLevel2; 
    lives = 3; 
    startButton.hide(); 
    nextButton.show(); 
}

function displayWordLevel2() {
    text(currentWords[index], width / 2, 250);
    
    if (index >= currentWords.length - 1) {
        nextButton.hide();
        testButton.show(); 
    }
}

function startTestLevel2() {
    level = 8; 
    currentRecallIndex = 0;
    feedback = "";
    userAnswers = []; 
    testButton.hide();
    nextButton.hide();
    prepareRecallWords(); 
    displayRecallLevel2(); 
}

function displayRecallLevel2() {
    text("Did you see this word?", width / 2, 150);
    text(recallWords[currentRecallIndex], width / 2, 200);
    
    textSize(20);
    fill(0);
    text(`Lives: ${lives}`, width - 70, 30);
    
    textSize(20);
    fill(0);
    text(feedback, width / 2, 250);
    textSize(30);
    
    image(yesButton, yesX, yesY, buttonWidth, buttonHeight);
    image(noButton, noX, noY, buttonWidth, buttonHeight);
}

function handleRecallResponseLevel2(response) {
    let currentWord = recallWords[currentRecallIndex];
    let correctAnswer = currentWords.includes(currentWord);

    userAnswers.push({ word: currentWord, seen: response, correct: response === correctAnswer });

    if (response !== correctAnswer) {
        lives--; 
        if (lives === 0) {
            level = 5; 
            retryButton.show(); 
            return; 
        }
    }

    currentRecallIndex++;
    
    if (currentRecallIndex >= recallWords.length) {
        checkLivesAndProceedLevel2(); 
    } else {
        displayRecallLevel2(); 
    }
}

function checkLivesAndProceedLevel2() {
    if (lives > 0) {
        level = 4; 
    } else {
        level = 5; 
        retryButton.show(); 
    }
}

function restartCurrentLevel() {
    retryButton.hide();
    if (currentWords === wordsLevel1) {
        level = 1;
    } else if (currentWords === wordsLevel2) {
        level = 6;
    }
    lives = 3;
    index = 0;
    currentRecallIndex = 0;
    userAnswers = [];
}
