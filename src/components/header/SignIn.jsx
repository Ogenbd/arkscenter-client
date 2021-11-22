import React, { useState, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import s from "./SignIn.module.scss";
import google from "../../assets/images/general/google.png";

import { baseUrl } from "../../environment";

import Modal from "../Modal";

const options = {
  reserveScrollBarGap: true,
};

const brands = [
  <a key={0} href={`${baseUrl}/auth/google`}>
    <img className={s.google} src={google} alt="google" />
  </a>,
];

const SignIn = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const ref = useRef(null);

  const openModal = () => {
    disableBodyScroll(ref.current, options);
    setIsSignInModalOpen(true);
  };

  const closeModal = () => {
    enableBodyScroll(ref.current);
    setIsSignInModalOpen(false);
  };

  return (
    <>
      <div onClick={openModal} className={s.signInButton}>
        <p>SIGN IN</p>
      </div>
      <Modal isOpen={isSignInModalOpen} closeModal={closeModal}>
        <div
          ref={ref}
          className={s.container}
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Sign in</h1>
          <div>{brands.map((brand) => brand)}</div>
        </div>
      </Modal>
    </>
  );
};

export default SignIn;
