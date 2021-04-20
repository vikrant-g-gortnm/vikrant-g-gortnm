// Created By : Siva
// Date : 6/04/2021

import React, { useEffect } from "react";
import { Button } from "../Buttons/Buttons";
import "./style.css";

export function Modal({
  close,
  noKill,
  submit,
  title,
  disableFoot,
  loading,
  showScrollBar,
  submitTxt,
  closeTxt,
  ...children
}) {
  useEffect(() => {
    function downHandler(e) {
      e.key === "Escape" && close(e);
      e.key === "Enter" && !loading && submit && submit(e);
    }
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [close, loading, submit]);

  return (
    <div className={"container"}>
      <div className={"ghost"} />
      <div
        style={{ overflow: showScrollBar ? "hidden" : "auto" }}
        className={"content"}
        onClick={event => {
          if (event.target === event.currentTarget) {
            close(event);
          }
        }}
      >
        <div className={"inner"}>
          {title && (
            <div className={"modal_header"}>
              {title && <div className={"modal_title"}>{title}</div>}

              {!noKill && (
                <div onClick={close} className={"close_modal"}>
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
            className={`${showScrollBar && "scrollbar"} main_content`}
            {...children}
          />

          {(close || submit) && !disableFoot && (
            <div className={"modal_footer"}>
              {close && (
                <Button
                  onClick={close}
                  style={{ display: "inline" }}
                  size="small1"
                  buttonStyle="white"
                >
                  {closeTxt}
                </Button>
              )}
              {submit && (
                <Button
                  onClick={!loading && submit}
                  buttonStyle="primary"
                  size="small1"
                  style={{ display: "inline" }}
                  type="right_arrow"
                  loading={loading}
                >
                  {submitTxt}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
