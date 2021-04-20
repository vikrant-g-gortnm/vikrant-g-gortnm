import React from "react";

// Styles
import styles from "./Button.module.css";

// *****************
// * MAIL FUNCTION *
// *****************
export default function TinyRightButton({ onClick }) {
  // Default fallback with empty function
  // if no click function is defined
  onClick = onClick || (() => {});

  return (
    <button className={styles.tiny_right_button_container} onClick={onClick}>
      <i className="fal fa-chevron-right" />
    </button>
  );
}
