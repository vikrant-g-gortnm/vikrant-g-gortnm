import React from "react";

// Components
import TinyRightButton from "./TinyRightButton";
import InputButton from "./InputButton";
import TextButton from "./TextButton";
import StandardButton from "./StandardButton";

// *****************
// * MAIN FUNCTION *
// *****************
export function Button(props) {
  let { type } = props;

  switch (type) {
    case "tiny_right":
      return <TinyRightButton {...props} />;

    case "input":
      return <InputButton {...props} />;

    case "just_text":
      return <TextButton {...props} />;

    default:
      return <StandardButton {...props} />;
  }
}
