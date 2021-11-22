import React, { useContext } from "react";
import { Link } from "react-router-dom";
import s from "./Header.module.scss";

import UserContext from "../../providers/UserContext";

import SignIn from "./SignIn";
import LanguageSelect from "../LanguageSelect";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className={s.header}>
      <div className={s.container}>
        <div className={s.nav}>
          <h1 className={`${s.item} ${s.main}`}>
            <Link to="/">
              <p>ARKS CENTER</p>
            </Link>
          </h1>
          <h2 className={`${s.skillsim} ${s.item} ${s.sub}`}>
            <Link to="/calc">
              <p>Skill Sim</p>
            </Link>
          </h2>
          <h2 className={`${s.guides} ${s.item} ${s.sub}`}>
            <Link to="/guides">
              <p>community guides</p>
            </Link>
          </h2>
        </div>
        {user ? (
          <div className={s.userContainer}>
            <Link to={"/profile"}>PROFILE</Link>
            <p className={s.divider}>|</p>
            <p className={s.logout} onClick={logout}>
              LOGOUT
            </p>
          </div>
        ) : (
          <SignIn />
        )}
        <LanguageSelect />
      </div>
    </div>
  );
};

export default Header;
