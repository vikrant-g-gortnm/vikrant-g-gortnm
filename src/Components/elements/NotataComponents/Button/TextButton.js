import React from "react";

// Styles
import styles from "./Button.module.css";

// *****************
// * MAIL FUNCTION *
// *****************
export default function TextButton({ onClick, ...children }) {
  // Default fallback with empty function
  // if no click function is defined
  onClick = onClick || (() => {});

  return (
    <button className={styles.text_button} onClick={onClick}>
      <div {...children} />
    </button>
  );
}
