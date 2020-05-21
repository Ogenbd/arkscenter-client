import React, { useState, useMemo } from "react";
import s from "./Tooltip.module.scss";

// USAGE NOTES:
// 1. parent HAS to be set as position: relative
// 2. z-index may need to be changed for parent on hover depending on parents siblings
const Tooltip = ({ lang, children, skill, level, style }) => {
  const [position, setPosition] = useState({});
  const [hovered, setHovered] = useState(false);

  const activate = (e) => {
    const position = { bottom: 0 };
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const top = boundingRect.top;
    const bottom = window.innerHeight - boundingRect.bottom;
    const left = boundingRect.left;
    const right = window.innerWidth - boundingRect.right;
    left > right
      ? (position.right = 10)
      : (position.left = boundingRect.width + 10);
    top > bottom
      ? (position.bottom = 0)
      : (position.top = -boundingRect.height);
    setPosition(position);
    setHovered(true);
  };

  const skillTable = useMemo(
    () =>
      skill.effects ? (
        <div className={s.skillTable}>
          <div className={s.headers}>
            <p>{["Level", "Level", "レベル"][lang]}</p>
            {skill.effects.map((effect, index) => (
              <p key={index}>{effect.header[lang]}</p>
            ))}
          </div>
          <div className={s.tableContent}>
            <div className={s.row}>
              {skill.effects[0].stats.map((amnt, index) => (
                <p key={index} className={index + 1 === level ? s.active : ""}>
                  {index + 1}
                </p>
              ))}
            </div>
            {skill.effects.map((type, i) => (
              <div key={i} className={s.row}>
                {type.stats.map((increase, index) => (
                  <p
                    key={index}
                    className={index + 1 === level ? s.active : ""}
                  >
                    {increase}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null,
    [lang, skill, level]
  );
  return (
    <div
      onMouseEnter={(e) => activate(e)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {children}
      <div className={s.anchor} style={{ opacity: hovered ? 1 : 0 }}>
        <div className={s.defaultContainer} style={position}>
          <div className={s.title}>{skill.name[lang]}</div>
          <div className={s.content}>
            <div className={s.skillDesc}>
              {skill.desc[lang][0] && <p>{skill.desc[lang][0]}</p>}
              {skill.desc[lang][1] && (
                <p style={{ color: "red" }}>{skill.desc[lang][1]}</p>
              )}
            </div>
            {skill.effects && skillTable}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
