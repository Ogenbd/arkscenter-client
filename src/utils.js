import data from "./data/data.json";

export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const cloneArr = (items) =>
  items.map((item) => (Array.isArray(item) ? cloneArr(item) : item));

export const isMainOnly = (classIndex) => data[classIndex].mainOnly;

export const hasSub = (classIndex) => data[classIndex].hasSub;

// ************************************* COLORS *******************************************

export const completedBorder = "#4ec79a";
export const completedBackground = "#0c4927";
export const completedFont = "#ffac80";
export const border = "#42a1d8";
export const background = "#0a3f53";
export const font = "white";
export const disabledBorder = "#677b84";
export const disabledBackground = "#15191c";
export const disabledFont = "#808080";

// ************************************* ENCODING *****************************************

const zipStr = (s) => {
  let dict = {};
  let data = (s + "").split("");
  let out = [];
  let currChar;
  let phrase = data[0];
  let code = 256;
  for (let i = 1; i < data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase = currChar;
    }
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (let i = 0; i < out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  }
  return out.join("");
};

const unzipStr = (s) => {
  let dict = {};
  let data = (s + "").split("");
  let currChar = data[0];
  let oldPhrase = currChar;
  let out = [currChar];
  let code = 256;
  let phrase;
  for (let i = 1; i < data.length; i++) {
    let currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
    }
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  }
  return out.join("");
};

export const encodeBuild = (
  main,
  sub,
  mainLvl,
  subLvl,
  mainCOSP,
  subCOSP,
  magBonus,
  gender,
  race,
  skills,
  classBoosts,
  lang
) => {
  const version = 1;
  const cMagBonus = {};
  magBonus.forEach((stat, index) =>
    stat > 0 ? (cMagBonus[index] = stat) : null
  );
  const cClassBoosts = [];
  classBoosts.forEach((boost, index) =>
    boost ? null : cClassBoosts.push(index)
  );
  const jsonData = [
    version,
    main,
    sub,
    mainLvl,
    subLvl,
    mainCOSP,
    subCOSP,
    cMagBonus,
    gender,
    race,
    skills,
    cClassBoosts,
    lang,
  ];
  return zipStr(
    Buffer.from(JSON.stringify(jsonData), "binary").toString("base64")
  );
};

export const decodeBuild = (buildString) => {
  const jsonData = Buffer.from(unzipStr(buildString), "base64").toString(
    "binary"
  );
  const data = JSON.parse(jsonData);
  const mag = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let key in data[7]) {
    mag[key] = data[7][key];
  }
  data[7] = mag;
  const boost = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  data[11].forEach((item) => (boost[item] = 0));
  data[11] = boost;
  // const version = data[0];
  // const main = data[1];
  // const sub = data[2];
  // const mainLvl = data[3];
  // const subLvl = data[4];
  // const mainCOSP = data[5];
  // const subCOSP = data[6];
  // const classBoosts = data[7];
  // const magBonus = data[8];
  // const gender = data[9];
  // const race = data[10];
  // const skills = data[11];
  // return {
  //   version,
  //   main,
  //   mainLvl,
  //   sub,
  //   subLvl,
  //   mainCOSP,
  //   subCOSP,
  //   classBoosts,
  //   magBonus,
  //   gender,
  //   race,
  //   skills,
  // };
  return data;
};
