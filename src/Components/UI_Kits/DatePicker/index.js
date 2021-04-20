// Created By : Siva
// Date : 2/04/2021

import React from "react";
import { TextField } from "@material-ui/core";
import "./style.css";

export const DatePickers = ({ id, label, selectedDate, handleDateChange }) => {
  return (
    <TextField
      id={id}
      label={label}
      type="date"
      onChange={handleDateChange}
      defaultValue={selectedDate}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        disableUnderline: true,
        className: "datePicker",
      }}
    />
  );
};
