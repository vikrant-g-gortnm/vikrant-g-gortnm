import React from "react";
import { SingleChoiceInput } from "Components/Forms/FormInputs";

export default function SingleChoiceInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const answer = answers.find(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  return (
    <SingleChoiceInput
      style={{ padding: "10px" }}
      options={question.options.map(({ val, sid }) => ({
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {
          const answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            question: question.name,
            sid,
            val,
          };

          let newAnswers;

          // There is already an answer for this question
          if (answer) {
            newAnswers = answers.map(ans => {
              return ans.questionId === question.id ? answerNew : ans;
            });
          }

          // There is not an answer for this question
          if (!answer) {
            newAnswers = [...answers, answerNew];
          }

          setAnswers(newAnswers);
        },
      }))}
    />
  );
}
