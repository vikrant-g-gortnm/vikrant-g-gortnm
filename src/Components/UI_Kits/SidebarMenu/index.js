import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";

//links
import { dashboard, group, settings, charts, signOut } from "definitions.js";

// Styles
import styles from "./Sidebar.module.css";
import classnames from "classnames";

// * MAIN FUNCTION *

export function SideBarMenu() {
  const [listOpen, setListOpen] = useState(false);
  const sidebarr = useRef(0);
  const floatingButonn = useRef(0);
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

  const openSidebar = () => {
    sidebarr.current.style.left= "0px";
    floatingButonn.current.style.display= "none";
  }
  
  const closeSidebar = () => {
    sidebarr.current.style.left= "-290px";
    floatingButonn.current.style.display= "block";
  }
  return (
    <div className={styles.main_sidebar}>
      <div
        ref={sidebarr}
        className={classnames(
          !listOpen ? styles.sidebar_container: styles.sidebar_container1
        )}
      >
        <div className={styles.logo_container}>
          <div className={styles.logo}>
            <span className={styles.n}>n</span>
          </div>
          <div className={styles.brand}>notata</div>
          <div className={styles.mobile_togglerInSidebar} onClick={closeSidebar}> <i className={`fal fa-chevron-left`} /></div>
        </div>

        {/* Toggle open/close */}
        <div
          role="button"
          onClick={() => {
            setListOpen(!listOpen);
          }}
          className={styles.desktop_sidebarCollapser}
        >
          <span
            className={classnames(
              listOpen ? styles.right_icon : styles.left_icon
            )}
          >
            <i className={`fal fa-chevron-${listOpen ? "left" : "right"}`} />
          </span>
        </div>
        <div>
        <div className={styles.mobile_toggler} ref={floatingButonn} onClick={openSidebar}> <i className={`fal fa-chevron-${listOpen ?  "left" : "right"}`} /></div>
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
          <div className={styles.menu_list} className={styles.profile_item} style={{paddingTop:'30px', borderTop:'1px solid #BFBFBF'}}>
                <NavLink
                  exact={true}
                  to={"/profile"}
                  activeClassName={classnames(
                    !listOpen ? styles.active_open : styles.active_close
                  )}
                  style={{display:'flex'}}
                >
                  <div className={styles.icons} style={{marginTop:'5px'}}>
                    <img src="https://www.clipartmax.com/png/small/171-1717870_stockvader-predicted-cron-for-may-user-profile-icon-png.png" alt="img"/>
                  </div>
                  <p className={styles.list}>Profile Name</p>
                </NavLink>
              </div>
            

        </div>
      </div>
    </div>
  );
}
