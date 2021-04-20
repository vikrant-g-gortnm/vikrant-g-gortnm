import React, { useEffect } from "react";
import { Button, Card, Table } from "Components/elements";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { presentationsGet } from "private/Apollo/Queries";
import queryString from "query-string";
import { startup_page } from "definitions.js";

const columns = [
  {
    title: "",
    dataIndex: "email",
    key: "name",
    width: 50,
    render: email => <span />,
  },
  {
    title: "Shared with",
    dataIndex: "email",
    key: "name",
    render: email => <span>{email}</span>,
  },
  {
    title: "Last opened",
    dataIndex: "opened",
    key: "opened",
    responsive: "sm",
    width: 250,
    render: opened => {
      if (!opened) {
        return <span style={{ color: "var(--color-gray-light)" }}>never</span>;
      }
      return <span>{moment(opened).format("lll")}</span>;
    },
  },
];

export function SimpleListOfSharings({ connectionId, history, location }) {
  const [getPresentations, { data, loading }] = useLazyQuery(presentationsGet);

  useEffect(() => {
    if (connectionId) {
      getPresentations({
        variables: { connectionId },
      });
    }
  }, [connectionId]);

  let presentations = data?.presentationsGet || [];

  return (
    <div>
      <Card label={"SHARING"} noMargin={true}>
        <Table
          loading={loading}
          dataSource={presentations
            .filter(x => x)
            .sort((a, b) => b.createdAt - a.createdAt)}
          columns={columns}
          disableHead={false}
          pagination={false}
        />
      </Card>

      <div
        style={{
          marginTop: "0px",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: "-40px",
        }}
      >
        <span />
        <Button
          type="right_arrow"
          size="small"
          onClick={() => {
            let parsed = queryString.parse(location.search);
            let stringified = queryString.stringify({
              ...parsed,
              tab: "presentations",
            });
            let pathName = `${startup_page}/${connectionId}?${stringified}`;
            history.push(pathName);
          }}
        >
          Go to sharing
        </Button>
      </div>
    </div>
  );
}
