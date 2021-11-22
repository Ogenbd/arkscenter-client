import React from "react";
import s from "./Modal.module.scss";

const Modal = ({ isOpen, closeModal, children }) => {
  return (
    <div
      onClick={closeModal}
      className={`${s.modalBackground} ${isOpen ? s.active : s.inactive}`}
    >
      {children}
    </div>
  );
};

export default Modal;
