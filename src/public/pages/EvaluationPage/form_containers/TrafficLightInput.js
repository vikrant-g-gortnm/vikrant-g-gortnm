import React from "react";
import { TrafficLightInput } from "Components/Forms/FormInputs";

export default function TrafficLightInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const answer = answers.find(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  return (
    <TrafficLightInput
      value={answer?.val}
      handleOnClick={color => {
        const answerNew = {
          inputType: question.inputType,
          questionId: question.id,
          question: question.name,
          val: color,
        };

        let newAnswers;

        // There is already an answer for this question
        if (answer) {
          newAnswers = answers.map(ans =>
            ans.questionId === question.id ? answerNew : ans
          );
        }

        // There is not an answer for this question
        if (!answer) {
          newAnswers = [...answers, answerNew];
        }

        setAnswers(newAnswers);
      }}
    />
  );
}
