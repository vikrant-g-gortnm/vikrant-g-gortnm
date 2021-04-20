import React, { useState } from "react";

import moment from "moment";

import { Button } from "Components/elements";
import { LogItem as ILogItem } from "private/Apollo/Queries";
import { AutoHeightTextarea } from "Components/elements";

import styles from "./Log.module.css";
const classnames = require("classnames");

export const LogItem = React.forwardRef(
  (
    {
      logItem,
      isAuthor,
      deleteMutation,
      updateMutation,
    }: {
      logItem: ILogItem;
      isAuthor: boolean;
      deleteMutation: Function;
      updateMutation: Function;
    },
    ref
  ) => {
    const [editing, setEditing] = useState({ state: false, message: "" });

    function downHandler(event: React.KeyboardEvent) {
      const { key, shiftKey } = event;

      if (shiftKey && key === "Enter") {
        updateMutation({
          id: logItem.id,
          value: editing.message,
          createdAt: logItem.createdAt,
        });
        setEditing({ state: false, message: "" });
      } else if (key === "Escape") setEditing({ state: false, message: "" });
    }

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        key={`log-${logItem.id}`}
        className={styles.log_feed_item}
      >
        <div className={styles.log_feed_byline}>
          <span className={styles.name}>
            {(isAuthor && "You ") || (
              <span>
                {`${logItem.createdByUser.given_name} ${logItem.createdByUser.family_name} `}
              </span>
            )}
          </span>
          <span className={styles.date}>
            {`– ${moment(logItem.createdAt).format("lll")}`}
          </span>
          {isAuthor && (
            <div className={styles.log_item_buttons}>
              <div
                onClick={() =>
                  setEditing({ state: true, message: logItem.dataPairs[0].val })
                }
                className={styles.message_button}
              >
                <i className="far fa-edit" />
              </div>
              <div
                onClick={() => deleteMutation(logItem.id)}
                className={styles.message_button}
              >
                <i className="fas fa-trash-alt" />
              </div>
            </div>
          )}
        </div>

        {editing.state ? (
          <>
            <AutoHeightTextarea
              className={classnames(
                styles.log_feed_text_editing,
                logItem.logType !== "COMMENT" &&
                  styles.log_feed_type_SUBJECTIVE_SCORE
              )}
              value={editing.message}
              onBlur={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditing({ state: true, message: e.target.value })
              }
              onKeyDown={downHandler}
              autoFocus
            />

            <Button
              size="small"
              buttonStyle="secondary"
              onClick={() => setEditing({ state: false, message: "" })}
            >
              Cancel
            </Button>

            <Button
              size="small"
              onClick={() => {
                updateMutation({
                  id: logItem.id,
                  value: editing.message,
                  createdAt: logItem.createdAt,
                });
                setEditing({ state: false, message: "" });
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <div
            className={classnames(
              styles.log_feed_text,
              logItem.logType !== "COMMENT" &&
                styles.log_feed_type_SUBJECTIVE_SCORE
            )}
          >
            {logItem.dataPairs[0].val}
          </div>
        )}

        {logItem.createdAt !== logItem.updatedAt && (
          <div className={styles.log_item_edited}>(edited)</div>
        )}
      </div>
    );
  }
);
