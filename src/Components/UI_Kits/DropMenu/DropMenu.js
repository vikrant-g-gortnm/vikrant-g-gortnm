import React from "react";
import Card from "@material-ui/core/Card";
import { IconButton } from "./Component/IconButton";
import "./style.css";

function DropMenu({ dropMenuArr }) {
  return (
    <Card className="drop-menu-card">
      {dropMenuArr.length && <IconButton dropMenuArr={dropMenuArr} />}
    </Card>
  );
}

export default DropMenu;
