import React from "react";

import TextInput from "./TextInput";
import MultipleTextInput from "./MultipleTextInput";
import SingleChoiceInput from "./SingleChoiceInput";
import MultipleChoiceInput from "./MultipleChoiceInput";

export function GeneralInput(props) {
  switch (props.question.inputType) {
    case "CHECK":
      return <MultipleChoiceInput {...props} />;
    case "RADIO":
      return <SingleChoiceInput {...props} />;
    case "INPUT_TEXT":
      return <TextInput {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <MultipleTextInput {...props} />;
    default:
      return <MultipleChoiceInput {...props} />;
  }
}
