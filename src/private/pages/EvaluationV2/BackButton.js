import React from "react";
import style from "./BackButton.module.css";

export default function BackButton({ connection, onClick }) {
  return (
    <button className={style.container} onClick={onClick}>
      <div className={style.icon}>
        <i className="fa fa-chevron-left" />
      </div>

      <div className={style.label}>{connection?.creative?.name}</div>
    </button>
  );
}
