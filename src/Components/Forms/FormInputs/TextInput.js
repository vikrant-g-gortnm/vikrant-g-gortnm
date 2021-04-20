import React from "react";

export default function TextInput({
  rows,
  style,
  placeholder,
  disabled,
  defaultValue,
  onChange,
  onBlur,
}) {
  return (
    <form onSubmit={e => e.preventDefault()}>
      <textarea
        rows={rows || 7}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
      />
    </form>
  );
}
