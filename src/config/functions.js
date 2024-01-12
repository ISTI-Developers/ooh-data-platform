const conjunctionWords = [
  "and",
  "but",
  "or",
  "nor",
  "for",
  "so",
  "yet",
  "although",
  "because",
  "since",
  "unless",
  "while",
  "to",
  "at",
  "on",
  "off",
  "in",
  "of",
];
const colors = [
  "#84b6d8",
  "#5c7f97",
  "#344856",
  "#b8b5e7",
  "#8984d8",
  "#5f5c97",
  "#84d88e",
  "#5c9763",
  "#c1ebc6",
  "#27402a",
];
const toUnderscored = (text) => {
  return text.split(" ").join("_");
};
const toSpaced = (text) => {
  return text.split("_").join(" ");
};
const capitalize = (text = "", sep = " ") => {
  const tempText = text.split(sep);
  tempText.forEach((text, index) => {
    if (!conjunctionWords.includes(text)) {
      tempText[index] = text.charAt(0).toUpperCase() + text.slice(1);
    }
  });
  return tempText.join(" ");
};

const toSentenceCase = (str) => {
  // Check if the input string is not empty
  if (str && typeof str === "string") {
    // Convert the first character to uppercase and the rest to lowercase
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Return an empty string if the input is invalid
  return "";
};

export const useFunction = () => {
  return {
    colors,
    toUnderscored,
    toSpaced,
    capitalize,
    toSentenceCase,
  };
};
