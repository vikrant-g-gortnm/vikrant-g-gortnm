import React, { useEffect } from "react";

import styles from "./Modal.module.css";

import { Button } from "../";

interface Props {
  close: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent
  ) => void;
  noKill?: boolean;
  submit?: Function;
  title?: string;
  disableFoot?: boolean;
  loading?: boolean;
  showScrollBar?: boolean;
  children?: any;
}

export const Modal = ({
  close,
  noKill,
  submit,
  title,
  disableFoot,
  loading,
  showScrollBar,
  ...children
}: Props) => {
  useEffect(() => {
    function downHandler(e: KeyboardEvent) {
      e.key === "Escape" && close(e);
      e.key === "Enter" && !loading && submit && submit(e);
    }
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [close, loading, submit]);

  return (
    <div className={styles.container}>
      <div className={styles.ghost} />

      <div
        style={{ overflow: showScrollBar ? "hidden" : "auto" }}
        className={styles.content}
        onClick={event => {
          if (event.target === event.currentTarget) {
            close(event);
          }
        }}
      >
        <div className={styles.inner}>
          {title && (
            <div className={styles.modal_header}>
              {title && <div className={styles.modal_title}>{title}</div>}

              {!noKill && (
                <div onClick={close} className={styles.close_modal}>
                  <i className="fal fa-times" />
                </div>
              )}
            </div>
          )}

          <div
            style={{
              overflowY: showScrollBar ? "scroll" : "hidden",
              maxHeight: showScrollBar ? "60vh" : "auto",
            }}
            className={`${showScrollBar && "scrollbar"} ${styles.main_content}`}
            {...children}
          />

          {(close || submit) && !disableFoot && (
            <div className={styles.modal_footer}>
              {close && (
                <Button onClick={close} size="small" buttonStyle="white">
                  Close
                </Button>
              )}

              {submit && (
                <Button
                  onClick={!loading && submit}
                  size="small"
                  buttonStyle="primary"
                  type="right_arrow"
                  loading={loading}
                >
                  OK
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
