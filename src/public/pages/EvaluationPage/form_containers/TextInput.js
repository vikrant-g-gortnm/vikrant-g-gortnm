import React, { useCallback } from "react";
import { debounce } from "lodash";
import { TextInput } from "Components/Forms/FormInputs";

export default function TextInputContainer({ question, setAnswers, answers }) {
  const delayedSet = useCallback(
    debounce(options => setAnswers(options), 1000),
    []
  );

  const answer = answers.find(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  return (
    <TextInput
      rows={7}
      style={{ resize: "none" }}
      placeholder="Say something..."
      defaultValue={answer?.val}
      onChange={event => {
        const answerNew = {
          inputType: question.inputType,
          questionId: question.id,
          question: question.name,
          val: event.target.value,
        };

        let newAnswers;

        if (!answer) {
          newAnswers = [...answers, answerNew];
        }

        if (answer) {
          newAnswers = answers.map(ans =>
            ans.questionId === question.id ? answerNew : ans
          );
        }

        delayedSet(newAnswers);
      }}
    />
  );
}
