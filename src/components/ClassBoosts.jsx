import React, { useMemo } from "react";
import s from "./ClassBoosts.module.scss";

import data from "../data/data.js";

import TitleFrame from "./frames/TitleFrame";
import BoxFrame from "./frames/BoxFrame";

const ClassBoosts = ({ lang, classBoosts, onChange }) => {
  const displayObj = useMemo(
    () =>
      data
        .map((item, classIndex) => {
          return {
            id: classIndex,
            display: item.name[lang],
            imgClass: `${item.img}`,
          };
        })
        .slice(0, 9),
    [lang]
  );

  const onClassBoostChange = (classIndex) => {
    let newBoosts = classBoosts.map((boost, index) => {
      return classIndex === index ? !boost : boost;
    });
    onChange(newBoosts);
  };

  return (
    <>
      <TitleFrame>
        <h1>Class Boosts</h1>
      </TitleFrame>
      <BoxFrame>
        <div className={s.classBoostOptions}>
          {displayObj.map((item, classIndex) => (
            <div
              key={item.id}
              className={s.classBoost}
              onClick={() => onClassBoostChange(item.id)}
            >
              <div
                className={`${s.check} ${
                  classBoosts[classIndex] ? s.checked : s.unchecked
                }`}
              />
              <div className={`${s.icon} ${item.imgClass}`} />
              <p>{item.display}</p>
            </div>
          ))}
        </div>
      </BoxFrame>
    </>
  );
};
export default ClassBoosts;
