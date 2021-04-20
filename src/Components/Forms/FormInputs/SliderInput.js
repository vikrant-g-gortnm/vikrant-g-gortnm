import React from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export default function SliderInput({ style, range, ...props }) {
  return (
    <div style={style}>
      <form onSubmit={e => e.preventDefault()}>
        {range ? <Range {...props} /> : <Slider {...props} />}
      </form>
    </div>
  );
}
