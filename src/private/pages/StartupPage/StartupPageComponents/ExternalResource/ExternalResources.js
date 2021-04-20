import React, { useEffect, useState } from "react";

//API
import { useLazyQuery } from "@apollo/client";
import { externalResourcesGet } from "private/Apollo/Queries";

//Components
import { Button, Card, Table } from "Components/elements";
import { AddExternalResource } from "./AddExternalResource";
import { DeleteExternalResource } from "./DeleteExternalResource";

//Helpers
import moment from "moment";

//styles
import styles from "./ExternalResources.module.css";

//Main Function
export function ExternalResources({ connectionId }) {
  //states
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState(undefined);

  //Queries
  const [getExternalResources, { data, loading }] = useLazyQuery(
    externalResourcesGet
  );

  //Execute Queries
  useEffect(() => {
    if (connectionId) {
      getExternalResources({
        variables: { connectionId },
      });
    }
  }, [connectionId]);

  //Defined Data
  let externalResources = data?.externalResourcesGet || [];

  //Table Columns
  const columns = [
    {
      title: "",
      // dataIndex: "id",
      key: "delete",
      width: 45,
      className: "delete_bucket",
      render: ({ id }) => {
        return (
          <span>
            <i
              className={"fal fa-trash-alt"}
              onClick={() => setDeleteResourceId(id)}
            />
          </span>
        );
      },
    },
    {
      title: "Label",
      // dataIndex: "email",
      key: "label",
      render: ({ label, url }) => {
        return (
          <div className={styles.link}>
            <a href={url} target={"_blank"} rel="noopener noreferrer">
              {label}
            </a>
          </div>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: "sm",
      width: 250,
      render: createdAt => <span>{moment(createdAt).format("lll")}</span>,
    },
  ];

  return (
    <div>
      <Card label={"EXTERNAL RESOURCES"} noMargin={true}>
        <Table
          loading={loading}
          dataSource={externalResources
            .filter(x => x)
            .sort((a, b) => b.createdAt - a.createdAt)}
          columns={columns}
          disableHead={false}
          pagination={false}
        />
      </Card>

      {/* Button to add New Resource */}
      <div className={styles.resource_button}>
        <span />
        <Button
          type="right_arrow"
          size="small"
          onClick={() => {
            setShowAddModal(true);
          }}
        >
          Add new resource
        </Button>
      </div>

      {/* Delete Resource  */}
      {deleteResourceId && (
        <DeleteExternalResource
          close={() => setDeleteResourceId(undefined)}
          resourceId={deleteResourceId}
          connectionId={connectionId}
        />
      )}

      {/* Add Resource */}
      {showAddModal && (
        <AddExternalResource
          close={() => setShowAddModal(false)}
          connectionId={connectionId}
        />
      )}
    </div>
  );
}
