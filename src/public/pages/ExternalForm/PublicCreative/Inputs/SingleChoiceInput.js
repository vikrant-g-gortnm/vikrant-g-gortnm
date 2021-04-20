import React from "react";
import { SingleChoiceInput } from "../../Forms";

export default function SingleChoiceInputContainer({
  question,
  section,
  setAnswers,
  answers,
}) {
  const { options } = question;
  const answer = answers.find(({ questionId }) => questionId === question.id);

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => ({
        val,

        checked: answer ? answer.val === val : false,

        handleOnChange: () => {
          const answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            question: question.name,
            sectionId: section.id,
            sectionName: section.name,
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
