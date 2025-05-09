const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

// Create reverse maps for spelling and titles
const britishToAmericanSpelling = Object.fromEntries(
  Object.entries(americanToBritishSpelling).map(([am, br]) => [br, am])
);
const britishToAmericanTitles = Object.fromEntries(
  Object.entries(americanToBritishTitles).map(([am, br]) => [br, am])
);

class Translator {
  americanToBritish(text) {
    let translation = text;

    // Sort keys by length (longest first) to avoid nested matches
    for (let american of Object.keys(americanOnly).sort(
      (a, b) => b.length - a.length
    )) {
      const british = americanOnly[american];
      const regex = new RegExp(`\\b${american}\\b`, "gi");
      translation = translation.replace(
        regex,
        () => `<span class="highlight">${british}</span>`
      );
    }

    for (let american of Object.keys(americanToBritishSpelling).sort(
      (a, b) => b.length - a.length
    )) {
      const british = americanToBritishSpelling[american];
      const regex = new RegExp(`\\b${american}\\b`, "gi");
      translation = translation.replace(
        regex,
        () => `<span class="highlight">${british}</span>`
      );
    }

    for (let american of Object.keys(americanToBritishTitles).sort(
      (a, b) => b.length - a.length
    )) {
      const british = americanToBritishTitles[american];
      const regex = new RegExp(`\\b${american}`, "gi");
      translation = translation.replace(regex, (match) => {
        const formatted =
          match.charAt(0) === match.charAt(0).toUpperCase()
            ? british.charAt(0).toUpperCase() + british.slice(1)
            : british;
        return `<span class="highlight">${formatted}</span>`;
      });
    }

    // Handle time format conversion (AM/PM to 24-hour format)
    const timeRegex = /\b([0-1]?[0-9]|2[0-3]):[0-5][0-9]\b/g;
    translation = translation.replace(timeRegex, (match) => {
      return `<span class="highlight">${match.replace(":", ".")}</span>`;
    });

    return translation;
  }

  britishToAmerican(text) {
    let translation = text;

    // Sort keys by length (longest first) to avoid nested matches
    for (let british of Object.keys(britishOnly).sort(
      (a, b) => b.length - a.length
    )) {
      const american = britishOnly[british];
      const regex = new RegExp(`\\b${british}\\b`, "gi");
      translation = translation.replace(
        regex,
        () => `<span class="highlight">${american}</span>`
      );
    }

    for (let british of Object.keys(britishToAmericanSpelling).sort(
      (a, b) => b.length - a.length
    )) {
      const american = britishToAmericanSpelling[british];
      const regex = new RegExp(`\\b${british}\\b`, "gi");
      translation = translation.replace(
        regex,
        () => `<span class="highlight">${american}</span>`
      );
    }

    for (let british of Object.keys(britishToAmericanTitles).sort(
      (a, b) => b.length - a.length
    )) {
      const american = britishToAmericanTitles[british];
      const regex = new RegExp(`\\b${british}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
        const formatted =
          match.charAt(0) === match.charAt(0).toUpperCase()
            ? american.charAt(0).toUpperCase() + american.slice(1)
            : american;
        return `<span class="highlight">${formatted}</span>`;
      });
    }

    // Handle time format conversion (24-hour to AM/PM)
    const timeRegex = /\b([0-1]?[0-9]|2[0-3])\.[0-5][0-9]\b/g;
    translation = translation.replace(timeRegex, (match) => {
      return `<span class="highlight">${match.replace(".", ":")}</span>`;
    });

    return translation;
  }
}

module.exports = Translator;
