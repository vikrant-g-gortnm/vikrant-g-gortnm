import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { debounce } from "lodash";

import { TextInput } from "Components/Forms/FormInputs";

import { creativePut } from "private/Apollo/Mutations";

export default function TextInputContainer({ question, section, creative }) {
  const [mutate, { loading }] = useMutation(creativePut);

  const delayedMutation = useCallback(
    debounce(q => mutate(q), 1000),
    []
  );

  const answer = (creative.answers || []).find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  return (
    <TextInput
      rows={7}
      style={{ resize: "none", height: "150px" }}
      placeholder="Say something..."
      disabled={loading}
      defaultValue={answer && answer.val}
      onChange={event => {
        const variables = {
          id: creative.id,
          input: {},
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
