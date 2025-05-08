class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    }
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    const rowArray = grid[row];
    return !rowArray.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    for (let i = 0; i < 9; i++) {
      if (grid[i][column] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.stringToGrid(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] == value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    const board = this.stringToGrid(puzzleString);
    const solved = this._solveBoard(board);
    return solved
      ? this.gridToString(board)
      : { error: "Puzzle cannot be solved" };
  }

  _solveBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this._isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this._solveBoard(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  _isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  stringToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = puzzleString
        .slice(i * 9, i * 9 + 9)
        .split("")
        .map((c) => (c === "." ? 0 : parseInt(c)));
      grid.push(row);
    }
    return grid;
  }

  gridToString(grid) {
    return grid.flat().join("");
  }
}

module.exports = SudokuSolver;
