import React from 'react';
import { Link } from "react-router-dom";
import s from './Header.module.scss';

const Header = () => {
    return (
        <div className={s.header}>
            <div className={s.container}>
                <h2 className={`${s.skillsim} ${s.item} ${s.sub}`}><Link to="/calc">Skill Sim</Link></h2>
                <h1 className={`${s.item} ${s.main}`}> <Link to="/">ARKS CENTER</Link></h1>
                <h2 className={`${s.guides} ${s.item} ${s.sub}`}><Link to="/guides">community guides</Link></h2>
            </div>
        </div>
    );
}

export default Header;