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
  // Only allow 3 or 4 for board size
  let size = window.boardSize === 4 ? 4 : 3;
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

  // No blocked corners for 4x4 or 3x3

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

  // If Level Up is on (4x4), X (computer) goes first
  if (size === 4 && currentPlayer === 1) {
    setTimeout(computerMove, 400); // Let computer make the first move
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
    showOverlayFact(); // Show overlay when game ends
    if (scores[currentPlayer] === 3) {
      message.textContent = `${symbols[currentPlayer]} wins the game! 💧 Mission accomplished!`;
      fact.textContent += ' Visit charitywater.org to learn more.';
    }

  } else if (gameState.every(cell => cell !== null)) {
    message.textContent = "It's a draw! Everyone deserves water.";
    fact.textContent = getRandomFact();
    gameOver = true;
    showOverlayFact(); // Show overlay on draw
  } else {
    // Switch player
    currentPlayer = 1 - currentPlayer;
    message.textContent = `${symbols[currentPlayer]}'s turn`;
    // If it's X's turn (computer), make a random move
    if (currentPlayer === 1 && !gameOver) {
      setTimeout(computerMove, 400); // Small delay for user experience
    }
  }
}

// Helper to show overlay with a fact and donate link
function showOverlayFact() {
  // If overlay doesn't exist, create it
  let overlay = document.getElementById('factOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'factOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);
  }
  // Pick a random fact
  const factText = getRandomFact();
  overlay.innerHTML = `
    <div style="background: white; color: #003366; padding: 32px 24px; border-radius: 12px; max-width: 350px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.2); position: relative;">
      <button id="closeOverlayBtn" style="position: absolute; top: 8px; right: 12px; background: none; border: none; font-size: 22px; color: #003366; cursor: pointer;">&times;</button>
      <div style="font-size: 18px; margin-bottom: 18px;">${factText}</div>
      <a href="https://www.charitywater.org/donate" target="_blank" style="display: inline-block; background: #FFC907; color: #003366; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 10px;">Donate to charity: water</a>
    </div>
  `;
  // Add close button event
  document.getElementById('closeOverlayBtn').onclick = function() {
    overlay.style.display = 'none';
  };
  overlay.style.display = 'flex';
}

// Computer picks a random empty cell for X
function computerMove() {
  // Find all empty cells
  let emptyIndexes = [];
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === null) {
      emptyIndexes.push(i);
    }
  }
  // If there are no empty cells, return
  if (emptyIndexes.length === 0) return;
  // Pick a random empty cell
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  // Find the cell div
  const cellDivs = document.querySelectorAll('.cell');
  const cell = Array.from(cellDivs).find(c => c.dataset.index == randomIndex);
  if (cell && !cell.classList.contains('blocked')) {
    // Mark the move for X
    gameState[randomIndex] = 1;
    cell.textContent = symbols[1];
    // Check for win or draw after computer move
    if (checkWin()) {
      scores[1]++;
      updateScore();
      message.textContent = `${symbols[1]} won!`;
      fact.textContent = getRandomFact();
      gameOver = true;
      if (scores[1] === 3) {
        message.textContent = `${symbols[1]} wins the game! 💧 Mission accomplished!`;
        fact.textContent += ' Visit charitywater.org to learn more.';
      }
      return;
    } else if (gameState.every(cell => cell !== null)) {
      message.textContent = "It's a draw! Everyone deserves water.";
      fact.textContent = getRandomFact();
      gameOver = true;
      return;
    }
    // Switch back to player
    currentPlayer = 0;
    message.textContent = `${symbols[currentPlayer]}'s turn`;
  }
}

function checkWin() {
  // If 4x4, check for 3 in a row
  if (gameState.length === 16) {
    // Check all possible 3-in-a-row combinations for 4x4
    // Horizontal
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 2; col++) {
        let idx = row * 4 + col;
        if (
          gameState[idx] !== null &&
          gameState[idx] === gameState[idx + 1] &&
          gameState[idx] === gameState[idx + 2]
        ) {
          return true;
        }
      }
    }
    // Vertical
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 2; row++) {
        let idx = row * 4 + col;
        if (
          gameState[idx] !== null &&
          gameState[idx] === gameState[idx + 4] &&
          gameState[idx] === gameState[idx + 8]
        ) {
          return true;
        }
      }
    }
    // Diagonal (top-left to bottom-right)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        let idx = row * 4 + col;
        if (
          gameState[idx] !== null &&
          gameState[idx] === gameState[idx + 5] &&
          gameState[idx] === gameState[idx + 10]
        ) {
          return true;
        }
      }
    }
    // Diagonal (top-right to bottom-left)
    for (let row = 0; row < 2; row++) {
      for (let col = 2; col < 4; col++) {
        let idx = row * 4 + col;
        if (
          gameState[idx] !== null &&
          gameState[idx] === gameState[idx + 3] &&
          gameState[idx] === gameState[idx + 6]
        ) {
          return true;
        }
      }
    }
    return false;
  }
  // 3x3 win logic (classic)
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
      window.boardSize = 4;
      levelUpLabel.textContent = 'Level Down';
      currentPlayer = 1; // X goes first in 4x4
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
  window.boardSize = 4;
  currentPlayer = 1;
  levelUpLabel.textContent = 'Level Down';
} else {
  window.boardSize = 3;
  currentPlayer = 0;
  levelUpLabel.textContent = 'Level Up';
}

createBoard();
