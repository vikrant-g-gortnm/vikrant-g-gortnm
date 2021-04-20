/* eslint-disable */
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./style.module.css";
import { Button } from "../UI_Kits";

export default function Floatingloginbuttons() {
  const history = useHistory();
  const handlePush = (value) => {
    history.push(`${value}`);
  }
  return (
    <div className={styles.floating_loginButtons}>
      <Button
        buttonStyle="secondary"
        size="small"
        buttonStyle="white"
        onClick={() => handlePush('/login')}
      >
        SIGN IN
      </Button>
      <Button
        buttonStyle="secondary"
        size="small"
        buttonStyle="green"
        onClick={() => handlePush('/signup')}
      >
        SIGN UP
      </Button>
    </div>
  );
}
