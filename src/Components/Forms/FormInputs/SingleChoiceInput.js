import React from "react";

export default function SingleChoiceInput({ style, options, disabled }) {
  return (
    <div style={style}>
      <form onSubmit={e => e.preventDefault()}>
        {options.map(({ val, checked, handleOnChange }, i) => {
          return (
            <div className="check_container" key={`o-${i}`}>
              <label>
                <input
                  type="radio"
                  disabled={disabled}
                  checked={checked}
                  onChange={handleOnChange}
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
