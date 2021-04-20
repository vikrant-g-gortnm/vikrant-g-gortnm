// Created By : Siva
// Date : 8/04/2021

import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./style.css";
import { Content } from "Components/elements";

export function Tabsection({ tabValue, tabArr, tabFuc, active }) {
  const [value, setValue] = useState(tabValue);

  const handleTabChange = val => {
    setValue(val);
    if (tabFuc) {
      tabFuc(val);
    }
  };

  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleTabChange}
      aria-label="disabled tabs example"
    >
      {tabArr.length &&
        tabArr.map((item, index) => (
          <Tab
            key={index}
            onClick={() => handleTabChange(item.value)}
            value={item.value}
            label={item.text}
            activeTab={index === active ? "active" : null}
          />
        ))}
    </Tabs>
  );
}
