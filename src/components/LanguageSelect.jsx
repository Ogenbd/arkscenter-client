import React, { useContext, useMemo } from "react";
import s from "./LanguageSelect.module.scss";

import { languages } from "../lang";
import LanguageContext from "../providers/LanguageContext";

import SliderSelect from "./SliderSelect";

const LanguageSelect = () => {
  const { lang, setLang } = useContext(LanguageContext);

  const getLangOptions = () =>
    languages.map((option, index) => {
      return {
        label: option,
        onChange: () => {
          window.localStorage.setItem("lang", index);
          setLang(index);
        },
      };
    });

  const langOptions = useMemo(getLangOptions, []);

  return (
    <div className={s.langOptions}>
      <SliderSelect options={langOptions} selected={lang} />
    </div>
  );
};

export default LanguageSelect;
