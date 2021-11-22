import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import moment from "moment/min/moment-with-locales";
import Moment from "react-moment";
import "moment-timezone";

import { debounce } from "./utils";
import WindowContext from "./providers/WindowContext";
import UserContext from "./providers/UserContext";
import VersionContext from "./providers/UserContext";
import LanguageContext from "./providers/LanguageContext";
import { baseUrl, fetchMode, fetchCredentials } from "./environment";

import Header from "./components/header/Header";
import Home from "./pages/home/Home";
import Compose from "./pages/compose/Compose";
import View from "./pages/view/View";
import Guides from "./pages/guides/Guides";

import "./App.scss";

Moment.globalMoment = moment;
Moment.globalLocal = true;

const App = () => {
  const [user, setUser] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoverCapable, setHoverCapable] = useState(
    window.matchMedia("(hover: hover)").matches
  );
  const [lang, setLang] = useState(
    window.localStorage.getItem("lang")
      ? window.localStorage.getItem("lang")
      : 0
  );

  useEffect(() => {
    const getUser = async () => {
      let response = await fetch(`${baseUrl}/session`, {
        method: "get",
        credentials: fetchCredentials,
        mode: fetchMode,
      });
      if (response.status === 200) {
        const token = await response.json();
        const decoded = jwt_decode(token).user;
        setUser({ token: token, data: decoded });
      }
    };
    getUser();
  }, []);

  const logout = () => {
    setUser(null);
    fetch(`${baseUrl}/logout`, {
      method: "post",
      credentials: fetchCredentials,
      mode: fetchMode,
    });
  };

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    const hoverListener = () =>
      setHoverCapable(window.matchMedia("(hover: hover)").matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", hoverListener);
    } else {
      mql.addListener(hoverListener);
    }
    const debouncedSetWidth = debounce(
      () => setWindowWidth(window.innerWidth),
      500
    );
    window.addEventListener("resize", debouncedSetWidth);
    return () => {
      window.removeEventListener("resize", debouncedSetWidth);
      if (mql.removeEventListener) {
        mql.removeEventListener("change", hoverListener);
      } else {
        mql.removeListener(hoverListener);
      }
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <VersionContext.Provider>
          <WindowContext.Provider value={{ windowWidth, hoverCapable }}>
            <UserContext.Provider value={{ user, logout }}>
              <LanguageContext.Provider value={{ lang, setLang }}>
                <Header />
                <div className="main">
                  <div className="content">
                    <Switch>
                      <Route path="/home/" component={Home} />
                      <Route path="/calc/" component={Compose} />
                      <Route path="/guide/:id(\d+)/" component={View} />
                      <Route path="/guides/" component={Guides} />
                    </Switch>
                    {/* <TitleFrame title={"Skill Tree"} /> */}
                  </div>
                </div>
                {/* place footer here */}
              </LanguageContext.Provider>
            </UserContext.Provider>
          </WindowContext.Provider>
        </VersionContext.Provider>
      </Router>
    </div>
  );
};

export default App;
