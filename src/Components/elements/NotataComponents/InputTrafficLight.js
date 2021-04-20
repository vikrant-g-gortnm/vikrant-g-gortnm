import React from "react";
import classnames from "classnames";
import {
  traffic_light,
  traffic_red,
  traffic_yellow,
  traffic_green,
  selected_traffic_light,
} from "./InputTrafficLight.module.css";

export function InputTrafficLight({ active, onClick, color }) {
  return (
    <div
      className={classnames(
        traffic_light,
        color === "red" && traffic_red,
        color === "yellow" && traffic_yellow,
        color === "green" && traffic_green,
        active && selected_traffic_light
      )}
      onClick={onClick}
    >
      <span>{color}</span>
    </div>
  );
}
