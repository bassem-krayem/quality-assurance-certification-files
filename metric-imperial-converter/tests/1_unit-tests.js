const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  // ConvertHandler tests suite
  suite("getNum() Test Cases", () => {
    test("Read a whole number input", () => {
      assert.equal(convertHandler.getNum("32L"), 32);
    });
    test("Read a decimal number input", () => {
      assert.equal(convertHandler.getNum("3.5mi"), 3.5);
    });
    test("Read a fractional input", () => {
      assert.equal(convertHandler.getNum("1/2kg"), 0.5);
    });
    test("Read a fractional input with a decimal", () => {
      assert.equal(convertHandler.getNum("5.4/3lbs"), 1.8);
    });
    test("Return an error on a double-fraction", () => {
      assert.equal(convertHandler.getNum("3/2/3km"), "invalid number");
    });
    test("Default to 1 when no numerical input is provided", () => {
      assert.equal(convertHandler.getNum("kg"), 1);
    });
  });

  suite("getUnit() Test Cases", () => {
    test("Read each valid input unit", () => {
      assert.equal(convertHandler.getUnit("32L"), "L");
      assert.equal(convertHandler.getUnit("32gal"), "gal");
      assert.equal(convertHandler.getUnit("3.5mi"), "mi");
      assert.equal(convertHandler.getUnit("1/2kg"), "kg");
      assert.equal(convertHandler.getUnit("5.4/3lbs"), "lbs");
      assert.equal(convertHandler.getUnit("3/2/3km"), "km");
    });
    test("Return error for an invalid input unit", () => {
      assert.equal(convertHandler.getUnit("32g"), "invalid unit");
    });
  });
  suite("getReturnUnit() Test Cases", () => {
    test("Return correct return unit for each valid input unit", () => {
      assert.equal(convertHandler.getReturnUnit("L"), "gal");
      assert.equal(convertHandler.getReturnUnit("gal"), "L");
      assert.equal(convertHandler.getReturnUnit("mi"), "km");
      assert.equal(convertHandler.getReturnUnit("km"), "mi");
      assert.equal(convertHandler.getReturnUnit("lbs"), "kg");
      assert.equal(convertHandler.getReturnUnit("kg"), "lbs");
    });
  });
  suite("spellOutUnit() Test Cases", () => {
    test("Return spelled-out string for each valid unit", () => {
      assert.equal(convertHandler.spellOutUnit("L"), "liters");
      assert.equal(convertHandler.spellOutUnit("gal"), "gallons");
      assert.equal(convertHandler.spellOutUnit("mi"), "miles");
      assert.equal(convertHandler.spellOutUnit("km"), "kilometers");
      assert.equal(convertHandler.spellOutUnit("lbs"), "pounds");
      assert.equal(convertHandler.spellOutUnit("kg"), "kilograms");
    });
  });
  suite("convert() Test Cases", () => {
    test("Convert gal to L", () => {
      assert.equal(convertHandler.convert(1, "gal"), 3.78541);
    });
    test("Convert L to gal", () => {
      assert.equal(convertHandler.convert(1, "L"), 0.26417);
    });
    test("Convert mi to km", () => {
      assert.equal(convertHandler.convert(1, "mi"), 1.60934);
    });
    test("Convert km to mi", () => {
      assert.equal(convertHandler.convert(1, "km"), 0.62137);
    });
    test("Convert lbs to kg", () => {
      assert.equal(convertHandler.convert(1, "lbs"), 0.45359);
    });
    test("Convert kg to lbs", () => {
      assert.equal(convertHandler.convert(1, "kg"), 2.20462);
    });
  });
});
