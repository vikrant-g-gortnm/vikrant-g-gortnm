import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { debounce } from "lodash";
import { TextInput } from "Components/Forms/FormInputs";

import { evaluationPut } from "private/Apollo/Mutations";

export default function TextInputContainer({
  section,
  question,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);
  const delayedMutation = useCallback(
    debounce(options => mutate(options), 1000),
    []
  );

  const answer = evaluation.answers.find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  return (
    <TextInput
      rows={7}
      style={{ resize: "none" }}
      placeholder="Say something..."
      disabled={loading}
      defaultValue={answer && answer.val}
      onChange={event => {
        const variables = {
          id: evaluation.id,
          input: {
            name: section.name,
            description: section.description,
            templateId,
          },
        };

        if (answer) {
          variables.input.answerUpdate = {
            id: answer.id,
            question: question.name,
            val: event.target.value,
          };
        } else {
          variables.input.answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            question: question.name,
            val: event.target.value,
          };
        }
        delayedMutation({
          variables,
        });
      }}
    />
  );
}
