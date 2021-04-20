import React, { useState } from "react";
import styles from "./CheckBox.module.css";

function CheckBox({ id, value, label }) {
  return (
    <label className={styles.container}>
      <p>{label}</p>
      <input
        id={id}
        type="checkbox"
        value={value}
        /* checked={isSelected}
        onChange={handleChange} */
      />
      <span className={styles.checkmark} />
    </label>
  );
}

export function CheckBoxes({ data }) {
  return (
    <>
      {data.map((d, i) => (
        <CheckBox
          key={`${d.id}`}
          id={`${d.id}`}
          label={d.label}
          value={d.value}
        />
      ))}
    </>
  );
}
