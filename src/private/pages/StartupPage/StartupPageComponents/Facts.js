import React from "react";

import { Button, Card } from "Components/elements";
import { startup_page } from "definitions.js";

import StartupInfoSection from "./StartupInfoSection";

export function Facts({ label, hideTitle, connection, user, match, history }) {
  const { creative } = connection;
  const { sharedWithEmail, submit: submitted } = creative;
  const answers = creative?.answers || [];

  const answerCount = [...new Set(answers.map(({ questionId }) => questionId))]
    .length;
  const isUntouched = !sharedWithEmail && !submitted && !answerCount;

  const isMine = creative.accountId === user.accountId;

  const oneLiner = (
    answers.find(({ questionId }) => questionId === "q01_section_info") || {}
  ).val;

  return (
    <Card label={label || ""} style={{ paddingBottom: "20px" }}>
      <div style={{ padding: "10px" }}>
        {hideTitle && (
          <h1 style={{ marginBottom: "10px" }}>{connection.creative.name}</h1>
        )}

        {!oneLiner && (
          <div
            style={{
              color: "var(--color-gray-medium)",
              fontStyle: "italic",
              marginBottom: "15px",
            }}
          >
            There is not much information about this company
          </div>
        )}

        {!isUntouched && (
          <StartupInfoSection
            creative={creative}
            answers={answers}
            hideTitle={hideTitle}
          />
        )}
      </div>

      {isMine && (
        <div
          style={{
            textAlign: "right",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Button
            size="small"
            type="right_arrow"
            onClick={() => {
              const path = `${startup_page}/${match.params.id}/creative/${connection.creative.id}`;
              history.push(path);
            }}
          >
            {isUntouched ? "Add info about this startup" : "Edit startup info"}
          </Button>
        </div>
      )}
    </Card>
  );
}
