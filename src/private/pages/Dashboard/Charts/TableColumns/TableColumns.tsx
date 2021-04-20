import * as React from "react";
import { startup_page } from "definitions.js";
import { Connection } from "private/pages/Dashboard/Connections/types";

import styles from "../../Connections/Connections.module.css";

import moment from "moment";
import { History } from "history";

export default ({ history }: { history: History }) => [
  {
    title: "Company name",
    key: "creative.name",
    className: `${styles.max_width_200} ml2`,
    type: "string",
    render: (connection: Connection) => {
      let _style: React.CSSProperties = {
        cursor: "pointer",
      } as React.CSSProperties;

      return (
        <div style={_style} className={styles.company_name}>
          <div
            onClick={() => {
              history.push(`${startup_page}/${connection.id}`);
            }}
            className={styles.background_clicker}
          />

          <div
            onClick={() => {
              history.push(`${startup_page}/${connection.id}`, {
                rightMenu: true,
              });
            }}
            className={styles.actual_content}
          >
            {connection.creative.name}
          </div>
        </div>
      );
    },
  },
  {
    title: "Created",
    // dataIndex: "updatedAt",
    key: "createdAt",
    responsive: "lg",
    className: styles.pre_space,
    type: "date",
    render: (connection: Connection) => {
      return (
        <div>
          <div
            onClick={() => {
              history.push(`${startup_page}/${connection.id}`);
            }}
            className={styles.background_clicker}
          />

          <div className={styles.actual_content}>
            <span className={styles.date_style}>
              {moment(connection.createdAt).format("ll")}
            </span>
          </div>
        </div>
      );
    },
  },
];
