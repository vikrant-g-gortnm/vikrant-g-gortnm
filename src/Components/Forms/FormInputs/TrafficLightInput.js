import React from "react";
import { InputTrafficLight } from "../../elements";

export default function TrafficLightInput({ value, handleOnClick }) {
  return (
    <form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {["red", "yellow", "green"].map(color => (
          <InputTrafficLight
            key={color}
            color={color}
            active={value === color}
            onClick={() => handleOnClick(color)}
          />
        ))}
      </div>
    </form>
  );
}
