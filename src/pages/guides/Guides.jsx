import React, { useState, useContext, useMemo } from "react";
import Moment from "react-moment";
import s from "./Guides.module.scss";

import data from "../../data/data";
import LanguageContext from "../../providers/LanguageContext";
import { baseUrl } from "../../environment";
import {
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

import TitleFrame from "../../components/frames/TitleFrame";
import BoxFrame from "../../components/frames/BoxFrame";
import IntegerInput from "../../components/IntegerInput";
import Select from "../../components/Select";

const generic = { id: -1, display: "Any" };

const Guides = () => {
  const { lang } = useContext(LanguageContext);
  const [guides, setGuides] = useState(null);
  const [main, setMain] = useState(-1);
  const [sub, setSub] = useState(-1);
  const [maxLvlInput, setMaxLvlInput] = useState(95);
  const [versionFilter, setVersionFilter] = useState(false);

  const maxLevel = versionFilter ? 75 : 95;
  const versionFilterForServer = versionFilter ? 1 : 0;

  const mainOptions = useMemo(() => {
    let options = [
      {
        id: -1,
        display: "Any",
        imgClass: "",
      },
    ];
    data.forEach((item, index) => {
      if (versionFilter) {
        if (index < 9) {
          options.push({
            id: index,
            display: item.name[lang],
            imgClass: `${item.img}`,
          });
        }
      } else {
        options.push({
          id: index,
          display: item.name[lang],
          imgClass: `${item.img}`,
        });
      }
    });
    return options;
  }, [lang, versionFilter]);

  const subOptions = useMemo(() => {
    let options = [
      {
        id: -1,
        display: "Any",
        imgClass: "",
      },
    ];
    data.forEach((item, classIndex) => {
      if (classIndex !== main && !isMainOnly(classIndex)) {
        if (versionFilter) {
          if (classIndex < 9) {
            options.push({
              id: classIndex,
              display: item.name[lang],
              imgClass: `${item.img}`,
            });
          }
        } else {
          options.push({
            id: classIndex,
            display: item.name[lang],
            imgClass: `${item.img}`,
          });
        }
      }
    });
    return options;
  }, [main, lang, versionFilter]);

  const onMainChange = (classIndex) => {
    if (classIndex !== -1) {
      if (classIndex === sub) setSub(main);
      if (!hasSub(classIndex)) setSub(-1);
    }
    setMain(classIndex);
  };

  const onSubChange = (classIndex) => {
    console.log(classIndex);
    setSub(classIndex);
  };

  const onMaxLvlChange = (newValue) => {
    setMaxLvlInput(newValue);
  };

  const toggleFilter = () => {
    if (!versionFilter) {
      if (maxLvlInput > 75) setMaxLvlInput(75);
      if (main > 8) setMain(-1);
      if (sub > 8) setSub(-1);
    }
    if (versionFilter && maxLvlInput === 75) setMaxLvlInput(95);
    setVersionFilter(!versionFilter);
  };

  const fetchGuides = () => {
    fetch(
      `${baseUrl}/getguides?main=${main}&sub=${sub}&lvl=${maxLvlInput}&na=${versionFilterForServer}`,
      {
        method: "get",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setGuides(data);
            // let resGuideData = data;
            // resmag = deobjectifyMag(data.mag);
            // resmarkdown = unzipStr(data.markdown);
            // console.log(resGuideData);
            // setClassBoosts(resclassBoosts);
            // setRace(resrace);
            // setGender(resgender);
            // setGuideData(resGuideData);
          });
        } else if (res.status === 204) {
          console.log("does not exist");
        } else {
          console.log("wha...?");
        }
      })
      .catch((err) => {
        console.log("no server communication");
      });
  };

  return (
    <div className={s.guides}>
      <div>
        {/* <div className={s.search}> */}
        <TitleFrame>
          <h1>Search</h1>
        </TitleFrame>
        <BoxFrame>
          <div className={s.searchBox}>
            <div className={s.options}>
              <div>
                <div className={s.subTitle}>
                  <div className={`game-icon ${s.main}`} />
                  <h1>Main Class</h1>
                </div>
                <Select
                  selected={main}
                  options={mainOptions}
                  onChange={onMainChange}
                  generic={generic}
                />
              </div>
              <div>
                <div className={s.subTitle}>
                  <div className={`game-icon ${s.sub}`} />
                  <h1>Sub Class</h1>
                </div>
                <Select
                  selected={sub}
                  options={subOptions}
                  onChange={onSubChange}
                  generic={generic}
                  disabled={main === 9}
                />
              </div>
              <div className={s.maxLevel}>
                <IntegerInput
                  label="Max level"
                  value={maxLvlInput}
                  minValue={1}
                  maxValue={maxLevel}
                  onChange={onMaxLvlChange}
                />
              </div>
              <div className={s.filterContainer}>
                <div className={s.subTitle}>
                  <h1>NA Filter</h1>
                </div>
                <div className={s.filterInput} onClick={toggleFilter}>
                  <div
                    className={`${s.check} ${
                      versionFilter ? s.checked : s.unchecked
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className={s.saveButton} onClick={fetchGuides}>
              <p>Search</p>
            </div>
          </div>
        </BoxFrame>
      </div>
      {guides &&
        guides.map(
          ({
            description,
            id,
            likeSum,
            main,
            mainLvl,
            mainVersion,
            sub,
            subLvl,
            subVersion,
            title,
            updatedAt,
            userId,
            username,
          }) => (
            <div key={id} className={s.result}>
              <div className={s.title}>{title}</div>
              <div>
                <div>
                  {main >= 0 && data[main].name[lang]}
                  {sub >= 0 && data[sub].name[lang]}
                </div>
              </div>
              <div>
                <Moment date={updatedAt} format={"LL"} />
              </div>
              {/* {updatedAt} */}
            </div>
          )
        )}
    </div>
  );
};

export default Guides;
