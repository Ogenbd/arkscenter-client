import React, { useState, useEffect } from "react";
import s from "./SkillTree.module.scss";

import data from "../data/data.json";
import {
  completedBackground,
  completedFont,
  completedBorder,
  disabledBackground,
  disabledFont,
  disabledBorder,
  background,
  font,
  border,
} from "../utils";

import Tooltip from "./Tooltip";

const completed = {
  borderColor: completedBorder,
  color: completedFont,
  backgroundColor: completedBackground,
};

const disabled = {
  borderColor: disabledBorder,
  color: disabledFont,
  backgroundColor: disabledBackground,
};

const SkillTree = ({
  lang,
  main,
  sub,
  mainLvl,
  subLvl,
  mainCOSP,
  subCOSP,
  treeState,
  onChange,
}) => {
  const [selected, setSelected] = useState(0);

  const selectedIndex = selected ? sub : main;
  const selectedLevel = selected ? subLvl : mainLvl;
  const mainMaxPoints = mainLvl + mainCOSP;
  const subMaxPoints = subLvl + subCOSP;

  useEffect(() => {
    if (selected === 1 && sub === -1) {
      setSelected(0);
    }
    if (selected === 0 && main === -1 && sub > -1) {
      setSelected(1);
    }
  }, [sub, main, selected]);

  const removeLocked = () => {
    const checkLocked = (classIndex) => {
      if (classIndex === -1) return;
      if (treeState[classIndex]) {
        for (let key in treeState[classIndex]) {
          if (data[classIndex].skills[key].req === 80) {
            let treeStateCopy = JSON.parse(JSON.stringify(treeState));
            delete treeStateCopy[classIndex][key];
            onChange(treeStateCopy);
          }
        }
      }
    };
    if (subLvl < 80 && sub !== -1) checkLocked(sub);
    if (mainLvl < 80) checkLocked(main);
  };

  useEffect(removeLocked, [main, mainLvl, sub, subLvl]);

  const getSkillPoints = (skill) => {
    if (!treeState[selectedIndex] || !treeState[selectedIndex][skill.id])
      return skill.min;
    return treeState[selectedIndex][skill.id];
  };

  const calcPointsUsed = (classIndex) => {
    if (classIndex === -1) return 0;
    let sum = 0;
    for (let key in treeState[classIndex]) {
      sum += treeState[classIndex][key];
    }
    return sum;
  };

  const mainUsedPoints = calcPointsUsed(main);
  const subUsedPoints = calcPointsUsed(sub);

  const generatePips = (skill) => {
    if (!skill) return null;
    let pips = [];
    if (skill.min === 1) {
      return <div className={`${s.pip} ${s.litPip}`} />;
    }
    for (let i = skill.max; i >= 1; i--) {
      pips.push(
        <div
          key={i}
          className={`${s.pip} ${
            getSkillPoints(skill) > skill.max - i ? s.litPip : s.unlitPip
          }`}
          onClick={(e) => setSkillAt(skill, skill.max - i + 1, e)}
        />
      );
    }
    return pips;
  };

  const generateStyle = (skill) => {
    if (!skill) return null;
    const currSkillPoints = getSkillPoints(skill);
    const currPrereqSkillPoints = skill.prereqs
      ? getSkillPoints(data[selectedIndex].skills[skill.prereqs[0]])
      : null;
    let style = {
      borderColor: border,
      color: font,
      backgroundColor: background,
    };
    if (skill.req) {
      if (skill.req > selectedLevel) {
        style = disabled;
      } else if (skill.min === skill.max || currSkillPoints === skill.max) {
        style = completed;
      }
    } else if (skill.min === skill.max || currSkillPoints === skill.max) {
      style = completed;
    } else if (skill.prereqs) {
      if (data[selectedIndex].skills[skill.prereqs[0]].min !== 1) {
        if (skill.prereqs[1] > currPrereqSkillPoints) {
          style = disabled;
        }
      }
    }

    return style;
  };

  const setSkillAt = (skill, num, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (skill.min === skill.max || num > skill.max) return;
    if (skill.req > selectedLevel) return;
    let treeStateCopy = JSON.parse(JSON.stringify(treeState));
    let newTreeState = generateNewSkillTree(treeStateCopy, skill, num);
    num === 0
      ? delete newTreeState[selectedIndex][skill.id]
      : (newTreeState[selectedIndex][skill.id] = num);

    for (let classKey in newTreeState) {
      if (!Object.entries(newTreeState[classKey]).length) {
        delete newTreeState[classKey];
      }
    }
    onChange(newTreeState);
  };

  const generateNewSkillTree = (treeStateCopy, skill, num) => {
    let newTreeState = treeStateCopy;
    const currSkillPoints = getSkillPoints(skill);
    const currPrereqSkillPoints = skill.prereqs
      ? getSkillPoints(data[selectedIndex].skills[skill.prereqs[0]])
      : null;
    if (skill.unlocks && currSkillPoints > num) {
      skill.unlocks.forEach((unlock) => {
        if (unlock[1] > num) {
          newTreeState = generateNewSkillTree(
            newTreeState,
            data[selectedIndex].skills[unlock[0]],
            0
          );
        }
      });
    }
    if (
      skill.prereqs &&
      currSkillPoints < num &&
      currPrereqSkillPoints < skill.prereqs[1]
    ) {
      newTreeState = generateNewSkillTree(
        newTreeState,
        data[selectedIndex].skills[skill.prereqs[0]],
        skill.prereqs[1]
      );
    }
    if (!newTreeState[selectedIndex]) newTreeState[selectedIndex] = {};
    num === 0
      ? delete newTreeState[selectedIndex][skill.id]
      : (newTreeState[selectedIndex][skill.id] = num);
    return newTreeState;
  };

  return (
    <div className={s.skillManager}>
      <div className={s.treeTabs}>
        <div>
          <div
            className={`${s.tab} ${selected === 0 ? s.selected : s.deselected}`}
            onClick={() => setSelected(0)}
          >
            <div className={s.mainIcon} />
            <div className={s.tabData}>
              <div className={`${s.icon} ${data[main].img}`} />
              <p>{data[main].name[lang]}</p>
            </div>
            <p style={mainUsedPoints > mainMaxPoints ? { color: "red" } : {}}>
              {mainUsedPoints}/{mainMaxPoints}
            </p>
          </div>
        </div>
        <div
          className={`${s.tab} ${
            main > 8 || sub === -1
              ? s.disabled
              : selected === 1
              ? s.selected
              : s.deselected
          }`}
          onClick={() => setSelected(1)}
        >
          <div className={s.subIcon} />
          <div className={s.tabData}>
            <div className={`${s.icon} ${sub === -1 ? "" : data[sub].img}`} />
            <p>{sub < 0 ? "" : data[sub].name[lang]}</p>
          </div>
          <p style={subUsedPoints > subMaxPoints ? { color: "red" } : {}}>
            {subUsedPoints}/{subMaxPoints}
          </p>
        </div>
      </div>
      <div className={s.skillTree}>
        {selectedIndex !== -1 &&
          data[selectedIndex].skills.map((skill) => (
            <Tooltip
              lang={lang}
              key={skill.id}
              style={{
                gridColumn: `${skill.loc[0]}/${skill.loc[0] + 1}`,
                gridRow: `${skill.loc[1]}/${skill.loc[1] + 1}`,
                opacity: lang === 0 && skill.req > 75 ? 0 : 1,
                pointerEvents: lang === 0 && skill.req > 75 ? "none" : "all",
              }}
              skill={skill}
              level={getSkillPoints(skill)}
            >
              <div
                className={s.skillContainer}
                onClick={(e) => setSkillAt(skill, getSkillPoints(skill) + 1, e)}
                onContextMenu={(e) => setSkillAt(skill, skill.min, e)}
              >
                <div className={s.skill} style={generateStyle(skill)}>
                  <div className={s.skillDisplay}>
                    <img
                      src={require(`../assets/images/skills/${skill.img}.png`)}
                      alt={skill.name[lang]}
                      style={{
                        opacity: `${
                          skill.prereqs &&
                          (!skill.min === 1 ||
                            getSkillPoints(skill) < skill.prereqs[1])
                            ? 0.6
                            : 1
                        }`,
                      }}
                    />
                    <p>{skill.name[lang]}</p>
                  </div>
                  {skill.req > selectedLevel ? (
                    <div className={`${s.pips} ${s.locked}`}>
                      <div className={s.lock} />
                      <p>Lv.{skill.req}</p>
                    </div>
                  ) : (
                    <div className={s.pipContainer}>
                      <div className={s.pips}>{generatePips(skill)}</div>
                      <p>{getSkillPoints(skill)}</p>
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>
          ))}
      </div>
    </div>
  );
};

export default SkillTree;
