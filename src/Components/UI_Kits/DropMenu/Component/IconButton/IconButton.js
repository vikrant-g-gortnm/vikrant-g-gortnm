import React, { useState } from "react";
import "./style.css";

function IconButton({ dropMenuArr }) {
  const [isClicked, setClicked] = useState(null);

  const markedItem = index => {
    setClicked(index);
  };

  return (
    dropMenuArr.length &&
    dropMenuArr.map((item, index) => (
      <div
        key={index}
        onClick={() => markedItem(index)}
        className="icon-btn-div"
      >
        <i
          style={index === isClicked ? { color: "red" } : { color: "gray" }}
          className={
            index === isClicked
              ? `${item.iconName} i-after`
              : `${item.iconName} icon`
          }
        />
        <span
          style={
            index === isClicked
              ? { color: "red", marginLeft: "5px" }
              : { color: "gray", marginLeft: "5px" }
          }
          // className={index === 1 ? "click-btn-after" : "click-btn"}
        >
          {item.title}
        </span>
      </div>
    ))
  );
}

export default IconButton;
