import React from "react";

import { Button } from "Components/elements/";

export function CommentSection({ section, question }) {
  return (
    <div className="comment_form text-right">
      <div>
        <Button
          size="small"
          buttonStyle="secondary"
          style={{ color: "var(--color-gray-medium)" }}
        >
          Add coment
        </Button>
      </div>
    </div>
  );
}
