import React, { useState, useRef, useMemo } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import s from "./Select.module.scss";

const Select = ({ selected, options, onChange, disabled, placeholder }) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef();

  const selectedIndex = useMemo(() => {
    return options.findIndex((option) => option.id === selected);
  }, [selected, options]);

  useOnclickOutside(ref, () => {
    setOpen(false);
  });

  const toggle = () => {
    if (disabled) return;
    setOpen(!isOpen);
  };

  const handleClick = (item) => {
    if (item.id !== selected) onChange(item.id);
    setOpen(false);
  };

  // const optionsDisplay = options.filter((option) => {
  //   if (option) {
  //     return true;
  //   }
  //   return false;
  // });
  // const selectedOption = options.find((option) => selected === -1 ? { display: "" } : option.id === selected);

  return (
    <div ref={ref} className={s.selectContainer}>
      <div
        tabIndex={0}
        className={`${s.selectBox} ${disabled ? s.disabled : s.enabled}`}
        onKeyPress={() => toggle(!isOpen)}
        onClick={() => toggle(!isOpen)}
      >
        {disabled ? (
          ""
        ) : placeholder && selectedIndex === -1 ? (
          <p>{placeholder}</p>
        ) : (
          <>
            <div className={`${s.icon} ${options[selectedIndex].imgClass}`} />
            <p>{options[selectedIndex].display}</p>
          </>
        )}
      </div>
      {isOpen && (
        <div className={s.options}>
          {options.map((option) => (
            <div
              key={option.id}
              className={s.option}
              onClick={() => handleClick(option)}
            >
              <div className={`${s.icon} ${option.imgClass}`} />
              <p>{option.display}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
