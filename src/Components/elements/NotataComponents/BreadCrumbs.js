import React from "react";
import { Link } from "react-router-dom";

import {
  breadcrumb_container,
  breadcrumb_link,
} from "./BreadCrumbs.module.css";

export function BreadCrumbs({ list }) {
  return (
    <div className={breadcrumb_container}>
      {list.map((listItem, i) => (
        <div className={breadcrumb_link} key={`crumb-${i}`}>
          <i className="fas fa-caret-right" />
          <Link to={{ pathname: listItem.link, state: listItem?.state }}>
            {listItem.val}
          </Link>
        </div>
      ))}
    </div>
  );
}
