const SIZE = 8;
let queens = [];
let placedQueens = 0;

// History for undo/redo functionality
let history = [];
let historyIndex = -1;

function createBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', handleSquareClick);
            chessboard.appendChild(square);
        }
    }
}

function isSafe(newRow, newCol) {
    return queens.every(queen => {
        return !(queen.row === newRow ||
                queen.col === newCol ||
                Math.abs(queen.row - newRow) === Math.abs(queen.col - newCol));
    });
}

function handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (square.textContent === '♛') return;

    if (isSafe(row, col)) {
        // Add the move to history
        addToHistory({ row, col });

        square.textContent = '♛';
        queens.push({ row, col });
        placedQueens++;

        if (placedQueens === SIZE) {
            document.getElementById('message').textContent = 
                'Congratulations! You solved the puzzle!';
        }
    } else {
        showConflict(square);
        resetToSafeState(row, col);
    }
}

function showConflict(square) {
    square.classList.add('danger');
    setTimeout(() => square.classList.remove('danger'), 5000);
}

function resetToSafeState(newRow, newCol) {
    // Find the first conflicting queen
    const conflictingQueenIndex = queens.findIndex(queen => 
        queen.row === newRow ||
        queen.col === newCol ||
        Math.abs(queen.row - newRow) === Math.abs(queen.col - newCol)
    );

    if (conflictingQueenIndex !== -1) {
        // Remove all queens placed after the conflicting queen
        queens = queens.slice(0, conflictingQueenIndex);
        placedQueens = conflictingQueenIndex;

        // Reset the board visually
        updateBoard();
    }
}

function addToHistory(move) {
    // Clear redo history when a new move is made
    history = history.slice(0, historyIndex + 1);
    history.push([...queens, move]);
    historyIndex++;
}

function undoMove() {
    if (historyIndex > 0) {
        historyIndex--;
        queens = history[historyIndex];
        placedQueens = queens.length;
        updateBoard();
    }
}

function redoMove() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        queens = history[historyIndex];
        placedQueens = queens.length;
        updateBoard();
    }
}

function updateBoard() {
    const chessboard = document.getElementById('chessboard');
    const squares = chessboard.querySelectorAll('.square');
    squares.forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const isQueen = queens.some(queen => queen.row === row && queen.col === col);
        square.textContent = isQueen ? '♛' : '';
    });
}

function resetBoard() {
    queens = [];
    placedQueens = 0;
    history = [];
    historyIndex = -1;
    document.getElementById('message').textContent = '';
    updateBoard();
}

// Initialize the game
createBoard();