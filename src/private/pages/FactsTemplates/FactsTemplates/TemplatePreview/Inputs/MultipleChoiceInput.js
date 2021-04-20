import React from "react";
import { MultipleChoiceInput } from "Components/Forms/FormInputs";

export default function MultipleChoiceInputContainer({ question }) {
  const { options } = question;
  return (
    <MultipleChoiceInput
      options={options.map(({ val, sid }) => {
        const answer = {};
        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: () => {},
        };
      })}
    />
  );
}
