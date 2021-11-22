import React from "react";
import s from "./TitleFrame.module.scss";

const TitleFrame = (props) => {
  return (
    <div className={s.title}>
      <div className={`${s.frame} ${s.top}`}></div>
      <div className={`${s.frame} ${s.bottom}`}></div>
      <div className={`${s.frame} ${s.side} ${s.left}`}></div>
      <div className={`${s.frame} ${s.side} ${s.right}`}></div>
      <div className={`${s.frame} ${s.topleft}`}></div>
      <div className={`${s.frame} ${s.topcenter}`}></div>
      <div className={`${s.frame} ${s.topright}`}></div>
      <div className={`${s.frame} ${s.bottomleft}`}></div>
      <div className={`${s.frame} ${s.bottomright}`}></div>
      <div className={s.titleContainer}>{props.children}</div>
    </div>
  );
};

export default TitleFrame;
