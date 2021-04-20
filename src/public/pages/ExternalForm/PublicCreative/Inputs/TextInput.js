import React from "react";
import { TextInput } from "Components/Forms/FormInputs";

export default function TextInputContainer({
  question,
  section,
  setAnswers,
  answers,
}) {
  const answer = answers.find(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  return (
    <TextInput
      rows={7}
      style={{ resize: "none", height: "150px" }}
      placeholder="Say something..."
      defaultValue={answer && answer.val}
      onBlur={event => {
        const answerNew = {
          inputType: question.inputType,
          questionId: question.id,
          question: question.name,
          sectionId: section.id,
          sectionName: section.name,
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

        setAnswers(newAnswers);
      }}
    />
  );
}
