import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import { debounce } from "./utils";
import HoverCapable from "./providers/HoverCapable";

import Header from "./components/header/Header";
// import Compose from './pages/compose/Compose';
import Home from "./pages/home/Home";
import Compose from "./pages/compose/Compose";

// import TitleFrame from './components/frames/TitleFrame';
import "./App.scss";

const App = () => {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoverCapable, setHoverCapable] = useState(
    window.matchMedia("(hover: hover)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    const hoverListener = () =>
      setHoverCapable(window.matchMedia("(hover: hover)").matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", hoverListener);
    } else {
      mql.addListener(hoverListener);
    }
    // const debouncedSetWidth = debounce(
    //   () => setWindowWidth(window.innerWidth),
    //   500
    // );
    // window.addEventListener("resize", debouncedSetWidth);
    // return () => {
    //   window.removeEventListener("resize", debouncedSetWidth);
    //   if (mql.removeEventListener) {
    //     mql.removeEventListener("change", hoverListener);
    //   } else {
    //     mql.removeListener(hoverListener);
    //   }
    // };
  }, []);

  return (
    <div className="App">
      <Router>
        <HoverCapable.Provider value={hoverCapable}>
          <Header />
          <div className="main">
            <div className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/calc" component={Compose} />
              </Switch>
              {/* <TitleFrame title={"Skill Tree"} /> */}
            </div>
          </div>
          {/* place footer here */}
        </HoverCapable.Provider>
      </Router>
    </div>
  );
};

export default App;
