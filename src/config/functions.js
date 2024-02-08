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
const regions = [
  "National Capital Region (NCR)",
  "Cordillera Administrative Region (CAR)",
  "Region I (Ilocos Region)",
  "Region II (Cagayan Valley)",
  "Region III (Central Luzon)",
  "Region IV-A (CALABARZON)",
  "Region IV-B (MIMAROPA)",
  "Region V (Bicol Region)",
  "Region VI (Western Visayas)",
  "Region VII (Central Visayas)",
  "Region VIII (Eastern Visayas)",
  "Region IX (Zamboanga Peninsula)",
  "Region X (Northern Mindanao)",
  "Region XI (Davao Region)",
  "Region XII (SOCCSKSARGEN)",
  "Region XIII (Caraga)",
  "Autonomous Region in Muslim Mindanao (ARMM)",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
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

function offsetCoordinate(lat, lng, offsetMeters) {
  // Earth's radius in meters
  const earthRadius = 6378137; // Approximate value for Earth's radius in meters

  // Offset in radians
  const offsetLat = offsetMeters / earthRadius;
  const offsetLng =
    offsetMeters / (earthRadius * Math.cos((Math.PI * lat) / 180));

  // New latitude and longitude after offset
  const newLat = lat + (offsetLat * 180) / Math.PI;
  const newLng = lng + (offsetLng * 180) / Math.PI;

  return { lat: newLat, lng: newLng };
}
function searchItems(array, query) {
  // Convert query to lowercase for case-insensitive search
  const lowerCaseQuery = query.toLowerCase();

  // Array to store matched objects
  const matches = [];

  // Loop through each object in the array
  for (let obj of array) {
    // Check each key in the object
    for (let key in obj) {
      // Check if the value of the key contains the query string
      if (obj[key].toString().toLowerCase().includes(lowerCaseQuery)) {
        // If there's a match, add the object to the matches array
        matches.push(obj);
        // Break out of the loop to avoid adding the same object multiple times
        break;
      }
    }
  }

  return matches;
}
export const useFunction = () => {
  return {
    colors,
    regions,
    toUnderscored,
    toSpaced,
    capitalize,
    toSentenceCase,
    offsetCoordinate,
    searchItems,
  };
};
