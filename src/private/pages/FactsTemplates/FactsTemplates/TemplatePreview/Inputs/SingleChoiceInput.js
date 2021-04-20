import React from "react";
import { SingleChoiceInput } from "Components/Forms/FormInputs";

export default function SingleChoiceInputContainer({ question }) {
  const { options } = question;

  const answer = {};

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => ({
        key: sid,
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {},
      }))}
    />
  );
}
