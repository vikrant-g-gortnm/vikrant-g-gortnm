import React, { useState } from "react";
import { Link } from "react-router-dom";

import { frontpage } from "definitions.js";
import { History } from "history";

// STYLE
import styles from "./TopMenu.module.css";

const classnames = require("classnames");

export function TopMenu() {
  const [listOpen, setListOpen] = useState(false);
  return (
    <div className={styles.container}>
      <span>
        <i className="fas fa-question-circle"></i>
      </span>
      <span>
        <i className="fas fa-alarm-clock"></i>
      </span>
      <span>
        <i className="fas fa-bell"></i>
        <div className={styles.circle}></div>
      </span>
      <div className={styles.profile}>
        <div className={styles.profile_pic}>
          <Link to="">n</Link>
        </div>
        <p className={styles.profile_name}>Profile Name</p>
        <div
          role="button"
          onClick={() => {
            setListOpen(!listOpen);
          }}
        >
          <span className={styles.angle_icon}>
            <i className={`fal fa-angle-${listOpen ? "up" : "down"}`} />
          </span>
        </div>
      </div>

      {/* <div className={classnames(styles.header_block_logo, "desktop_only")}>
        <div className={styles.logo} onClick={() => history.push(frontpage)}>
          NOTATA
        </div>
      </div> */}
    </div>
  );
}
