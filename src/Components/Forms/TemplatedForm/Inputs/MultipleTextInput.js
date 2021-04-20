import React from "react";
import { MultipleTextInput } from "Components/Forms/FormInputs";

export default function MultipleTextInputContainer({
  templateId,
  section,
  question,
  answers,
  setAnswers,
}) {
  // Get answers for question
  let currentAnswers = answers.filter(
    ({ inputType, questionId }) =>
      inputType === question.inputType && questionId === question.id
  );

  // Add new answer
  function addNewAnswer(value, event) {
    // Return if duplicate
    if (answers.find(({ val }) => val === value)) {
      return;
    }

    // Create new answer data
    let newAnswer = {
      sectionId: section.id,
      questionId: question.id,
      sectionName: section.name,
      questionName: question.name,
      inputType: question.inputType,
      sid: "",
      val: value,
    };

    // Join data
    let newAnswers = [...answers, newAnswer];

    // Set data
    setAnswers(newAnswers);

    // Clear the input
    event.target.value = "";
  }

  // Update existing answers
  function updateAnswers({ data }) {
    if (!data) return;

    // Get all answers, except from current question
    let otherAnswers = answers.filter(
      ({ inputType, questionId }) =>
        inputType !== question.inputType && questionId !== question.id
    );

    // Updated answers
    let updatedAnswers = currentAnswers.map((answer, i) => ({
      ...answer,
      val: data[i] ? data[i] : answer.val,
    }));

    // Combine answers
    let newAnswers = [...otherAnswers, ...updatedAnswers];

    // Set data
    setAnswers(newAnswers);
  }

  // Event: onSubmit
  function handleOnSubmit(data, event) {
    data.new && data.new.length
      ? // New answer
        addNewAnswer(data.new, event)
      : // Update answers
        updateAnswers(data);
  }

  // Event: onDelete
  function handleOnDelete(index) {
    // Get all answers, except from current question
    let otherAnswers = answers.filter(
      ({ inputType, questionId }) =>
        inputType !== question.inputType && questionId !== question.id
    );

    // Remove answer from current
    currentAnswers.splice(index, 1);

    // Combine answers
    let newAnswers = [...otherAnswers, ...currentAnswers];

    // Set data
    setAnswers(newAnswers);
  }

  return (
    <MultipleTextInput
      answers={currentAnswers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}
