import React, { useState } from "react";
import styles from "./RadioButton.module.css";

function RadioButton({ id, value, label, isSelected, handleChange, name }) {
  return (
    <label className={styles.container}>
      <p>{label}</p>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={handleChange}
      />
      <span className={styles.checkmark} />
    </label>
  );
}

export function RadioButtons({ name, data }) {
  const [checked, setChecked] = useState(data.length ? data[0].value : "");

  function handleChange({ target }) {
    const { value } = target;
    setChecked(value);
  }

  return (
    <>
      {data.map((d, i) => (
        <RadioButton
          key={`${d.id}`}
          id={`${d.id}`}
          label={d.label}
          value={d.value}
          name={name}
          isSelected={checked === d.value}
          handleChange={handleChange}
        />
      ))}
    </>
  );
}
