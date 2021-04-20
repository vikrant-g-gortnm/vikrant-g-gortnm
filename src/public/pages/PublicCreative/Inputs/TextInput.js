import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { TextInput } from "Components/Forms/FormInputs";
import { publicCreativePut } from "public/Apollo/Mutations";

export default function TextInputContainer({ question, section, creative }) {
  const [mutate, { loading }] = useMutation(publicCreativePut);

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
      onBlur={event => {
        if (creative.id) {
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
              sectionId: section.id,
              sectionName: section.name,
              questionId: question.id,
              question: question.name,
              val: event.target.value,
            };
          }

          mutate({
            variables,
          });
        }
      }}
    />
  );
}
