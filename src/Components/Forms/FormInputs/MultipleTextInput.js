import React from "react";
import { useForm } from "react-hook-form";

import { inputWrapper, inputIcon } from "./MultipleTextInput.module.css";

export default function MultipleTextInput({
  handleOnSubmit,
  handleOnDelete,
  answers,
}) {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data, event) {
    await handleOnSubmit(data, event);
  }

  async function onDelete(id) {
    await handleOnDelete(id);
  }

  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      await handleOnSubmit({ new: event.target.value }, event);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {answers.map(({ id, val }, i) => (
        <div className={inputWrapper} key={id || val}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name={id || i}
            defaultValue={val}
            placeholder="Say something..."
            onBlur={handleSubmit(onSubmit)}
          ></input>
          <div className={inputIcon} onClick={() => onDelete(id || i)}>
            <i className="fal fa-times" />
          </div>
        </div>
      ))}

      <div className={inputWrapper}>
        <input
          autoComplete="off"
          type="text"
          ref={register}
          name="new"
          placeholder="Say something..."
          onBlur={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        />
        <div className={inputIcon} onClick={() => handleSubmit(onSubmit)}>
          <i className="fal fa-plus" />
        </div>
      </div>
    </form>
  );
}
