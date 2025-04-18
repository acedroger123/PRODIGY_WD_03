const board = document.getElementById('board');
const status = document.getElementById('status');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
  [0, 4, 8], [2, 4, 6]              // diagonals
];

function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[cellIndex] !== "" || !gameActive || currentPlayer !== 'X') return;

  makeMove(cellIndex, currentPlayer);
  if (checkGameEnd()) return;

  currentPlayer = 'O';
  status.textContent = `AI's turn...`;

  setTimeout(() => {
    aiMove();
    checkGameEnd();
    if (gameActive) {
      currentPlayer = 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
  }, 500);
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
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = 'O';
      if (checkWin()) {
        gameState[i] = ""; // undo
        return i;
      }
      gameState[i] = "";
    }
  }

  // Try to block X
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = 'X';
      if (checkWin()) {
        gameState[i] = ""; // undo
        return i;
      }
      gameState[i] = "";
    }
  }

  // Otherwise, take first empty
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") return i;
  }

  return null;
}

function checkWin() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return (
      gameState[a] !== "" &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    );
  });
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
