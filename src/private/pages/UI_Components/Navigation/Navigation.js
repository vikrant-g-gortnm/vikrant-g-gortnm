import React, { useState } from "react";

import { SideBarMenu } from "Components/UI_Kits";
import { TopMenu } from "Components/UI_Kits";
import { RadioButtons } from "Components/UI_Kits";
import { CheckBoxes } from "Components/UI_Kits";

export default function Navigation() {
  return (
    <div>
      <SideBarMenu />
      <div>
        <TopMenu />

        <div className="container">
          {/* <form>
            <CheckBoxes
              name="name"
              data={[
                {
                  id: "1",
                  value: "option1",
                  label: "option1",
                },
                {
                  id: "2",
                  value: "option2",
                  label: "option2",
                },
              ]}
            />
            <RadioButtons
              name="name"
              preselected="option1"
              data={[
                {
                  id: "1",
                  value: "option1",
                  label: "option1",
                },
                {
                  id: "2",
                  value: "option2",
                  label: "option2",
                },
              ]}
            />
          </form>
         */}
        </div>
      </div>
    </div>
  );
}
