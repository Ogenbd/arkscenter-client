import React, { useMemo, useContext } from "react";
import s from "./StatsBlock.module.scss";

import { statNames, raceNames } from "../lang";
import LanguageContext from "../providers/LanguageContext";

import TitleFrame from "./frames/TitleFrame";
import BoxFrame from "./frames/BoxFrame";
import SliderSelect from "./SliderSelect";
import IntegerInput from "./IntegerInput";

const StatsBlock = ({
  race,
  setRace,
  gender,
  setGender,
  magBonusInput,
  magBonus,
  onMagBonusChange,
  finalStats,
  readOnly,
}) => {
  const { lang } = useContext(LanguageContext);
  const allotedPoints = magBonus.reduce((total, value) => total + value);
  const remainingPoints = 200 - allotedPoints;

  const getRaceOptions = () =>
    raceNames.map((option, index) => {
      return {
        label: option[lang],
        onChange: () => {
          setRace(index);
        },
      };
    });

  const raceOptions = useMemo(getRaceOptions, [lang]);

  const genderOptions = [
    { label: "♂", onChange: () => setGender(0) },
    { label: "♀", onChange: () => setGender(1) },
  ];

  return (
    <div className={s.statsBlockContainer}>
      <TitleFrame>
        <h1>Stats</h1>
      </TitleFrame>
      <BoxFrame>
        <div className={s.statsBlock}>
          <div className={s.stats}>
            <div className={s.section}>
              {statNames.map((stat, index) => (
                <div key={index} className={`${s.stat} ${s.magBorder}`}>
                  <p>{stat[lang]}</p>
                </div>
              ))}
            </div>
            <div className={s.section}>
              {finalStats.map((stat, index) => (
                <div key={index} className={s.stat}>
                  <p>{finalStats[index]}</p>
                </div>
              ))}
            </div>
            <div className={s.section}>
              <div className={`${s.magHeader} ${s.magBorder}`}>
                <p>Mag Bonus</p>
                <p>{allotedPoints}/200</p>
              </div>
              {statNames
                .map((stat, index) => (
                  <div className={`${s.stat} ${s.magBorder}`} key={index}>
                    {readOnly ? (
                      <p>{magBonus[index]}</p>
                    ) : (
                      <IntegerInput
                        value={magBonusInput[index]}
                        minValue={0}
                        maxValue={remainingPoints + magBonus[index]}
                        index={index}
                        onChange={onMagBonusChange}
                      />
                    )}
                  </div>
                ))
                .slice(2, 9)}
            </div>
          </div>
          <div className={s.raceOptions}>
            <SliderSelect options={raceOptions} selected={race} />
            <SliderSelect
              options={genderOptions}
              selected={gender}
              labelCustomClass={s.gender}
            />
          </div>
        </div>
      </BoxFrame>
    </div>
  );
};

export default StatsBlock;
