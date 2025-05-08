"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    const validation = solver.validate(puzzle);
    if (validation !== true) return res.json(validation);

    const solution = solver.solve(puzzle);
    if (solution.error) return res.json(solution);

    res.json({ solution });
  });

  app.post("/api/check", (req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const validation = solver.validate(puzzle);
    if (validation !== true) return res.json(validation);

    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
    const col = parseInt(coordinate[1], 10) - 1;
    const index = row * 9 + col;

    // If the same value is already placed there, treat as valid
    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    const val = parseInt(value);

    if (!solver.checkRowPlacement(puzzle, row, col, val)) conflicts.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, val))
      conflicts.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, col, val))
      conflicts.push("region");

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    }

    return res.json({ valid: false, conflict: conflicts });
  });
};
