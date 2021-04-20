import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Activity.module.css";

import { Log } from "./Log";

const classnames = require("classnames");

const Activity = ({
  user,
  logs,
  submitMutation,
  updateMutation,
  deleteMutation,
}: any) => {
  const [visibleMobile, setVisibleMobile] = useState(false);

  const ref = useRef(null);
  const clickListener = useCallback((e: MouseEvent) => {
    if (!(ref.current! as any).contains(e.target)) setVisibleMobile(false);
  }, []);
  const touchListener = useCallback((e: TouchEvent) => {
    if (!(ref.current! as any).contains(e.target)) setVisibleMobile(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", clickListener);
    document.addEventListener("touchstart", touchListener);
    return () => {
      document.removeEventListener("mousedown", clickListener);
      document.removeEventListener("touchstart", touchListener);
    };
  }, [clickListener, touchListener]);

  return (
    <>
      <div
        ref={ref}
        className={classnames(
          styles.sidebar_container,
          visibleMobile
            ? styles.open_mobile_container
            : styles.closed_mobile_container
        )}
      >
        <Log
          user={user}
          logs={logs}
          submitMutation={submitMutation}
          updateMutation={updateMutation}
          deleteMutation={deleteMutation}
        />
      </div>
      <div
        className={classnames(styles.icons, "mobile_only")}
        onClick={() => setVisibleMobile(!visibleMobile)}
      >
        <i className="far fa-comment" />
      </div>
    </>
  );
};

export default Activity;
