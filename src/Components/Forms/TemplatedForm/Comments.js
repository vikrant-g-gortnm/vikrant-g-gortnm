import React from "react";

// Styles
import styles from "./TemplatedForm.module.css";
import classnames from "classnames";

// *****************
// * Main function *
// *****************
export function Comments({ questionId, answers }) {
  // Isolate comments
  const comments = answers.filter(
    ({ inputType, questionId: id }) =>
      inputType === "COMMENT" && id === questionId
  );

  return (
    <div className={classnames("comment_form", styles.comments_container)}>
      {!!comments.length && (
        <>
          <div className={styles.comments_list}>
            <div className={styles.comments_label}>Comments</div>
            {comments.map(({ val, id }) => (
              <div key={id} className={styles.comments_item}>
                {val}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
