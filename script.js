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
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
  // Update board grid style
  board.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
  board.style.gridTemplateRows = `repeat(${boardSize}, 80px)`;
  board.style.width = `${80 * boardSize}px`;
  board.style.height = `${80 * boardSize}px`;
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
  // Helper to get cell value
  function getCell(row, col) {
    return gameState[row * boardSize + col];
  }
  // Check rows
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col <= boardSize - 3; col++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row, col + 1) && val === getCell(row, col + 2)) {
        return true;
      }
    }
  }
  // Check columns
  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row <= boardSize - 3; row++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row + 1, col) && val === getCell(row + 2, col)) {
        return true;
      }
    }
  }
  // Check diagonals (top-left to bottom-right)
  for (let row = 0; row <= boardSize - 3; row++) {
    for (let col = 0; col <= boardSize - 3; col++) {
      let val = getCell(row, col);
      if (val !== null && val === getCell(row + 1, col + 1) && val === getCell(row + 2, col + 2)) {
        return true;
      }
    }
  }
  // Check diagonals (top-right to bottom-left)
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

function levelUp() {
  boardSize = 5; // Change board size to 5x5
  createBoard(); // Re-create the board
}

// Only run this code after the DOM is loaded
window.onload = function() {
  // Add the Level Up button to the page
  const levelUpBtn = document.createElement('button');
  levelUpBtn.textContent = 'Level Up';
  levelUpBtn.id = 'levelUp';
  levelUpBtn.style.margin = '16px 0';
  levelUpBtn.style.background = '#2E9DF7';
  levelUpBtn.style.color = 'white';
  levelUpBtn.style.fontWeight = 'bold';
  levelUpBtn.style.fontSize = '16px';
  levelUpBtn.style.padding = '10px 20px';
  levelUpBtn.style.border = 'none';
  levelUpBtn.style.borderRadius = '8px';
  levelUpBtn.style.cursor = 'pointer';
  levelUpBtn.addEventListener('click', levelUp);
  // Insert the button above the board
  board.parentNode.insertBefore(levelUpBtn, board);

  createBoard();
};
