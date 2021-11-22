import data from "./data/data.js";
import racemods from "./data/racemods.json";
import statarrays from "./data/statarrays.json";
// import { raceNames, languages } from "./lang";

export const MAX_JP_LVL = 95;
export const MAX_NA_LVL = 80;

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

export const objectifyMag = (magStats) => {
  const objectifiedMagStats = {};
  magStats.forEach((stat, index) =>
    stat > 0 ? (objectifiedMagStats[index] = stat) : null
  );
  return objectifiedMagStats;
};

export const deobjectifyMag = (magObj) => {
  const magStats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let key in magObj) {
    magStats[key] = magObj[key];
  }
  return magStats;
};

const calcClassBoosts = (classBoosts) => {
  let stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  data.forEach((item, index) => {
    if (classBoosts[index]) {
      stats.forEach((stat, statIndex) => {
        stats[statIndex] += item.boost[statIndex];
      });
    }
  });
  return stats;
};

const calcMagStats = (main, sub, magBonus) => {
  let stats = [...magBonus];
  if (main === 6 || sub === 6) {
    stats[2] += stats[5];
    stats[3] += stats[5];
  }
  if (main === 7 || sub === 7) {
    stats[2] += stats[5];
    stats[4] += stats[5];
  }
  if (main === 10 || sub === 10) {
    stats[2] += stats[5];
    stats[4] += stats[5];
    stats[4] += stats[5];
  }
  if (main === 9 || main === 11 || sub === 11) {
    let s = stats[3] + stats[4];
    let r = stats[2] + stats[4];
    let t = stats[2] + stats[3];
    stats[2] += s;
    stats[3] += r;
    stats[4] += t;
  }
  return stats;
};

const calcTreeStats = (main, sub, treeState) => {
  let stats = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let skillIndex in treeState[main]) {
    if (data[main].skills[skillIndex].stat) {
      data[main].skills[skillIndex].stat.forEach((stat) => {
        stats[stat[0]] += statarrays[stat[1]][treeState[main][skillIndex]];
      });
    }
  }
  if (sub !== -1) {
    for (let skillIndex in treeState[sub]) {
      if (data[sub].skills[skillIndex].stat) {
        data[sub].skills[skillIndex].stat.forEach((stat) => {
          stats[stat[0]] += statarrays[stat[1]][treeState[sub][skillIndex]];
        });
      }
    }
  }
  return stats;
};

export const calcBaseStats = (main, sub, mainLvl, subLvl, gender, race) => {
  let stats = [];
  let mainStats =
    main !== -1 ? data[main].stats[mainLvl - 1] : [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let subStats = (sub === -1
    ? [0, 0, 0, 0, 0, 0, 0, 0, 0]
    : subLvl > mainLvl
    ? data[sub].stats[mainLvl - 1]
    : data[sub].stats[subLvl - 1]
  ).map((stat) => stat * 0.2);
  subStats[1] = 0;
  for (let i = 0; i < 9; i++) {
    stats.push(
      Math.floor((mainStats[i] + subStats[i]) * racemods[gender][race][i])
    );
  }
  return stats;
};

export const calcFinalStats = (
  main,
  sub,
  baseStats,
  classBoosts,
  magBonus,
  treeState
) => {
  const classBoostStats = calcClassBoosts(classBoosts);
  const magBonusStats = calcMagStats(main, sub, magBonus);
  const skillTreeStats = calcTreeStats(main, sub, treeState);
  let stats = [baseStats, classBoostStats, magBonusStats, skillTreeStats];
  return stats.reduce(
    (acc, arr) => arr.map((stat, index) => (acc[index] || 0) + stat),
    []
  );
};

export const calcPointsUsed = (classIndex, treeState) => {
  if (classIndex === -1) return 0;
  let sum = 0;
  for (let key in treeState[classIndex]) {
    sum += treeState[classIndex][key];
  }
  return sum;
};

// export const getLangOptions = (setLang) =>
//   languages.map((option, index) => {
//     return {
//       label: option,
//       onChange: () => {
//         setLang(index);
//       },
//     };
//   });

// export const getRaceOptions = (setRace, lang) =>
//   raceNames.map((option, index) => {
//     return {
//       label: option[lang],
//       onChange: () => {
//         setRace(index);
//       },
//     };
//   });

// export const getGenderOptions = (setGender) => [
//   { label: "♂", onChange: () => setGender(0) },
//   { label: "♀", onChange: () => setGender(1) },
// ];

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

export const zipStr = (s) => {
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

export const unzipStr = (s) => {
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
  mainVersion,
  subVersion,
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
  const cMagBonus = objectifyMag(magBonus);
  const cClassBoosts = [];
  classBoosts.forEach((boost, index) =>
    boost ? null : cClassBoosts.push(index)
  );
  const jsonData = [
    main,
    sub,
    mainVersion,
    subVersion,
    mainLvl,
    subLvl,
    mainCOSP,
    subCOSP,
    cMagBonus,
    gender,
    race,
    skills,
    cClassBoosts,
  ];
  return Buffer.from(JSON.stringify(jsonData), "binary").toString("base64");
};

export const decodeBuild = (buildString) => {
  const jsonData = Buffer.from(buildString, "base64").toString("binary");
  const data = JSON.parse(jsonData);
  const mag = deobjectifyMag(data[9]);
  data[8] = mag;
  const boost = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  data[12].forEach((item) => (boost[item] = 0));
  data[12] = boost;
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
