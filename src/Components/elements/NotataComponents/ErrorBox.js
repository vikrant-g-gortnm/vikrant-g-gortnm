import React from "react";
import classnames from "classnames";

import { container, content, title_style } from "./ErrorBox.module.css";

export const ErrorBox = ({ className, title, ...children }) => {
  return (
    <div className={classnames(container, className && className)}>
      {title && <div className={title_style}>{title}</div>}
      <div className={content} {...children} />
    </div>
  );
};
