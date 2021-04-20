import React from "react";

// Styles
import styles from "./Button.module.css";
import classnames from "classnames";

// *****************
// * MAIL FUNCTION *
// *****************
export default function InputButton({ value, size, loading }) {
  const sizeClass =
    (size && size === "large" && styles.large_button) ||
    (size && size === "medium" && styles.medium_button) ||
    (size && size === "small" && styles.small_button) ||
    (!size && styles.medium_button);

  return (
    <div className={styles.input_button_wrapper}>
      <input
        type="submit"
        className={classnames(
          styles.button_container,
          styles.icon_padding,
          sizeClass
        )}
        value={value}
      />

      <div className={classnames(styles.input_button_icon, sizeClass)}>
        {!loading && (
          <span className={styles.chevron_icon}>
            <i className="fal fa-chevron-right" />
          </span>
        )}

        {loading && (
          <span className={styles.loading_icon}>
            <i className="fa fa-spinner fa-spin" />
          </span>
        )}
      </div>
    </div>
  );
}
