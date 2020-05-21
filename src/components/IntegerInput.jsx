import React from "react";
import s from "./IntegerInput.module.scss";

const IntegerInput = ({
  label,
  value,
  maxValue,
  minValue,
  onChange,
  index,
}) => {
  // const [tempValue, setTempValue] = useState(value);
  // const ref = useRef();

  // useEffect(() => {
  //   if (
  //     ref.current !== document.activeElement &&
  //     ref.current.value !== tempValue
  //   )
  //     setTempValue(value);
  // }, [value, tempValue]);

  const handleInput = (e) => {
    // setTempValue(e.target.value);
    if (e.target.value !== "") {
      let newValue = parseInt(e.target.value, 10);
      if (newValue >= minValue && newValue <= maxValue) applyChange(newValue);
    } else {
      applyChange("");
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleBlur = (e) => {
    let newValue = e.target.value;
    if (newValue === "") {
      newValue = minValue;
    } else {
      let parsedValue = parseInt(newValue);

      if (isNaN(parsedValue)) {
        newValue = value;
      } else if (parsedValue < minValue) {
        newValue = minValue;
      } else if (parsedValue > maxValue) {
        newValue = maxValue;
      } else {
        newValue = parsedValue;
      }
    }
    // setTempValue(newValue);
    applyChange(newValue);
  };

  // const handleDecrease = () => {
  //   if (tempValue > minValue) {
  //     let newValue = tempValue - 1;
  //     setTempValue(newValue);
  //     applyChange(newValue);
  //   }
  // };

  // const handleIncrease = () => {
  //   if (tempValue < maxValue) {
  //     let newValue = tempValue + 1;
  //     setTempValue(newValue);
  //     applyChange(newValue);
  //   }
  // };

  const applyChange = (value) => {
    onChange(value, index);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  return (
    <div
      className={s.integerInputContainer}
      style={
        label
          ? { justifyContent: "space-between" }
          : { justifyContent: "center" }
      }
    >
      {label && <label>{label}</label>}
      <div className={s.integerInput}>
        {/* <div
          className={`${s.step} ${value <= minValue ? s.disabled : s.enabled}`}
          onClick={handleDecrease}
        >
          -
        </div> */}
        <input
          type="number"
          className={s.input}
          onChange={(e) => handleInput(e)}
          onFocus={(e) => handleFocus(e)}
          onBlur={(e) => handleBlur(e)}
          onKeyPress={(e) => handleEnter(e)}
          value={value}
        />
        {/* <div
          className={`${s.step} ${value >= maxValue ? s.disabled : s.enabled}`}
          onClick={handleIncrease}
        >
          +
        </div> */}
      </div>
    </div>
  );
};

export default IntegerInput;
