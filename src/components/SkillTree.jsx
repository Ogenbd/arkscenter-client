import React, { useState, useEffect, useMemo } from "react";
import s from "./SkillTree.module.scss";

import data from "../data/data.js";
import {
  MAX_NA_LVL,
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
  mainMaxPoints,
  subMaxPoints,
  mainUsedPoints,
  subUsedPoints,
  treeState,
  onChange,
  readOnly,
}) => {
  const [selected, setSelected] = useState(0);

  const selectedIndex = selected ? sub : main;
  const selectedLevel = selected ? subLvl : mainLvl;

  const removePointsFromLockedSkills = (classIndex) => {
    if (treeState[classIndex]) {
      for (let skillIndex in treeState[classIndex]) {
        if (data[classIndex].skills[skillIndex].req === 80) {
          let treeStateCopy = JSON.parse(JSON.stringify(treeState));
          delete treeStateCopy[classIndex][skillIndex];
          onChange(treeStateCopy);
        }
      }
    }
  };

  const switchCheck = () => {
    if (selected === 1 && sub === -1) setSelected(0);
    if (selected === 0 && main === -1 && sub > -1) setSelected(1);
    if (mainLvl < 80) removePointsFromLockedSkills(main);
    if (subLvl < 80) removePointsFromLockedSkills(sub);
  };

  useEffect(switchCheck, [mainLvl, main, subLvl, sub, selected]);

  const lastRow = useMemo(() => {
    let biggest = 1;
    data[selectedIndex].skills.forEach((skill) => {
      if (skill.loc[2] > biggest) biggest = skill.loc[2];
    });
    return biggest;
  }, [selectedIndex]);

  // const removeLocked = () => {
  //   const checkLocked = (classIndex) => {
  //     if (classIndex === -1) return;
  //     if (treeState[classIndex]) {
  //       for (let key in treeState[classIndex]) {
  //         if (data[classIndex].skills[key].req === 80) {
  //           let treeStateCopy = JSON.parse(JSON.stringify(treeState));
  //           delete treeStateCopy[classIndex][key];
  //           onChange(treeStateCopy);
  //         }
  //       }
  //     }
  //   };
  //   if (subLvl < 80 && sub !== -1) checkLocked(sub);
  //   if (mainLvl < 80) checkLocked(main);
  // };

  // useEffect(removeLocked, [main, mainLvl, sub, subLvl]);

  const getSkillPoints = (skill) => {
    if (!treeState[selectedIndex] || !treeState[selectedIndex][skill.id])
      return skill.min;
    return treeState[selectedIndex][skill.id];
  };

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
          style={{ cursor: readOnly ? "auto" : "pointer" }}
          onClick={(e) => setSkillAt(skill, skill.max - i + 1, e)}
        />
      );
    }
    return pips;
  };

  const getUnlockPath = (skill) => {
    if (skill.unlockImg === "forkcustom") return null;
    const state = getSkillPoints(skill) > 0 ? "lit" : "unlit";
    const style = skill.unlockImg.includes("left") ? -94 : 83;
    return (
      <img
        className={s.path}
        style={{ transform: `translate(${style}px, 59px)` }}
        src={require(`../assets/images/paths/${skill.unlockImg}${state}.png`)}
        alt=""
      />
    );
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
    if (readOnly) return;
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
    console.log(skill);
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
      <div
        className={s.skillTree}
        style={{ gridTemplateRows: `repeat(${lastRow}, 1fr)` }}
      >
        {selectedIndex !== -1 &&
          data[selectedIndex].skills.map((skill) => (
            <Tooltip
              lang={lang}
              key={skill.id}
              style={{
                gridColumn: `${skill.loc[0]}/${skill.loc[0] + 1}`,
                gridRow: `${skill.loc[1]}/${skill.loc[1] + 1}`,
                opacity: lang === 0 && skill.req > MAX_NA_LVL ? 0 : 1,
                pointerEvents:
                  lang === 0 && skill.req > MAX_NA_LVL ? "none" : "all",
              }}
              skill={skill}
              level={getSkillPoints(skill)}
            >
              <div
                className={s.skillContainer}
                onContextMenu={(e) => setSkillAt(skill, skill.min, e)}
              >
                {skill.prereqs && skill.prereqs[1] > 0 && (
                  <div className={s.requirementsBlock}>
                    <p
                      className={
                        getSkillPoints(
                          data[selectedIndex].skills[skill.prereqs[0]]
                        ) >= skill.prereqs[1]
                          ? s.litNum
                          : s.unlitNum
                      }
                    >
                      {skill.prereqs[1]}
                    </p>
                  </div>
                )}
                <div className={s.skill} style={generateStyle(skill)}>
                  <div
                    onClick={(e) =>
                      setSkillAt(skill, getSkillPoints(skill) + 1, e)
                    }
                    className={s.skillDisplay}
                    style={{ cursor: readOnly ? "auto" : "pointer" }}
                  >
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
                {skill.unlockImg && getUnlockPath(skill)}
              </div>
            </Tooltip>
          ))}
      </div>
    </div>
  );
};

export default SkillTree;
