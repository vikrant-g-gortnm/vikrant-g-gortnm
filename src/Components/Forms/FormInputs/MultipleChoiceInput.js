import React from "react";

export default function MultipleChoiceInput({ style, options, disabled }) {
  return (
    <div style={style}>
      <form onSubmit={e => e.preventDefault()}>
        {options.map(({ val, key, checked, handleOnClick }) => {
          return (
            <div className="check_container" key={`o-${key}`}>
              <label>
                <input
                  type="checkbox"
                  value={val}
                  disabled={disabled}
                  defaultChecked={checked}
                  onClick={handleOnClick}
                />
                {val}
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
}
