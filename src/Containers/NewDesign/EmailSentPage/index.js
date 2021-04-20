import React from "react";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";

export function Instructor({ email }) {
  return (
    <div className={styles.auth_structure}>
      <div className={styles.auth_structure_left}>
        <div className={styles.mainContent}>
          <div className={styles.logoContainer}>
            <img
              style={{ width: "40px", height: "40px" }}
              src={notata}
              alt="logo"
              className={styles.logo}
            />
            <h1>Email sent</h1>
            <p
              style={{
                margin: "25px 0",
                lineHeight: "18.05px",
                fontSize: "15px",
                color: "#969BA3",
              }}
            >
              please check your email ({email}) and follow the instructions to
              vertify it. if you did not receive an email or if it expired , you
              can resend one.
            </p>
            <p
              style={{
                margin: "25px 0",
                lineHeight: "18.05px",
                fontSize: "15px",
                color: "#969BA3",
              }}
            >
              Make sure to check your junk or spam folder.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.auth_structure_right}>
        <img src={man_standing} alt="man_standing" />
      </div>
    </div>
  );
}
