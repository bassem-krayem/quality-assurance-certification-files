"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.get("/api/convert", (req, res) => {
    const input = req.query.input;
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);

    if (initNum === "invalid number" && initUnit === "invalid unit") {
      return res.json({ error: "invalid number and unit" });
    } else if (initNum === "invalid number") {
      return res.json({ error: "invalid number" });
    } else if (initUnit === "invalid unit") {
      return res.json({ error: "invalid unit" });
    }

    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const returnNum = parseFloat(
      convertHandler.convert(initNum, initUnit).toFixed(5)
    );
    const string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    return res
      .status(200)
      .json({ initNum, initUnit, returnNum, returnUnit, string });
  });
};
