import React from "react";

import { SingleChoiceInput } from "Components/Forms/FormInputs";

export default function SingleChoiceInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  const { options } = question;

  // Get answer from array of answers
  // ————————————————————————————————
  function getAnswer({ sid }) {
    let answer = answers.find(
      a =>
        a.questionId === question.id &&
        a.inputType === question.inputType &&
        a.sid === sid
    );
    return answer;
  }

  // Handle select answer
  // --------------------
  function handleSelect({ sid, val }) {
    let newAnswers = [
      // Filter out current answer, if it exists
      ...answers.filter(a => a.questionId !== question.id),

      // Add new answer
      {
        sectionId: section.id,
        questionId: question.id,
        sectionName: section.name,
        questionName: question.name,
        inputType: question.inputType,
        sid: sid,
        val: val,
      },
    ];

    // Set data
    setAnswers(newAnswers);
  }

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => {
        // Get answer for this option
        const answer = getAnswer({ sid });

        // Get boolean value
        const checked = !!(answer && answer.val);

        // Return radio properties
        return {
          key: sid,
          val: val,
          checked: checked,
          handleOnChange: () => {
            handleSelect({ answer, sid, val });
          },
        };
      })}
    />
  );
}
