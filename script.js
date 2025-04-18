const board = document.getElementById('board');
const status = document.getElementById('status');
const modeSelect = document.getElementById('mode');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'ai';
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  restartGame();
});

function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[cellIndex] !== "" || !gameActive) return;

  makeMove(cellIndex, currentPlayer);
  if (checkGameEnd()) return;

  // Switch player for both modes
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // If AI mode, let AI make a move right away
  if (gameMode === 'ai' && currentPlayer === 'O') {
    status.textContent = "AI's turn...";

    setTimeout(() => {
      const move = findBestMove();
      if (move !== null) {
        makeMove(move, 'O');
        if (checkGameEnd()) return;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
      }
    }, 500);
  } else {
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}


function makeMove(index, player) {
  gameState[index] = player;
  const cell = document.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
}

function aiMove() {
  let move = findBestMove();
  if (move !== null) {
    makeMove(move, 'O');
  }
}

function findBestMove() {
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = 'O';
      if (checkWin()) {
        gameState[i] = "";
        return i;
      }
      gameState[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = 'X';
      if (checkWin()) {
        gameState[i] = "";
        return i;
      }
      gameState[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") return i;
  }

  return null;
}

function checkWin() {
  return winningCombinations.some(([a, b, c]) =>
    gameState[a] !== "" &&
    gameState[a] === gameState[b] &&
    gameState[a] === gameState[c]
  );
}

function checkGameEnd() {
  if (checkWin()) {
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameActive = false;
    return true;
  }

  if (gameState.every(cell => cell !== "")) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function restartGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = 'X';
  gameActive = true;
  gameMode = modeSelect.value;
  status.textContent = `Player ${currentPlayer}'s turn`;
  board.innerHTML = "";
  createBoard();
}

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

createBoard();
