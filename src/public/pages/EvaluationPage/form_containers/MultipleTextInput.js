import React from "react";
import { MultipleTextInput } from "Components/Forms/FormInputs";

export default function MultipleTextInputContainer({
  question,
  setAnswers,
  answers,
}) {
  const answerAnswers = answers.filter(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  async function handleOnSubmit(value, e) {
    let newAnswers;
    if (value.new) {
      if (!value.new.length) return;

      const id = answerAnswers.length
        ? answerAnswers[answerAnswers.length - 1].id + 1
        : 0;

      const answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        id,
        val: value.new,
      };

      newAnswers = [...answers, answerNew];

      e.target.value = "";
    } else {
      let hit = answerAnswers.find(answer => answer.val !== value[answer.id]);
      if (!hit) return;

      const answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        id: hit.id,
        val: value[hit.id],
      };

      newAnswers = answers.map(ans =>
        ans.questionId === question.id && ans.id === hit.id ? answerNew : ans
      );
    }
    setAnswers(newAnswers);
  }

  async function handleOnDelete(id) {
    setAnswers(answers.filter(ans => ans.id !== id));
  }

  return (
    <MultipleTextInput
      answers={answerAnswers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}
