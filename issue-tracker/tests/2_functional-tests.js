const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let testId;
  suite("Tests for the POST request to /api/issues/:project", (done) => {
    let requester = chai.request(server).keepOpen();

    // 1. Create an issue with every field
    test("Create an issue with every field", function (done) {
      requester
        .post("/api/issues/testproject")
        .send({
          issue_title: "Bug in module",
          issue_text: "There is a bug in the login module",
          created_by: "bassem",
          assigned_to: "developer",
          status_text: "in progress",
        })
        .end(function (err, res) {
          assert.equal(res.status, 201);
          assert.equal(res.body.issue_title, "Bug in module");
          assert.equal(
            res.body.issue_text,
            "There is a bug in the login module"
          );
          assert.equal(res.body.created_by, "bassem");
          assert.equal(res.body.assigned_to, "developer");
          assert.equal(res.body.status_text, "in progress");
          assert.equal(res.body.open, true);
          assert.exists(res.body._id);
          testId = res.body._id; // Store the ID for later tests
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          done();
        });
    });

    // 2. Create an issue with only required fields
    test("Create an issue with only required fields", function (done) {
      requester
        .post("/api/issues/testproject")
        .send({
          issue_title: "Login fails",
          issue_text: "Login does not work for some users",
          created_by: "tester",
        })
        .end(function (err, res) {
          assert.equal(res.status, 201);
          assert.equal(res.body.issue_title, "Login fails");
          assert.equal(
            res.body.issue_text,
            "Login does not work for some users"
          );
          assert.equal(res.body.created_by, "tester");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          assert.exists(res.body._id);
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          done();
        });
    });

    // 3. Create an issue with missing required fields
    test("Create an issue with missing required fields", function (done) {
      requester
        .post("/api/issues/testproject")
        .send({
          issue_title: "Missing fields",
          // missing issue_text and created_by
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("Tests for the GET request to /api/issues/:project", () => {
    let requester = chai.request(server).keepOpen();

    // 1. View issues on a project (no filters)
    test("View issues on a project", function (done) {
      requester.get("/api/issues/testproject").end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        if (res.body.length > 0) {
          const issue = res.body[0];
          assert.exists(issue.issue_title);
          assert.exists(issue.issue_text);
          assert.exists(issue.created_by);
          assert.exists(issue.created_on);
          assert.exists(issue.updated_on);
          assert.exists(issue.open);
          assert.exists(issue._id);
        }
        done();
      });
    });

    // 2. View issues on a project with one filter
    test("View issues on a project with one filter", function (done) {
      requester
        .get("/api/issues/testproject")
        .query({ created_by: "bassem" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((issue) => {
            assert.equal(issue.created_by, "bassem");
          });
          done();
        });
    });

    // 3. View issues on a project with multiple filters
    test("View issues on a project with multiple filters", function (done) {
      requester
        .get("/api/issues/testproject")
        .query({ created_by: "bassem", open: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((issue) => {
            assert.equal(issue.created_by, "bassem");
            assert.equal(issue.open, true);
          });
          done();
        });
    });
  });

  suite("Tests for the PUT request to /api/issues/:project", () => {
    let requester = chai.request(server).keepOpen();

    // 1. Update one field on an issue
    test("Update one field on an issue", function (done) {
      requester
        .put("/api/issues/testproject")
        .send({
          _id: testId,
          issue_text: "Updated issue text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: testId,
          });
          done();
        });
    });

    // 2. Update multiple fields on an issue
    test("Update multiple fields on an issue", function (done) {
      requester
        .put("/api/issues/testproject")
        .send({
          _id: testId,
          issue_title: "Updated title",
          assigned_to: "updated user",
          status_text: "completed",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: testId,
          });
          done();
        });
    });

    // 3. Update an issue with missing _id
    test("Update an issue with missing _id", function (done) {
      requester
        .put("/api/issues/testproject")
        .send({
          issue_text: "No _id provided",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "missing _id",
          });
          done();
        });
    });

    // 4. Update an issue with no fields to update
    test("Update an issue with no fields to update", function (done) {
      requester
        .put("/api/issues/testproject")
        .send({
          _id: testId,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "no update field(s) sent",
            _id: testId,
          });
          done();
        });
    });

    // 5. Update an issue with an invalid _id
    test("Update an issue with an invalid _id", function (done) {
      requester
        .put("/api/issues/testproject")
        .send({
          _id: "invalid-id-123",
          issue_text: "This should fail",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "could not update",
            _id: "invalid-id-123",
          });
          done();
        });
    });
  });

  suite("Tests for the DELETE request to /api/issues/:project", function () {
    const requester = chai.request(server).keepOpen();

    test("Delete an issue", function (done) {
      requester
        .delete("/api/issues/testproject")
        .send({ _id: testId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: testId,
          });
          done();
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      requester
        .delete("/api/issues/testproject")
        .send({ _id: "invalidid123456" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "could not delete",
            _id: "invalidid123456",
          });
          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      requester
        .delete("/api/issues/testproject")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });
  });
});
