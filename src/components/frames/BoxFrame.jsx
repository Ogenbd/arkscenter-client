import React from 'react';
import s from './BoxFrame.module.scss';

const BoxFrame = (props) => {
    return (
        <div className={s.box}>
            <div className={`${s.frame} ${s.side} ${s.right}`}></div>
            <div className={`${s.frame} ${s.side} ${s.left}`}></div>
            <div className={`${s.frame} ${s.bottom}`}></div>
            {props.children}
        </div >
    );
}

export default BoxFrame;