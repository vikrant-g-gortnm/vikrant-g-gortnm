import React from "react";

import MultipleChoiceInput from "./MultipleChoiceInput";
import SingleChoiceInput from "./SingleChoiceInput";
import CommentInput from "./CommentInput";
import TrafficLightInput from "./TrafficLightInput";
import TextInput from "./TextInput";
import MultipleTextInput from "./MultipleTextInput";

function MapInput(props) {
  switch (props.question.inputType) {
    case "CHECK":
      return <MultipleChoiceInput {...props} />;
    case "RADIO":
      return <SingleChoiceInput {...props} />;
    case "TRAFFIC_LIGHTS":
      return <TrafficLightInput {...props} />;
    case "INPUT_TEXT":
      return <TextInput {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <MultipleTextInput {...props} />;
    default:
      return <MultipleChoiceInput {...props} />;
  }
}

export default function GeneralInput(props) {
  return (
    <div>
      <div className="form_h2">{props.question.name}</div>
      <div className="form_p2">{props.question.description}</div>
      <hr />
      <MapInput {...props} />
      <CommentInput {...props} />
    </div>
  );
}
