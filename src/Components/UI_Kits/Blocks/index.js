// Created By : Siva
// Date : 6/04/2021

import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Tabsection } from "../Tabs/index";
import CardHeader from "@material-ui/core/CardHeader";
import "./style.css";

export function Blocks({ tabValue, tabArr, contentArr, children, width }) {
  const [currentTab, setCurrentTab] = useState(tabValue);

  const tabFuc = val => {
    setCurrentTab(val);
  };

  return (
    <Card className={width ? width : "width"}>
      <CardHeader
        title={
          <Tabsection
            tabFuc={val => tabFuc(val)}
            tabValue={currentTab}
            tabArr={tabArr}
          />
        }
      />
      <CardContent className="contentScroll">
        {contentArr.length &&
          contentArr.map(
            (item, index) =>
              currentTab === item.value && (
                <div key={index}>
                  <div className="cardContent">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      width="50"
                      height="40"
                    ></img>
                    <div>{item.text}</div>
                  </div>
                  <hr className="underline" />
                </div>
              )
          )}
        {children && children}
      </CardContent>
    </Card>
  );
}
