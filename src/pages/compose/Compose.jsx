import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import s from "./Compose.module.scss";

import data from "../../data/data.json";
import racemods from "../../data/racemods.json";
import statarrays from "../../data/statarrays.json";
import { statNames, raceNames } from "../../lang";
import { isMainOnly, hasSub, encodeBuild, decodeBuild } from "../../utils";

import TitleFrame from "../../components/frames/TitleFrame";
import BoxFrame from "../../components/frames/BoxFrame";
import Select from "../../components/Select";
import IntegerInput from "../../components/IntegerInput";
import ClassBoosts from "../../components/ClassBoosts";
import SkillTree from "../../components/SkillTree";
import MarkdownEditor from "../../components/markdown/MarkdownEditor";

const Compose = () => {
  const location = useLocation();
  const history = useHistory();
  const [buildString, setBuildString] = useState(
    new URLSearchParams(location.search).get("s") || ""
  );
  const [lang, setLang] = useState(1);
  const [main, setMain] = useState(0);
  const [sub, setSub] = useState(-1);
  const [mainLvlInput, setMainLvlInput] = useState(lang > 0 ? 95 : 75);
  const [subLvlInput, setSubLvlInput] = useState(lang > 0 ? 95 : 75);
  const [mainCOSPInput, setMainCOSPInput] = useState(14);
  const [subCOSPInput, setSubCOSPInput] = useState(14);
  const [classBoosts, setClassBoosts] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [magBonusInput, setMagBonusInput] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
  const [gender, setGender] = useState(0);
  const [race, setRace] = useState(0);
  const [treeState, setTreeState] = useState({});
  const [guide, setGuide] = useState("");

  const mainLvl = mainLvlInput === "" ? 1 : mainLvlInput;
  const subLvl = subLvlInput === "" ? 1 : subLvlInput;
  const mainCOSP = mainLvlInput === "" ? 0 : mainCOSPInput;
  const subCOSP = subCOSPInput === "" ? 0 : subCOSPInput;
  const magBonus = magBonusInput.map((stat) => (stat === "" ? 0 : stat));
  const maxLevel = lang > 0 ? 95 : 75;

  const uriDecode = () => {
    if (buildString.length < 1) return;
    const b = decodeBuild(buildString);
    // const mag = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // for (let key in b[7]) {
    //   mag[key] = b[7][key];
    // }
    setMain(b[1]);
    setSub(b[2]);
    setMainLvlInput(b[3]);
    setSubLvlInput(b[4]);
    setMainCOSPInput(b[5]);
    setSubCOSPInput(b[6]);
    setMagBonusInput(b[7]);
    setGender(b[8]);
    setRace(b[9]);
    setTreeState(b[10]);
    setClassBoosts(b[11]);
    // setLang(b[12]);
  };

  useEffect(uriDecode, []);

  const uriEncode = () => {
    const str = encodeBuild(
      main,
      sub,
      mainLvlInput,
      subLvlInput,
      mainCOSPInput,
      subCOSPInput,
      magBonusInput,
      gender,
      race,
      treeState,
      classBoosts,
      lang
    );
    setBuildString(str);
    history.replace(`?s=${str}`);
  };

  useEffect(uriEncode, [
    main,
    sub,
    mainLvlInput,
    subLvlInput,
    mainCOSPInput,
    subCOSPInput,
    classBoosts,
    magBonusInput,
    gender,
    race,
    treeState,
    lang,
  ]);

  const calcClassBoosts = () => {
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

  const calcMagStats = () => {
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

  const calcTreeStats = () => {
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

  const calcBaseStats = () => {
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

  const baseStats = useMemo(calcBaseStats, [
    main,
    sub,
    mainLvlInput,
    subLvlInput,
    gender,
    race,
  ]);

  const calcFinalStats = () => {
    const classBoostStats = calcClassBoosts();
    const magBonusStats = calcMagStats();
    const skillTreeStats = calcTreeStats();
    let stats = [baseStats, classBoostStats, magBonusStats, skillTreeStats];
    return stats.reduce(
      (acc, arr) => arr.map((stat, index) => (acc[index] || 0) + stat),
      []
    );
  };
  const finalStats = useMemo(calcFinalStats, [
    main,
    sub,
    baseStats,
    classBoosts,
    magBonusInput,
    treeState,
  ]);

  const mainOptions = useMemo(
    () =>
      data
        .map((item, index) => {
          return {
            id: index,
            display: item.name[lang],
            imgClass: `${item.img}`,
          };
        })
        .slice(0, lang === 0 ? 9 : 12),
    [lang]
  );

  const subOptions = useMemo(
    () =>
      data
        .map((item, classIndex) => {
          if (classIndex !== main && !isMainOnly(classIndex)) {
            return {
              id: classIndex,
              display: item.name[lang],
              imgClass: `${item.img}`,
            };
          }
          return null;
        })
        .slice(0, lang === 0 ? 9 : 12),
    [main, lang]
  );

  const onClassBoostChange = (newBoosts) => {
    setClassBoosts(newBoosts);
  };

  const onMainChange = (classIndex) => {
    if (classIndex === sub) setSub(main);
    if (!hasSub(classIndex)) setSub(-1);
    setMain(classIndex);
  };

  const onSubChange = (classIndex) => {
    setSub(classIndex);
  };

  const onMainLvlChange = (newValue) => {
    setMainLvlInput(newValue);
  };

  const onSubLvlChange = (newValue) => {
    setSubLvlInput(newValue);
  };

  const onMainCOSPChange = (newValue) => {
    setMainCOSPInput(newValue);
  };

  const onSubCOSPChange = (newValue) => {
    setSubCOSPInput(newValue);
  };

  const allotedPoints = magBonus.reduce((total, value) => total + value);
  const remainingPoints = 200 - allotedPoints;

  const onMagBonusChange = (newValue, statIndex) => {
    let newMagBonus = magBonus.map((stat, index) => {
      return index === statIndex ? newValue : stat;
    });
    setMagBonusInput(newMagBonus);
  };

  const onTreeStateChange = (treeState) => {
    setTreeState(treeState);
  };

  //   const temp = Buffer.from(JSON.stringify(mainOptions[0]), "binary").toString(
  //     "base64"
  //   );
  //   const temp2 = JSON.parse(Buffer.from(temp, "base64").toString("binary"));
  return (
    <div className={s.compose}>
      <div className={s.classOptionsContainer}>
        <div className={s.container}>
          <TitleFrame>
            <div className={s.titleContainer}>
              <div className={`game-icon ${s.main}`} />
              <h1>Main Class</h1>
            </div>
          </TitleFrame>
          <BoxFrame>
            <div className={s.classOptionsContent}>
              <Select
                selected={main}
                options={mainOptions}
                onChange={onMainChange}
                placeholder={"Select Mainclass"}
              />
              <IntegerInput
                label="Level"
                value={mainLvlInput}
                minValue={1}
                maxValue={maxLevel}
                onChange={onMainLvlChange}
              />
              <IntegerInput
                label="CO SP"
                value={mainCOSPInput}
                minValue={0}
                maxValue={14}
                onChange={onMainCOSPChange}
              />
            </div>
          </BoxFrame>
        </div>
        <div className={s.container}>
          <TitleFrame>
            <div className={s.titleContainer}>
              <div className={`game-icon ${s.sub}`} />
              <h1>Sub Class</h1>
            </div>
          </TitleFrame>
          <BoxFrame>
            <div className={s.classOptionsContent}>
              <Select
                selected={sub}
                options={subOptions}
                onChange={onSubChange}
                disabled={main !== -1 && !hasSub(main)}
                placeholder={"Select Subclass"}
              />
              <IntegerInput
                label="Level"
                value={subLvlInput}
                minValue={1}
                maxValue={maxLevel}
                onChange={onSubLvlChange}
              />
              <IntegerInput
                label="CO SP"
                value={subCOSPInput}
                minValue={0}
                maxValue={14}
                onChange={onSubCOSPChange}
              />
            </div>
          </BoxFrame>
          {/* <Select></Select> */}
        </div>
        <div className={s.container}>
          <ClassBoosts
            lang={lang}
            classBoosts={classBoosts}
            onChange={onClassBoostChange}
          />
        </div>
        <div className={s.container}>
          <TitleFrame>
            <div className={s.titleContainer}>
              <h1>Stats</h1>
            </div>
          </TitleFrame>
          <BoxFrame>
            <div className={s.raceOptions}>
              <div
                className={`${s.sliderRadio} ${
                  race === 1
                    ? s.secondPosition
                    : race === 2
                    ? s.thirdPosition
                    : race === 3
                    ? s.fourthPosition
                    : ""
                }`}
              >
                {raceNames.map((option, index) => (
                  <div
                    key={index}
                    className={s.sliderOption}
                    onClick={() => setRace(index)}
                  >
                    {option[lang]}
                  </div>
                ))}
              </div>
              <div
                className={`${s.sliderRadio} ${
                  gender !== 0 ? s.secondPosition : ""
                }`}
              >
                <div
                  className={`${s.sliderOption} ${s.gender}`}
                  onClick={() => setGender(0)}
                >
                  ♂
                </div>
                <div
                  className={`${s.sliderOption} ${s.gender}`}
                  onClick={() => setGender(1)}
                >
                  ♀
                </div>
              </div>
            </div>
            <div className={s.stats}>
              <div className={`${s.magHeader} ${s.magBorder}`}>
                <p>Mag stats</p>
                <p>{allotedPoints}/200</p>
              </div>
              {statNames
                .map((stat, index) => (
                  <div className={`${s.stat} ${s.magBorder}`} key={index}>
                    <IntegerInput
                      value={magBonusInput[index]}
                      minValue={0}
                      maxValue={remainingPoints + magBonus[index]}
                      index={index}
                      onChange={onMagBonusChange}
                    />
                  </div>
                ))
                .slice(2, 9)}
              {statNames.map((stat, index) => (
                <div key={index} className={`${s.stat} ${s.magBorder}`}>
                  <p>{stat[lang]}</p>
                </div>
              ))}
              {finalStats.map((stat, index) => (
                <div key={index} className={s.stat}>
                  <p>{finalStats[index]}</p>
                </div>
              ))}
            </div>
          </BoxFrame>
        </div>
      </div>
      <SkillTree
        lang={lang}
        main={main}
        mainLvl={mainLvl}
        sub={sub}
        subLvl={subLvl}
        mainCOSP={mainCOSP}
        subCOSP={subCOSP}
        treeState={treeState}
        onChange={onTreeStateChange}
      />
      <MarkdownEditor guide={guide} onChange={setGuide} />
    </div>
  );
};

export default Compose;
