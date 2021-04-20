import React from "react";

import { MultipleChoiceInput } from "../../Forms";

export default function MultipleChoiceInputContainer({
  question,
  section,
  setAnswers,
  answers,
}) {
  const { options } = question;

  const answerAnswers = answers.filter(
    ({ questionId }) => questionId === question.id
  );

  return (
    <MultipleChoiceInput
      options={options.map(({ val, sid }) => {
        const answer = answerAnswers.find(
          ({ sid: answersSid }) => answersSid === sid
        );
        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: e => {
            let allAnswers = [...answers];

            if (e.target.checked) {
              const answerNew = {
                inputType: question.inputType,
                sectionId: section.id,
                sectionName: section.name,
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
