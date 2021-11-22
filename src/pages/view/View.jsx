import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import s from "./View.module.scss";

import { baseUrl } from "../../environment";
import { unzipStr, deobjectifyMag } from "../../utils";

import ReadyView from "./ReadyView";

const View = () => {
  const guideId = useRouteMatch().params.id;
  const [guideData, setGuideData] = useState(null);

  const fetchGuide = () => {
    console.log("fetched");
    fetch(`${baseUrl}/getguide?id=${guideId}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            let resGuideData = data;
            resGuideData.mag = deobjectifyMag(data.mag);
            resGuideData.markdown = unzipStr(data.markdown);
            setGuideData(resGuideData);
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

  useEffect(fetchGuide, [guideId]);

  console.log(guideData);

  return (
    <div className={s.guideView}>
      {guideData ? <ReadyView guideData={guideData} /> : <div>Loading</div>}
    </div>
  );
};

export default View;
