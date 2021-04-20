import React from "react";

// Styles
import styles from "./ContentCard.module.css";
import classnames from "classnames";

// Main function
export default function ContentCard({
  maxWidth,
  style,
  className,
  ...children
}) {
  return (
    <div
      className={classnames(styles.container, className && className)}
      style={{
        ...style,
        maxWidth: maxWidth ? maxWidth : "auto",
      }}
      {...children}
    />
  );
}
