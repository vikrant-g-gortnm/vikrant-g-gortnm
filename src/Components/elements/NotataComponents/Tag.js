import React from "react";
import classnames from "classnames";

import styles from "./Tag.module.css";

export const Tag = ({
  className,
  active,
  isButton,
  kill,
  onClick,
  ...children
}) => {
  return (
    <div
      className={classnames(
        styles.container,
        active && styles.active_tag,
        isButton && styles.button_tag,
        className && className,
        kill && styles.kill_tag
      )}
      onClick={onClick}
    >
      <div className={styles.content} {...children} />

      {kill && (
        <div className={styles.kill_button} onClick={kill}>
          <i className={"fal fa-times"} />
        </div>
      )}
    </div>
  );
};
