const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
let solver;

// A sample valid puzzle and its solution
const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const solvedPuzzle =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("Unit Tests", () => {
  before(() => {
    solver = new SudokuSolver();
  });

  test("Logic handles a valid puzzle string of 81 characters", () => {
    const result = solver.validate(validPuzzle);
    assert.strictEqual(result, true);
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    const bad = validPuzzle.replace("1", "A");
    const result = solver.validate(bad);
    assert.deepEqual(result, { error: "Invalid characters in puzzle" });
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    const shortPuzzle = validPuzzle.slice(0, 80);
    const result = solver.validate(shortPuzzle);
    assert.deepEqual(result, {
      error: "Expected puzzle to be 81 characters long",
    });
  });

  test("Logic handles a valid row placement", () => {
    // place '3' at row 0, col 2 (was '.') should be valid
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 2, 3));
  });

  test("Logic handles an invalid row placement", () => {
    // row 0 already has a '1'
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 2, 1));
  });

  test("Logic handles a valid column placement", () => {
    // column 1 doesn't have '1'
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, 1));
  });

  test("Logic handles an invalid column placement", () => {
    // column 1 has '6'
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, 6));
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    // region at top-left 3x3 box doesn't have '4'
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 1, 1, 4));
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    // region at top-left has '1'
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 1, 1, 1));
  });

  test("Valid puzzle strings pass the solver", () => {
    const result = solver.solve(validPuzzle);
    assert.strictEqual(result, solvedPuzzle);
  });

  test("Invalid puzzle strings fail the solver", () => {
    const invalid = validPuzzle.slice(0, 10) + ".".repeat(70);
    const result = solver.solve(invalid);
    assert.deepEqual(result, {
      error: "Expected puzzle to be 81 characters long",
    });
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const result = solver.solve(validPuzzle);
    assert.strictEqual(result, solvedPuzzle);
  });
});
