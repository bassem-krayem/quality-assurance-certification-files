const chaiHttp = require("chai-http");
const chai = require("chai");
let assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Convert a valid input", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert?input=10L")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 10);
        assert.equal(res.body.initUnit, "L");
        assert.equal(res.body.returnUnit, "gal");
        done();
      });
  });
  test("Convert an invalid input", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert?input=32g")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "invalid unit");
        done();
      });
  });
  test("Convert an invalid number", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert?input=3/7.2/3kg")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "invalid number");
        done();
      });
  });
  test("Convert an invalid number AND unit", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert?input=3/7.2/4kilomegagram")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "invalid number and unit");
        done();
      });
  });
  test("Convert with no number", (done) => {
    chai
      .request(server)
      .keepOpen()
      .get("/api/convert?input=lbs")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, 1);
        assert.equal(res.body.initUnit, "lbs");
        assert.equal(res.body.returnUnit, "kg");
        done();
      });
  });
});
