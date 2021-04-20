import React from "react";
import { MultipleChoiceInput } from "Components/Forms/FormInputs";

export default function MultipleChoiceInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const answerAnswers = answers.filter(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  return (
    <MultipleChoiceInput
      style={{ padding: "10px" }}
      options={question.options.map(({ val, sid }) => {
        const answer = answerAnswers.find(
          ({ sid: answersSid }) => answersSid === sid
        );

        return {
          val,
          key: sid,
          checked: answer?.val,
          handleOnClick: e => {
            let allAnswers = [...answers];

            if (e.target.checked) {
              const answerNew = {
                inputType: question.inputType,
                questionId: question.id,
                question: question.name,
                sid,
                val,
              };
              allAnswers.push(answerNew);
            } else {
              allAnswers = allAnswers.filter(
                ans => !(ans.sid === sid && ans.questionId === question.id)
              );
            }
            setAnswers(allAnswers);
          },
        };
      })}
    />
  );
}
