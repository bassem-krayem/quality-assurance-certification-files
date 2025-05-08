const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const validPuzzle =
    "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
  const solvedPuzzle =
    "568913724342687519197254386685479231219538467734162895926345178473891652851726943";

  suite("POST /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, solvedPuzzle);
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle.replace("5", "A") })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });

    test("Solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle.slice(0, 80) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", (done) => {
      const bad = validPuzzle.replace("5", "6"); // create an unsolvable conflict
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: bad })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });

  suite("POST /api/check", () => {
    test("Check a puzzle placement with all fields valid", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      // row-only conflict: placing 1 at A2
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row"]);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      // row & column conflict: placing 2 at A2
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict.sort(), ["column", "row"]);
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      // row, column & region conflict: placing 5 at A2
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "5" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict.sort(), [
            "column",
            "region",
            "row",
          ]);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field(s) missing" });
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle.replace("5", "Z"),
          coordinate: "A2",
          value: "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle.slice(0, 80),
          coordinate: "A2",
          value: "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "Z9", value: "6" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid coordinate" });
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validPuzzle, coordinate: "A2", value: "0" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid value" });
          done();
        });
    });
  });
});
