import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { login } from "definitions.js";
import { Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";

export default function PasswordMsg({ email }) {
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
            <h1>Password Rest</h1>
            <p
              style={{
                margin: "25px 0",
                lineHeight: "18.05px",
                fontSize: "15px",
                color: "#969BA3",
              }}
            >
              Your password has been reset
            </p>
            <p
              style={{
                margin: "25px 0",
                lineHeight: "18.05px",
                fontSize: "15px",
                color: "#969BA3",
              }}
            >
              Please, click next to log in.
            </p>
          </div>
          <Button
            size="large"
            buttonStyle="green"
            style={{ marginTop: "15px" }}
          >
            {" "}
            NEXT
          </Button>
        </div>
      </div>
      <div className={styles.auth_structure_right}>
        <img src={man_standing} alt="man_standing" />
      </div>
    </div>
  );
}
