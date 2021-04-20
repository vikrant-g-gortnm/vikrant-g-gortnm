import React from "react";
import "./style.css";

export const TextField = ({ title, description, placeholder, subTitle }) => {
  return (
    <div className="text-parent">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
        <textarea
          placeholder={placeholder}
          className="text-box"
          rows="6"
          cols="50"
          name="comment"
        >
          {}
        </textarea>
      </div>
    </div>
  );
};

export default TextField;
