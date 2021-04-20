import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { EvaluationRequest } from "./EvaluationRequest";
import { evaluationTemplatesGet } from "private/Apollo/Queries";
import { Button, Table, Modal } from "Components/elements";
import { startup_page } from "definitions.js";

export default function NewEvaluationLogic({ connection, history }) {
  let evaluations = connection.evaluations || [];
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  let templates =
    evaluationTemplatesQuery?.data?.accountGet?.evaluationTemplates || [];

  let groupsWithTemplates = [];

  async function selectTemplate({ templateId, name, description }) {
    let path =
      `${startup_page}/${connection.id}/evaluationV2` +
      `/template/${templateId}`;
    history.push(path);
  }

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
            type="right_arrow"
            size="small"
            onClick={() => {
              let haveUsedThisTemplateBefore = evaluations.some(
                evaluation => evaluation.templateId === templateId
              );

              if (!haveUsedThisTemplateBefore) {
                selectTemplate({ templateId, name, description });
              } else {
                setShowConfirmModal({ templateId, name, description });
                setShowModal(false);
              }
            }}
          >
            use
          </Button>
        );
      },
    },
  ];

  return (
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button
          type={
            (evaluations.length && !groupsWithTemplates.length) ||
            groupsWithTemplates.length ||
            connection.sharedWithMe?.length
              ? "just_text"
              : "right_arrow"
          }
          size="small"
          onClick={() => setShowModal(true)}
        >
          + new evaluation
        </Button>
      </div>

      <EvaluationRequest connection={connection} />

      {showModal && (
        <Modal
          title="Evaluate startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <div style={{ padding: "10px 0px 0px 8px" }}>
            <Table
              dataSource={templates}
              columns={columns}
              disableHead={true}
              pagination={false}
            />
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => setShowModal(false)}
            >
              cancel
            </Button>
          </div>
        </Modal>
      )}

      {showConfirmModal && (
        <Modal
          title="Evaluate startup"
          close={() => {
            setShowConfirmModal(undefined);
            setShowModal(true);
          }}
          disableFoot={true}
        >
          <div
            style={{
              padding: "10px 0px 0px 8px",
              fontSize: "16px",
              lineHeight: 2,
            }}
          >
            <span>
              You have already evaluated this startup using this template. You
              can edit evaluation, or create a new one by clicking "USE".
            </span>
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
              textAlign: "right",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => {
                setShowConfirmModal(undefined);
                setShowModal(true);
              }}
            >
              cancel
            </Button>

            <Button
              type="right_arrow"
              size="medium"
              onClick={() => selectTemplate(showConfirmModal)}
            >
              use
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
