import React, { useRef, useState, useEffect } from "react";

const defaultStyle = {
  display: "block",
  overflow: "hidden",
  resize: "none",
  width: "100%",
};

const mergeRefs = (
  ...refs: (
    | React.MutableRefObject<null>
    | ((instance: HTMLTextAreaElement | null) => void)
  )[]
):
  | ((instance: HTMLTextAreaElement | null) => void)
  | null
  | React.MutableRefObject<null> => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: any) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

export default function AutoHeightTextarea({
  style = defaultStyle,
  refObj,
  value,
  ...etc
}: {
  style?: {};
  refObj: any;
  value?: any;
  [etc: string]: any;
}) {
  const textareaRef = useRef(null);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    textareaRef.current.style.height = "0px";
    // @ts-ignore: Object is possibly 'null'.
    const scrollHeight = textareaRef.current.scrollHeight;
    // @ts-ignore: Object is possibly 'null'.
    textareaRef.current.style.height = scrollHeight + "px";
  }, [currentValue]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <textarea
      ref={mergeRefs(refObj, textareaRef)}
      style={style}
      onChange={e => setCurrentValue(e.target.value)}
      {...etc}
      value={currentValue}
    />
  );
}
