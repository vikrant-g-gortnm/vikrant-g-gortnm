import React, { useState } from "react";

import { inputWrapper, inputIcon } from "./MultipleTextInput.module.css";

export default function MultipleTextInput({
  setAnswers,
  question,
  section,
  answers,
}) {
  const [newAnswer, setnewAnswer] = useState("");

  const answerAnswers = answers.filter(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === question.inputType
  );

  async function handleOnSubmit(value, id) {
    if (id === undefined) {
      if (!value.length) return;

      const id = answerAnswers.length
        ? answerAnswers[answerAnswers.length - 1].id + 1
        : 0;

      const answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        sectionId: section.id,
        sectionName: section.name,
        id,
        val: value,
      };

      setAnswers([...answers, answerNew]);
    }
  }

  async function handleOnDelete(id) {
    setAnswers(answers.filter(ans => ans.id !== id));
  }

  return (
    <div className="notata_form">
      {answerAnswers.map(({ id, val }, i) => (
        <div className={inputWrapper} key={id}>
          <input
            autoComplete="off"
            type="text"
            name={id}
            value={val}
            disabled
            placeholder="Say something..."
          />
          <div className={inputIcon} onClick={() => handleOnDelete(id)}>
            <i className="fal fa-times" />
          </div>
        </div>
      ))}

      <div className={inputWrapper}>
        <input
          autoComplete="off"
          type="text"
          name="new"
          placeholder="Say something..."
          value={newAnswer}
          onChange={e => setnewAnswer(e.target.value)}
          onBlur={e => {
            handleOnSubmit(e.target.value);
            setnewAnswer("");
          }}
        />
        <div
          className={inputIcon}
          onClick={() => {
            handleOnSubmit(newAnswer);
            setnewAnswer("");
          }}
        >
          <i className="fal fa-plus" />
        </div>
      </div>
    </div>
  );
}
