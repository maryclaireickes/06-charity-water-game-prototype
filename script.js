// script.js
const board = document.getElementById('board');
const message = document.getElementById('message');
const fact = document.getElementById('fact');
const scoreWater = document.getElementById('scoreWater');
const scoreX = document.getElementById('scoreX');
const symbols = ['💧', '❌'];
let currentPlayer = 0;
let gameState = Array(9).fill(null);
let gameOver = false;
let scores = [0, 0];

const facts = [
  "771 million people in the world live without clean water.",
  "Diseases from dirty water kill more people every year than all forms of violence, including war.",
  "In Africa alone, women spend 40 billion hours a year walking for water.",
  "Access to clean water gives communities more time to grow food, earn an income, and go to school.",
  "Every $1 invested in joint water supply and sanitation provides a $4.30 economic return." 
];

function getRandomFact() {
  return facts[Math.floor(Math.random() * facts.length)];
}

function createBoard() {
  board.innerHTML = '';
  // If boardSize is not set, default to 3
  if (!window.boardSize) {
    window.boardSize = 3;
  }
  // Only allow 3 or 5 for board size
  let size = window.boardSize === 5 ? 5 : 3;
  let columns = size;
  let rows = size;
  let totalCells = size * size;

  // Always use grid for the board
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
  board.style.gridTemplateRows = `repeat(${rows}, 100px)`;
  board.style.width = `${columns * 100}px`;
  board.style.height = `${rows * 100}px`;

  gameState = Array(totalCells).fill(null);
  gameOver = false;
  message.textContent = `${symbols[currentPlayer]}'s turn`;
  fact.textContent = '';

  // Create all cells
  let cellsArr = [];
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.style.width = '100px';
    cell.style.height = '100px';
    cellsArr.push(cell);
  }

  // If 5x5, place an X in the middle cell and block it, and block the four corners
  if (size === 5) {
    const middle = 12;
    cellsArr[middle].classList.add('blocked');
    cellsArr[middle].textContent = symbols[1]; // X
    gameState[middle] = 1;
    // Block the four corners
    const corners = [0, 4, 20, 24];
    for (let i = 0; i < corners.length; i++) {
      cellsArr[corners[i]].classList.add('blocked');
    }
  }
  // If 3x3, place an X in the middle cell and block it
  if (size === 3) {
    const middle = 4;
    cellsArr[middle].classList.add('blocked');
    cellsArr[middle].textContent = symbols[1]; // X
    gameState[middle] = 1;
  }

  // Add click event and append all cells
  for (let i = 0; i < cellsArr.length; i++) {
    const cell = cellsArr[i];
    cell.addEventListener('click', function(event) {
      // Only allow click if not blocked
      if (!cell.classList.contains('blocked')) {
        handleClick({ target: cell });
      }
    });
    board.appendChild(cell);
  }
}

function handleClick(event) {
  const index = event.target.dataset.index;
  // Only allow click if cell is empty and game is not over
  if (gameState[index] || gameOver) return;

  gameState[index] = currentPlayer;
  event.target.textContent = symbols[currentPlayer];

  if (checkWin()) {
    scores[currentPlayer]++;
    updateScore();
    message.textContent = `${symbols[currentPlayer]} won!`;
    fact.textContent = getRandomFact();
    gameOver = true;

    if (scores[currentPlayer] === 3) {
      message.textContent = `${symbols[currentPlayer]} wins the game! 💧 Mission accomplished!`;
      fact.textContent += ' Visit charitywater.org to learn more.';
    }

  } else if (gameState.every(cell => cell !== null)) {
    message.textContent = "It's a draw! Everyone deserves water.";
    fact.textContent = getRandomFact();
    gameOver = true;
  } else {
    currentPlayer = 1 - currentPlayer;
    message.textContent = `${symbols[currentPlayer]}'s turn`;
  }
}

function checkWin() {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winCombos.some(combo => {
    const [a, b, c] = combo;
    return gameState[a] !== null &&
           gameState[a] === gameState[b] &&
           gameState[a] === gameState[c];
  });
}

function updateScore() {
  scoreWater.textContent = scores[0];
  scoreX.textContent = scores[1];
}

function restartGame() {
  if (scores[0] === 3 || scores[1] === 3) {
    scores = [0, 0];
    updateScore();
  }
  currentPlayer = 0;
  createBoard();
}

// Remove old Level Up button code and use the toggle switch logic
const levelUpToggle = document.getElementById('levelUpToggle');
const levelUpLabel = document.getElementById('levelUpLabel');
if (levelUpToggle && levelUpLabel) {
  levelUpToggle.addEventListener('change', function() {
    if (levelUpToggle.checked) {
      window.boardSize = 5;
      levelUpLabel.textContent = 'Level Down';
      currentPlayer = 1; // X goes first in 5x5
    } else {
      window.boardSize = 3;
      levelUpLabel.textContent = 'Level Up';
      currentPlayer = 0; // 💧 goes first in 3x3
    }
    createBoard();
  });
}

// Set initial board size based on toggle state
if (levelUpToggle && levelUpToggle.checked) {
  window.boardSize = 5;
  currentPlayer = 1;
  levelUpLabel.textContent = 'Level Down';
} else {
  window.boardSize = 3;
  currentPlayer = 0;
  levelUpLabel.textContent = 'Level Up';
}

createBoard();
