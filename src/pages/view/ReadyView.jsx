import React, { useState, useEffect, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import s from "./View.module.scss";

import { baseUrl } from "../../environment";
import {
  unzipStr,
  deobjectifyMag,
  calcBaseStats,
  calcFinalStats,
  calcPointsUsed,
} from "../../utils";

import ClassBoosts from "../../components/ClassBoosts";
import SkillTree from "../../components/SkillTree";

const ReadyView = ({
  guideData,
  guideData: {
    main,
    sub,
    mainLvl,
    subLvl,
    mainCOSP,
    subCOSP,
    mag,
    classBoosts,
    race,
    gender,
    skills,
    version,
    title,
    description,
    markdown,
  },
}) => {
  // console.log(guideData);
  const [lang, setLang] = useState(
    window.localStorage.getItem("lang")
      ? window.localStorage.getItem("lang")
      : 0
  );
  //   const route = useRouteMatch();
  // const guideId = useRouteMatch().params.id;
  // const [guideData, setGuideData] = useState(null);
  const [localClassBoosts, setLocalClassBoosts] = useState(classBoosts);
  const [localRace, setLocalRace] = useState(race);
  const [localGender, setLocalGender] = useState(gender);
  // const [classBoosts, setClassBoosts] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  // const [race, setRace] = useState(0);
  // const [gender, setGender] = useState(0);

  // const fetchGuide = () => {
  //   console.log("fetched");
  //   fetch(`${baseUrl}/getguide?id=${guideId}`, {
  //     method: "get",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         res.json().then((data) => {
  //           let resGuideData = data;
  //           resmag = deobjectifyMag(data.mag);
  //           resmarkdown = unzipStr(data.markdown);
  //           console.log(resGuideData);
  //           setClassBoosts(resclassBoosts);
  //           setRace(resrace);
  //           setGender(resgender);
  //           setGuideData(resGuideData);
  //         });
  //       } else if (res.status === 204) {
  //         console.log("does not exist");
  //       } else {
  //         console.log("wha...?");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("no server communication");
  //     });
  // };

  // useEffect(fetchGuide, [guideId]);

  const mainMaxPoints = mainLvl + mainCOSP;
  const subMaxPoints = subLvl + subCOSP;

  const mainUsedPoints = calcPointsUsed(main, skills);
  const subUsedPoints = calcPointsUsed(sub, skills);

  const baseStats = useMemo(() => {
    // if (!guideData) return null;
    return calcBaseStats(main, sub, mainLvl, subLvl, gender, race);
  }, [guideData, gender, race]);

  const finalStats = useMemo(() => {
    // if (!guideData) return null;
    return calcFinalStats(main, sub, baseStats, classBoosts, mag, skills);
  }, [guideData, baseStats, classBoosts]);

  const onClassBoostChange = (newBoosts) => {
    setLocalClassBoosts(newBoosts);
  };

  return (
    <div className={s.guideView}>
      <div>
        <div className={s.container}>
          <ClassBoosts
            lang={lang}
            classBoosts={classBoosts}
            onChange={onClassBoostChange}
          />
        </div>
      </div>
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
        treeState={skills}
        readOnly
      />
    </div>
  );
};

export default ReadyView;
