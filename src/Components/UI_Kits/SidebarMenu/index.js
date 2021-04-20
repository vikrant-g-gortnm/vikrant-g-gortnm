import React, { useState } from "react";
import { NavLink } from "react-router-dom";

//links
import { dashboard, group, settings, charts, signOut } from "definitions.js";

// Styles
import styles from "./Sidebar.module.css";
import classnames from "classnames";

// * MAIN FUNCTION *

export function SideBarMenu() {
  const [listOpen, setListOpen] = useState(false);

  let menuList = [
    {
      label: "Dashboard",
      iconClass: "fas fa-signal-alt-3",
      iconStyle: {},
      link: dashboard,
    },
    {
      label: "My Startups",
      iconClass: "fas fa-briefcase",
      iconStyle: { paddingTop: "2px" },
      link: dashboard,
    },
    {
      label: "Groups",
      iconClass: "fas fa-users",
      iconStyle: {},
      link: group,
    },
    {
      label: "Reports and analytics",
      iconClass: "fas fa-file-alt",
      iconStyle: { paddingTop: "7px" },
      link: charts,
    },
    {
      label: "News",
      iconClass: "fas fa-globe",
      iconStyle: { marginBottom: "90px", paddingTop: "2px" },
      link: "",
    },
    {
      label: "settings",
      iconClass: "fas fa-cog",
      iconStyle: { paddingTop: "3px" },
      link: settings,
    },
  ];

  return (
    <div className={styles.main_sidebar}>
      <div
        className={classnames(
          !listOpen ? styles.sidebar_container : styles.sidebar_container1
        )}
      >
        <div>
          <div className={styles.logo}>
            <span className={styles.n}>n</span>
          </div>
          <div className={styles.brand}>notata</div>
        </div>

        {/* Toggle open/close */}
        <div
          role="button"
          onClick={() => {
            setListOpen(!listOpen);
          }}
        >
          <span
            className={classnames(
              listOpen ? styles.right_icon : styles.left_icon
            )}
          >
            <i className={`fal fa-chevron-${listOpen ? "right" : "left"}`} />
          </span>
        </div>

        {/* Main navigation icons */}
        <div className={styles.menu_lists}>
          {menuList.map((item, i) => (
            <React.Fragment>
              <div key={i} className={styles.menu_list}>
                {item.label === "settings" && (
                  <div className={styles.lasthr}></div>
                )}

                <NavLink
                  exact={true}
                  to={item.link}
                  activeClassName={classnames(
                    !listOpen ? styles.active_open : styles.active_close
                  )}
                >
                  <div className={styles.icons} style={item.iconStyle}>
                    <i
                      className={item.iconClass}
                      style={{ marginLeft: item.label === "Groups" && "-3px" }}
                    />
                  </div>
                  <p className={styles.list}>{item.label}</p>
                </NavLink>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
