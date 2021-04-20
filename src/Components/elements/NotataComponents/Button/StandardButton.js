import React from "react";

// Styles
import styles from "./Button.module.css";
import classnames from "classnames";

// *****************
// * MAIL FUNCTION *
// *****************
export default function StandardButton({
  type,
  buttonStyle,
  size,
  loading,
  onClick,
  iconClass,
  style,
  ...children
}) {
  // Default fallback with empty function
  // if no click function is defined
  onClick = onClick || (() => {});

  let withIconPadding = loading || type === "right_arrow" || iconClass;

  const sizeClass =
    (size && size === "large" && styles.large_button) ||
    (size && size === "medium" && styles.medium_button) ||
    (size && size === "small" && styles.small_button) ||
    (!size && styles.large_button);

  return (
    <button
      className={classnames(
        sizeClass,
        styles.button_container,
        withIconPadding && styles.icon_padding,
        buttonStyle && buttonStyle === "secondary" && styles.secondary_style,
        buttonStyle && buttonStyle === "danger" && styles.danger_style,
        size &&
          size === "large" &&
          type === "left_arrow" &&
          styles.large_left_button
      )}
      style={style || {}}
      onClick={onClick}
    >
      <div {...children} />

      {type === "right_arrow" && !loading && (
        <span className={styles.chevron_icon}>
          <i className="fal fa-chevron-right" />
        </span>
      )}

      {type === "left_arrow" && !loading && (
        <span className={styles.chevron_icon_left}>
          <i className="fal fa-chevron-left" />
        </span>
      )}

      {iconClass && !loading && (
        <span className={styles.loading_icon}>
          <i className={iconClass} />
        </span>
      )}

      {loading && (
        <span className={styles.loading_icon}>
          <i className="fa fa-spinner fa-spin" />
        </span>
      )}
    </button>
  );
}
