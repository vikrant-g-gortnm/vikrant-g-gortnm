import React from "react";

// Components
import { TextInput } from "Components/Forms/FormInputs";

export default function TextInputContainer({
  templateId,
  section,
  question,
  answers,
  setAnswers,
}) {
  // Get current answer from array of answers
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === question.inputType && questionId === question.id
  );

  function handleSubmit(event) {
    // Skip if answer don't exist, and text field is empty
    // (if it does exist we need to be able to save an empty field)
    if (!answer && !event.target.value) {
      return;
    }

    // Create answer object
    let answerObject = {
      sectionId: section.id,
      questionId: question.id,
      sectionName: section.name,
      questionName: question.name,
      inputType: question.inputType,
      sid: "",
      val: event.target.value,
    };

    // Remove current answer from list of answers
    let otherAnswers = answers.filter(
      ({ inputType, questionId }) =>
        !(inputType === question.inputType && questionId === question.id)
    );

    // Join the data
    let newAnswers = [...otherAnswers, answerObject];

    // Set data
    setAnswers(newAnswers);
  }

  return (
    <TextInput
      rows={7}
      style={{ resize: "none", height: "150px" }}
      placeholder="Say something..."
      defaultValue={answer && answer.val}
      onBlur={handleSubmit}
    />
  );
}
