import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import s from "./Compose.module.scss";

import data from "../../data/data.js";
import { baseUrl } from "../../environment";
import {
  MAX_JP_LVL,
  MAX_NA_LVL,
  isMainOnly,
  hasSub,
  encodeBuild,
  decodeBuild,
  objectifyMag,
  calcBaseStats,
  calcFinalStats,
  calcPointsUsed,
  zipStr,
} from "../../utils";
// import currentVersions from "../../data/currentversions";
import userContext from "../../providers/UserContext";
import LanguageContext from "../../providers/LanguageContext";

import TitleFrame from "../../components/frames/TitleFrame";
import BoxFrame from "../../components/frames/BoxFrame";
import Select from "../../components/Select";
import IntegerInput from "../../components/IntegerInput";
import ClassBoosts from "../../components/ClassBoosts";
import SkillTree from "../../components/SkillTree";
import MarkdownEditor from "../../components/markdown/MarkdownEditor";
import StatsBlock from "../../components/StatsBlock";

const Compose = () => {
  const location = useLocation();
  const history = useHistory();
  const { user } = useContext(userContext);
  const [buildString, setBuildString] = useState(
    new URLSearchParams(location.search).get("s") || ""
  );
  const { lang } = useContext(LanguageContext);
  const [main, setMain] = useState(0);
  const [sub, setSub] = useState(-1);
  const [mainLvlInput, setMainLvlInput] = useState(
    lang > 0 ? MAX_JP_LVL : MAX_NA_LVL
  );
  const [subLvlInput, setSubLvlInput] = useState(
    lang > 0 ? MAX_JP_LVL : MAX_NA_LVL
  );
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");

  const mainVersion = data[main].version;
  const subVersion = sub !== -1 ? data[sub].version : -1;
  const mainLvl = mainLvlInput === "" ? 1 : mainLvlInput;
  const subLvl = sub !== -1 ? (subLvlInput === "" ? 1 : subLvlInput) : 0;
  const mainCOSP = mainLvlInput === "" ? 0 : mainCOSPInput;
  const subCOSP = sub !== -1 ? (subCOSPInput === "" ? 0 : subCOSPInput) : 0;
  const magBonus = magBonusInput.map((stat) => (stat === "" ? 0 : stat));
  const maxLevel = lang > 0 ? MAX_JP_LVL : MAX_NA_LVL;
  const mainMaxPoints = mainLvl + mainCOSP;
  const subMaxPoints = subLvl + subCOSP;

  const mainUsedPoints = calcPointsUsed(main, treeState);
  const subUsedPoints = calcPointsUsed(sub, treeState);

  const versionClassCheck = () => {
    if (lang === 0 && main > 8) onMainChange(0);
    if (lang === 0 && sub > 8) onSubChange(-1);
  };

  useEffect(versionClassCheck, [lang]);

  const uriDecode = () => {
    if (buildString.length < 1) return;
    const b = decodeBuild(buildString);
    setMain(b[0]);
    setSub(b[1]);
    setMainLvlInput(b[4]);
    setSubLvlInput(b[5]);
    setMainCOSPInput(b[6]);
    setSubCOSPInput(b[7]);
    setMagBonusInput(b[8]);
    setGender(b[9]);
    setRace(b[10]);
    setTreeState(b[11]);
    setClassBoosts(b[12]);
  };

  useEffect(uriDecode, []);

  const uriEncode = () => {
    const str = encodeBuild(
      main,
      sub,
      mainVersion,
      subVersion,
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

  const baseStats = useMemo(
    () => calcBaseStats(main, sub, mainLvl, subLvl, gender, race),
    [main, sub, mainLvl, subLvl, gender, race]
  );

  const finalStats = useMemo(
    () =>
      calcFinalStats(main, sub, baseStats, classBoosts, magBonus, treeState),
    [main, sub, baseStats, classBoosts, magBonus, treeState]
  );

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
    () => {
      let options = [];
      data.forEach((item, classIndex) => {
        if (classIndex !== main && !isMainOnly(classIndex)) {
          if (lang !== 0) {
            options.push({
              id: classIndex,
              display: item.name[lang],
              imgClass: `${item.img}`,
            });
          } else if (classIndex < 9) {
            options.push({
              id: classIndex,
              display: item.name[lang],
              imgClass: `${item.img}`,
            });
          }
        }
      });
      return options;
    },
    // .slice(0, lang === 0 ? 9 : 12)}
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

  const onMagBonusChange = (newValue, statIndex) => {
    let newMagBonus = magBonus.map((stat, index) => {
      return index === statIndex ? newValue : stat;
    });
    setMagBonusInput(newMagBonus);
  };

  const onTreeStateChange = (treeState) => {
    setTreeState(treeState);
  };

  const saveEnabled =
    mainUsedPoints > mainMaxPoints ||
    subUsedPoints > subMaxPoints ||
    mainUsedPoints < 1 ||
    (sub !== -1 && subUsedPoints < 1) ||
    title === "" ||
    !user ||
    !user.token ||
    !user.data
      ? false
      : true;

  const checkTitle = (value) => {
    if (value.length <= 100) setTitle(value);
  };

  const checkDescription = (value) => {
    if (value.length <= 300) setDescription(value);
  };

  const saveGuide = async () => {
    if (!saveEnabled) return;
    const trimmedSkills = {};
    trimmedSkills[main] = treeState[main];
    if (sub !== -1) trimmedSkills[sub] = treeState[sub];
    const jsonData = JSON.stringify({
      title: title,
      description: description,
      markdown: markdown.length ? zipStr(markdown) : markdown,
      skills: trimmedSkills,
      main,
      sub,
      mainVersion: mainVersion,
      subVersion: subVersion,
      mainLvl,
      subLvl,
      mainCOSP,
      subCOSP,
      mag: objectifyMag(magBonus),
      classBoosts,
      race,
      gender,
    });
    fetch(`${baseUrl}/saveguide`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: jsonData,
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            history.push(
              `/guide/${data.id}/${data.title.split(" ").join("-")}`
            );
            console.log(data);
          });
          // res.json().then((res) => {
          //   console.log(res);
          // });
        } else if (res.status === 401) {
          console.log(res);
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log("error: " + err);
      });
  };

  return (
    <div className={s.compose}>
      {/* <LanguageSelect setter={setLang} selected={lang} /> */}
      <div className={s.classOptionsContainer}>
        <div className={s.container}>
          <TitleFrame>
            <div className={`game-icon ${s.main}`} />
            <h1>Main Class</h1>
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
            <div className={`game-icon ${s.sub}`} />
            <h1>Sub Class</h1>
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
        </div>
        <div className={s.container}>
          <ClassBoosts
            lang={lang}
            classBoosts={classBoosts}
            onChange={onClassBoostChange}
          />
        </div>
      </div>
      <div className={s.statsBlockContainer}>
        <div className={s.container}>
          <StatsBlock
            race={race}
            setRace={setRace}
            gender={gender}
            setGender={setGender}
            magBonusInput={magBonusInput}
            magBonus={magBonus}
            onMagBonusChange={onMagBonusChange}
            finalStats={finalStats}
          />
        </div>
      </div>
      <div className={s.center}>
        <SkillTree
          lang={lang}
          main={main}
          mainLvl={mainLvl}
          sub={sub}
          subLvl={subLvl}
          mainMaxPoints={mainMaxPoints}
          subMaxPoints={subMaxPoints}
          mainUsedPoints={mainUsedPoints}
          subUsedPoints={subUsedPoints}
          treeState={treeState}
          onChange={onTreeStateChange}
        />
        <div className={s.inputsWrapper}>
          <div className={s.inputContainer}>
            <label htmlFor="title">Title</label>
            <p>This field is required.</p>
            <textarea
              id="title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => checkTitle(e.target.value)}
            />
          </div>
          <div className={s.inputContainer}>
            <label htmlFor="description">Description</label>
            <p>Let users know the main points of your guide.</p>
            <textarea
              id="description"
              type="text"
              maxLength={300}
              value={description}
              onChange={(e) => checkDescription(e.target.value)}
            />
          </div>
        </div>
        <div className={s.guideContainer}>
          <h3>Guide</h3>
          <p>
            Write a guide. use the markdown toolbar to style it. Embedding
            images/videos is also possible.
          </p>
          <MarkdownEditor markdown={markdown} onChange={setMarkdown} />
        </div>
        <div className={s.inputsWrapper}>
          <div
            className={`${s.saveButton} ${
              saveEnabled ? s.saveEnabled : s.saveDisabled
            }`}
            onClick={saveGuide}
          >
            <p>Save</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compose;
