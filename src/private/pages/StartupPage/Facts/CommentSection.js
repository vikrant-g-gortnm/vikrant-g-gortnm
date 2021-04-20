import React from "react";

import {
  comments_label,
  comments_list,
  comment_item,
} from "./CommentSection.module.css";

export function CommentSection({ section, question, creative }) {
  const comments = (creative.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <div
      className="comment_form"
      style={{ padding: "15px", paddingBottom: "0px" }}
    >
      {!!comments.length && (
        <>
          <div className={comments_list}>
            <div className={comments_label}>Comments</div>
            {comments.map(({ val, id }) => (
              <div key={id} className={comment_item}>
                {val}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
