import React, { useState } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import { evaluationTemplateNamesGet } from "private/Apollo/Queries";
import { evaluationPut } from "private/Apollo/Mutations";

import { startup_page } from "definitions.js";

import { Button, Table, Modal } from "Components/elements";

import { spinner_class } from "./Connections.module.css";

export const EvaluateSelector = ({ connection, close, history }) => {
  const [currentLoading, setCurrentLoading] = useState("");
  // const [showModal, setShowModal] = useState(false);

  let { data } = useQuery(evaluationTemplateNamesGet);
  const [mutate, { loading: mutateLoading }] = useMutation(evaluationPut);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "use",
      width: 30,
      render: ({ id: templateId, name, description }) => {
        return (
          <Button
            size="small"
            onClick={async () => {
              setCurrentLoading(templateId);
              try {
                let res = await mutate({
                  variables: {
                    connectionId: connection.id,
                    input: { templateId, name, description },
                  },
                });
                let evaluation = res.data.evaluationPut;
                let template = data.accountGet.evaluationTemplates.find(
                  ({ id }) => id === evaluation.templateId
                );
                let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${template.sections[0].id}`;
                history.push(path);
              } catch (error) {
                console.log("error", error);
              }
              setCurrentLoading("");
            }}
            loading={mutateLoading && currentLoading === templateId}
          >
            use
          </Button>
        );
      },
    },
  ];

  return (
    <Modal title="Evaluate startup" close={close}>
      {(!data && (
        <div className={spinner_class}>
          <i className="fa fa-spinner fa-spin" />
        </div>
      )) || (
        <div style={{ padding: "10px 0px 0px 8px" }}>
          <Table
            dataSource={data.accountGet.evaluationTemplates}
            columns={columns}
            disableHead={true}
            pagination={false}
          />
        </div>
      )}
    </Modal>
  );
};

export default EvaluateSelector;
