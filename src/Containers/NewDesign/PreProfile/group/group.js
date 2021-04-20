/* eslint-disable */
import React from "react";
import {Button} from '../../../../Components/UI_Kits';
import styles from './group.module.css';

export default function Group({title, admin}) {
  return (
      <div className={styles.group}>
          <div className={styles.group_top}>
            <div className={styles.button_container}>
                <Button
                type="plus"
                size="small"
                />
            </div>
            <div className={styles.info_container}>
                <h2>{title}</h2>
                <p>Admin: <span>{admin}</span></p>
            </div>
          </div>
          <div className={styles.group_bottom}>
            <p style={{}}>Most online platforms are focused on startups, while tools for investors are often complicated, expensive and lack sharing capabilites. Entering the market as a new investor is difficult without open access to a network.</p>
          </div>
      </div>
  )
}
