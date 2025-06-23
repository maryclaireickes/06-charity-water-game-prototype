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
  gameState = Array(9).fill(null);
  gameOver = false;
  message.textContent = `${symbols[currentPlayer]}'s turn`;
  fact.textContent = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
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

createBoard();
