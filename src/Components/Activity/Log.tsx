import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { LogItem as ILogItem } from "private/Apollo/Queries";
import { LogItem } from "./LogItem";
import { AutoHeightTextarea } from "Components/elements";

import styles from "./Log.module.css";

function LogInput({ submitMutation }: { submitMutation: Function }) {
  const [value, setValue] = useState<string | null>("");

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  function downHandler(event: React.KeyboardEvent) {
    const { key, shiftKey } = event;

    if (shiftKey && key === "Enter") handleSubmit(onSubmit)(event);
  }

  const onSubmit = async (data: any, event: any) => {
    if (data.val.length < 1) return;
    if (isSubmitting) return;
    submitMutation(data.val);
    setValue(null);
    setValue("");
  };

  return (
    <div className={styles.comment_form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AutoHeightTextarea
          className={styles.comment_input}
          placeholder="Write a comment..."
          autoComplete="off"
          value={value}
          name="val"
          refObj={register({ required: true })}
          onKeyDown={downHandler}
        />

        <div className={styles.comment_submit}>
          {(!isSubmitting && <i className="fal fa-paper-plane" />) || (
            <i className="fal fa-spinner fa-spin" />
          )}

          <input type="submit" value="" />
        </div>
      </form>
    </div>
  );
}

const isViewable = (parent: HTMLDivElement, child: HTMLDivElement): boolean => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return (
    childRect.top >= parentRect.top &&
    childRect.top - (parentRect.top + parent.clientHeight) <= 90
  );
};

function usePrevious(value: any): any {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const scrollToBottom = (
  parentRef: React.RefObject<HTMLDivElement>,
  childRef: React.RefObject<HTMLDivElement>,
  forceScroll?: boolean
) => {
  const node: HTMLDivElement | null = childRef.current;
  if (node) {
    const isChild = isViewable(
      parentRef.current! as HTMLDivElement,
      childRef.current! as HTMLDivElement
    );
    if (forceScroll || isChild)
      (node as any).scrollIntoView({ behavior: "smooth" });
  }
};

export function Log({
  logs,
  user,
  submitMutation,
  updateMutation,
  deleteMutation,
}: {
  logs: ILogItem[];
  user: any;
  submitMutation: Function;
  updateMutation: Function;
  deleteMutation: Function;
}) {
  const [viewEvents, setViewEvents] = useState(false);
  const ref = useRef(null);
  const parentRef = useRef(null);

  logs = logs
    .filter(l => (viewEvents ? l : l.logType === "COMMENT"))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const prevCount = usePrevious(logs);

  useEffect(() => {
    if (!prevCount?.length) scrollToBottom(parentRef, ref, true);
    else scrollToBottom(parentRef, ref, false);
  }, [logs, prevCount]);

  return (
    <>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${!viewEvents && styles.selected_tab}`}
          onClick={() => setViewEvents(false)}
        >
          COMMENTS
        </div>
        <div
          className={`${styles.tab} ${viewEvents && styles.selected_tab}`}
          onClick={() => setViewEvents(true)}
        >
          ACTIVITIES
        </div>
      </div>
      <div ref={parentRef} className={styles.comments_section}>
        {logs.length ? (
          logs.map((logItem: ILogItem) => (
            <LogItem
              ref={ref}
              logItem={logItem}
              isAuthor={logItem.createdBy === user?.cognitoIdentityId}
              deleteMutation={deleteMutation}
              updateMutation={updateMutation}
            />
          ))
        ) : (
          <div className={styles.log_empty}>No comments yet...</div>
        )}
      </div>

      <hr />
      <LogInput
        submitMutation={(value: string) => {
          submitMutation(value);
          scrollToBottom(parentRef, ref, true);
        }}
      />
    </>
  );
}