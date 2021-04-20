import React from "react";
import { Content, Card, Table } from "Components/elements";

import {
  profile,
  tags,
  funnels,
  team,
  evaluation_templates,
  facts_templates,
  external_form,
} from "definitions.js";

import tableStyles from "Components/elements/NotataComponents/Table.module.css";

const linkList = [
  {
    label: "Evaluation templates",
    iconClass: "fal fa-copy",
    link: evaluation_templates,
  },
  {
    label: "Funnels",
    iconClass: "fal fa-tag",
    link: funnels,
  },
  {
    label: "Tags",
    iconClass: "fal fa-filter",
    link: tags,
  },

  {
    label: "User profile",
    iconClass: "fal fa-user",
    link: profile,
  },
  {
    label: "Your team",
    iconClass: "fal fa-users",
    link: team,
  },
  {
    label: "Web Form",
    iconClass: "fal fa-inbox",
    link: external_form,
  },
  {
    label: "Startup template",
    iconClass: "fal fa-copy",
    link: facts_templates,
  },
];

const Settings = ({ history }) => {
  const columns = [
    {
      title: "Icon",
      key: "icon",
      width: 50,
      // className: list_star,
      render: listItem => {
        return (
          <div
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => history.push(listItem.link)}
          >
            <i className={listItem.iconClass} />
          </div>
        );
      },
    },

    {
      title: "Link name",
      key: "link name",
      render: listItem => {
        return (
          <div>
            <div
              onClick={() => history.push(listItem.link)}
              className={tableStyles.background_clicker}
            />
            <div
              className={tableStyles.actual_content}
              style={{
                pointerEvents: "none",
                color: "var(--color-secondary)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              {listItem.label}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Content maxWidth={780}>
      <h1>Settings</h1>

      <Card noMargin={true}>
        <Table
          dataSource={linkList}
          columns={columns}
          disableHead={true}
          pagination={false}
        />
      </Card>
    </Content>
  );
};

export default Settings;
