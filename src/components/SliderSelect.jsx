import React from "react";
import s from "./SliderSelect.module.scss";

const SliderSelect = ({ options, selected, labelCustomClass }) => {
  return (
    <div className={s.sliderSelect}>
      <div
        className={s.stripe}
        style={{ transform: `translateY(${selected * 100}%)` }}
      />
      {options.map((option, index) => (
        <div key={index} className={s.sliderOption} onClick={option.onChange}>
          <p className={labelCustomClass}>{option.label}</p>
        </div>
      ))}
    </div>
  );
};

export default SliderSelect;
