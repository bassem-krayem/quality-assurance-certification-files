function ConvertHandler() {
  // Map units to their conversion targets
  const unitMap = {
    gal: "L",
    l: "gal",
    mi: "km",
    km: "mi",
    lbs: "kg",
    kg: "lbs",
  };

  // Full names for units
  const unitSpellings = {
    gal: "gallons",
    l: "liters",
    mi: "miles",
    km: "kilometers",
    lbs: "pounds",
    kg: "kilograms",
  };

  // Conversion rates: multiply initNum by rate to get returnNum
  const conversionRates = {
    gal: 3.78541,
    l: 1 / 3.78541,
    mi: 1.60934,
    km: 1 / 1.60934,
    lbs: 0.453592,
    kg: 1 / 0.453592,
  };

  this.getNum = function (input) {
    // Find end of numeric part by stopping at first letter
    let i = 0;
    while (i < input.length) {
      const c = input[i];
      if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
        break;
      }
      i++;
    }
    const numStr = input.slice(0, i);
    if (numStr === "") return 1;

    // Count slashes
    let slashCount = 0;
    for (const ch of numStr) if (ch === "/") slashCount++;
    if (slashCount > 1) return "invalid number";

    // Handle fraction
    if (slashCount === 1) {
      const [numPart, denPart] = numStr.split("/");
      const numerator = parseFloat(numPart);
      const denominator = parseFloat(denPart);
      if (isNaN(numerator) || isNaN(denominator) || denominator === 0)
        return "invalid number";
      return numerator / denominator;
    }

    // Handle decimal or integer
    const number = parseFloat(numStr);
    return isNaN(number) ? "invalid number" : number;
  };

  this.getUnit = function (input) {
    // Find where unit starts
    let i = 0;
    while (i < input.length) {
      const c = input[i];
      if ((c >= "0" && c <= "9") || c === "." || c === "/") {
        i++;
      } else {
        break;
      }
    }
    const unitStr = input.slice(i);
    if (!unitStr) return "invalid unit";
    const lower = unitStr.toLowerCase();
    if (!unitMap.hasOwnProperty(lower)) return "invalid unit";
    // Return with 'L' uppercase
    return lower === "l" ? "L" : lower;
  };

  this.getReturnUnit = function (initUnit) {
    const lower = initUnit.toLowerCase();
    return unitMap[lower] || "invalid unit";
  };

  this.spellOutUnit = function (unit) {
    const lower = unit.toLowerCase();
    return unitSpellings[lower] || "invalid unit";
  };

  this.convert = function (initNum, initUnit) {
    const lower = initUnit.toLowerCase();
    const rate = conversionRates[lower];
    if (rate === undefined) return "invalid unit";
    return parseFloat((initNum * rate).toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const initName = this.spellOutUnit(initUnit);
    const returnName = this.spellOutUnit(returnUnit);
    return `${initNum} ${initName} converts to ${returnNum} ${returnName}`;
  };
}

module.exports = ConvertHandler;
