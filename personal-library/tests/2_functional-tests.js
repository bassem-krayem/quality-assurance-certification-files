const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let requester;
  let testId;

  // Open one shared connection
  before(() => {
    requester = chai.request(server).keepOpen();
  });
  // Example GET all books
  test("#example Test GET /api/books", function (done) {
    requester.get("/api/books").end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      if (res.body.length) {
        assert.property(res.body[0], "commentcount");
        assert.property(res.body[0], "title");
        assert.property(res.body[0], "_id");
      }
      done();
    });
  });

  suite(
    "POST /api/books with title => create book object/expect book object",
    function () {
      test("Test POST /api/books with title", function (done) {
        requester
          .post("/api/books")
          .send({ title: "The Great Gatsby" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.equal(res.body.title, "The Great Gatsby");
            testId = res.body._id;
            done();
          });
      });

      test("Test POST /api/books with no title given", function (done) {
        requester
          .post("/api/books")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          });
      });
    }
  );

  suite("GET /api/books => array of books", function () {
    test("Test GET /api/books", function (done) {
      requester.get("/api/books").end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        if (res.body.length) {
          assert.property(res.body[0], "_id");
          assert.property(res.body[0], "title");
          assert.property(res.body[0], "commentcount");
        }
        done();
      });
    });
  });

  suite("GET /api/books/[id] => book object with [id]", function () {
    test("Test GET /api/books/[id] with id not in db", function (done) {
      requester
        .get("/api/books/000000000000000000000000")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
    });

    test("Test GET /api/books/[id] with valid id in db", function (done) {
      requester.get("/api/books/" + testId).end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id");
        assert.property(res.body, "title");
        assert.property(res.body, "comments");
        assert.isArray(res.body.comments);
        done();
      });
    });
  });

  suite(
    "POST /api/books/[id] => add comment/expect book object with id",
    function () {
      test("Test POST /api/books/[id] with comment", function (done) {
        requester
          .post("/api/books/" + testId)
          .send({ comment: "Amazing read" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "comments");
            assert.include(res.body.comments, "Amazing read");
            done();
          });
      });

      test("Test POST /api/books/[id] without comment field", function (done) {
        requester
          .post("/api/books/" + testId)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function (done) {
        requester
          .post("/api/books/000000000000000000000000")
          .send({ comment: "Test comment" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    }
  );

  suite("DELETE /api/books/[id] => delete book object id", function () {
    test("Test DELETE /api/books/[id] with valid id in db", function (done) {
      requester.delete("/api/books/" + testId).end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, "delete successful");
        done();
      });
    });

    test("Test DELETE /api/books/[id] with id not in db", function (done) {
      requester
        .delete("/api/books/000000000000000000000000")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no book exists");
          done();
        });
    });
  });
});
