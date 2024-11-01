// Canvas Setting
const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');
//Scores
let scoreText = document.getElementById('score');
let gameLevel = document.getElementById('gameLevel');
//Buttons
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
// Width & Height
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
//Colors
const snakeColor = "#5ECDFF";
const snakeBorder = "#4CB8E6";
const foodColor = "#FF1D44";
//Game State
let running = false;
let score = 0;
let level = 0;
let gameSpeed = 200;
//Unit Size
const unitSize = 25;
// Food Coordinates
let foodX;
let foodY;
//Snake
let snake = [
    { x: unitSize * 2, y: 0 },
];
// Snake Move
let velocityX = unitSize;
let velocityY = 0;

//Functions Call
changeDirection();
// Keyboard Control
function changeDirection() {
    window.addEventListener('keydown', (event) => {
        const allowedKeys = ['a', 'w', 's', 'd']; // Create array with keys
        const pressedKey = event.key; // Get the pressed keys
        //Keys control
        if(allowedKeys.includes(pressedKey)) {
           switch(pressedKey) {
            case 'a': // Not move to LEFT if snake move RIGHT
            if(velocityX == !unitSize) {
               velocityX = -unitSize;
               velocityY = 0;
            }
            break;
            case 'w': // Not move to UP if snake move DOWN
            if(velocityY == !unitSize) {
               velocityX = 0;
               velocityY = -unitSize;
            }
            break;
            case 's': // Not move DOWN if snake move UP
            if(velocityY == !-unitSize) {
               velocityX = 0;
               velocityY = unitSize;
            }
            break;
            case 'd': // Not move RIGHT if snake move LEFT
            if(velocityX == !-unitSize) {
               velocityX = unitSize;
               velocityY = 0;
            }
           }
        }  
    })   
}
// Add Event Listeners
startBtn.addEventListener('click', gameStart);
resetBtn.addEventListener('click', gameReset);

// Start Function
 function gameStart() {
    if (!running) {
        running = true;
        startBtn.disabled = true;
    } // Disable start button if game is already running
    score.textContent = 'Score: 0';
    gameLevel.textContent = `Level ${level}`;
    createFood();
    drawFood();
    drawSnake();
    levelCheck();
    nextTick();
}
// Reset Function
function gameReset() {
    clearBoard();
    running = false;
    startBtn.disabled = false;
    snake = [
        { x: unitSize * 2, y: 0 },
    ];
    score = 0;
    scoreText.textContent = `Score: ${score}`;
    level = 0;
    gameLevel.textContent = `Level ${level}`;
    gameSpeed = 200;
    velocityX = unitSize;
    velocityY = 0;
}

// Game Loop
function nextTick() {
    if(running) {
        setTimeout(() => {
           clearBoard();
           drawFood();
           snakeMove();
           gameOverCheck();
           drawSnake();
           levelCheck();
           nextTick();
           gameOverCheck();
        }, gameSpeed);
    }
}

// Food Coordinates 500 / 25 = 20 => (0, 19)
function createFood() {
    function randomFood(min, max) {
        const randomNumber = Math.round(Math.random() * (max - min));
        return randomNumber * unitSize; 
    }
    do { // Generate New Coordinates until it find's place not occupied by snake
        foodX = randomFood(0, 19);
        foodY = randomFood(0, 19);
    } while (snake.some(segment => segment.x == foodX && segment.y == foodY)); // Check if food is not under snake

    
}

//  Draw Food 
function drawFood() {
    const radius = unitSize / 2;

    ctx.beginPath();
    ctx.arc(foodX + radius, foodY + radius, radius, 0, Math.PI * 2);
    ctx.fillStyle = foodColor;
    ctx.fill(); 
    
}

// Draw Snake
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(segment.x, segment.y, unitSize, unitSize);

        ctx.lineWidth = 2;
        ctx.strokeStyle = snakeBorder;
        ctx.strokeRect(segment.x, segment.y, unitSize, unitSize);
    })
}

//Snake Move 
function snakeMove() {
    const head = {x: snake[0].x + velocityX, y: snake[0].y + velocityY }

    snake.unshift(head);
    // Check If Snake Ate Food
    if(snake[0].x == foodX && snake[0].y == foodY) {
        score+= 1;
        scoreText.textContent = `Score: ${score}`; // Score Change
        createFood();
    } else {
        snake.pop();
    }  
}
//Level Check
function levelCheck() {
    gameLevel.textContent = `Level ${level}`;
    if (score % 5 === 0 && score / 5 === level) {
        level += 1;
        gameLevel.textContent = `Level ${level}`;
        gameSpeed -= 10;
    }
}

//Board Clear
function clearBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

// Game Over Check 
function gameOverCheck() {
    switch(true) { // Check if snake is out of board
        case(snake[0].x < 0):
        running = false;
        clearBoard();
        displayGameOver();
        break;
        case(snake[0].x >= gameWidth):
        running = false;
        clearBoard();
        displayGameOver();
        break;
        case(snake[0].y < 0):
        running = false;
        clearBoard();
        displayGameOver();
        break;
        case(snake[0].y >= gameHeight):
        running = false; 
        clearBoard(); 
        displayGameOver();   
        break;   
    }

    for (let i = 1; i < snake.length; i+=1) { // Check if snake eat itself
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
            clearBoard();
            displayGameOver();
        }
    }

    
}

function displayGameOver() {
    ctx.fillStyle = "#293446";
    ctx.fillRect(gameWidth / 2 - 200, gameHeight / 2 - 115, 400, 200);

    ctx.font = "40px Helvetica";
    ctx.fillStyle = "#becbe4";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2);
    
}