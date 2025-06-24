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
let boardSize = 3;

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
  gameState = Array(boardSize * boardSize).fill(null);
  gameOver = false;
  currentPlayer = 0;
  message.textContent = `${symbols[currentPlayer]}'s turn`;
  fact.textContent = '';
  // Remove yellow background when not in level up mode
  board.classList.remove('level-up');
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    // Prevent clicking if cell is disabled
    cell.addEventListener('click', function() {
      if (!cell.classList.contains('disabled')) {
        handleClick({ target: cell });
      }
    });
    board.appendChild(cell);
  }
  board.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
  board.style.gridTemplateRows = `repeat(${boardSize}, 80px)`;
  board.style.width = `${80 * boardSize}px`;
  board.style.height = `${80 * boardSize}px`;
}

// This function toggles between 3x3 and 5x5 board when Level Up is clicked
function levelUp() {
  // If already in 5x5 mode, go back to 3x3 (toggle off)
  if (boardSize === 5) {
    boardSize = 3;
    createBoard();
    board.classList.remove('level-up'); // Remove yellow background
    levelUpBtn.textContent = 'Level Up';
  } else {
    // Switch to 5x5 mode (toggle on)
    boardSize = 5;
    createBoard();
    board.classList.add('level-up'); // Add yellow background
    // Find the middle cell (for 5x5, index 12)
    const cells = document.querySelectorAll('.cell');
    const middleIndex = 12; // 5x5 grid, middle cell
    if (cells[middleIndex]) {
      cells[middleIndex].classList.add('disabled');
    }
    levelUpBtn.textContent = 'Level Down';
  }
}

// Create a simple 3x3 board
// Create 9 cells for the board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i;
  board.appendChild(cell);
}

// Add click behavior to the board
board.addEventListener('click', (e) => {
  const cell = e.target;
  // Only allow clicking empty, enabled cells
  if (!cell.classList.contains('cell') || cell.classList.contains('taken') || cell.classList.contains('disabled')) return;

  cell.textContent = 'X'; // Mark the cell
  cell.classList.add('taken'); // Mark as taken

  disableRandomMove(); // Disable a random empty cell
});

// Disable one random empty cell after each move
function disableRandomMove() {
  // Find all empty and enabled cells
  const emptyCells = Array.from(document.querySelectorAll('.cell:not(.taken):not(.disabled)'));
  if (emptyCells.length > 1) { // Leave at least one clickable
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.classList.add('disabled');
  }
}

function handleClick(event) {
  const index = event.target.dataset.index;
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
  function getCell(row, col) {
    return gameState[row * boardSize + col];
  }
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - 3; col++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row, col + 1) && val === getCell(row, col + 2)) {
        return true;
      }
    }
  }
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row <= boardSize - 3; row++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row + 1, col) && val === getCell(row + 2, col)) {
        return true;
      }
    }
  }
  for (let row = 0; row <= boardSize - 3; row++) {
    for (let col = 0; col <= boardSize - 3; col++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row + 1, col + 1) && val === getCell(row + 2, col + 2)) {
        return true;
      }
    }
  }
  for (let row = 0; row <= boardSize - 3; row++) {
    for (let col = 2; col < boardSize; col++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row + 1, col - 1) && val === getCell(row + 2, col - 2)) {
        return true;
      }
    }
  }
  return false;
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

window.onload = function() {
  const levelUpBtn = document.getElementById('levelUp');
  levelUpBtn.addEventListener('click', levelUp);
  createBoard();
};
