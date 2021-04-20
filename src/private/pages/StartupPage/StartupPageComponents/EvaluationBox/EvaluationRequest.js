import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { evaluationTemplatesGet } from "private/Apollo/Queries";
import { public_evaluation } from "definitions.js";
import { Button, Table, Modal, SuccessBox } from "Components/elements";

export function EvaluationRequest({ connection }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(undefined);
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  const publicLink = `${window.location.protocol}//${window.location.host}${public_evaluation}/${connection?.id}/${connection?.creative.id}/${showConfirmModal?.templateId}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(publicLink);
    setCopySuccess(true);
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
              setShowConfirmModal({ templateId, name, description });
              setShowModal(false);
            }}
          >
            use
          </Button>
        );
      },
    },
  ];

  let templates = [];

  if (!evaluationTemplatesQuery.loading && evaluationTemplatesQuery.data) {
    templates =
      evaluationTemplatesQuery.data.accountGet.evaluationTemplates || [];
  }
  if (!connection) return <span />;

  return (
    <>
      <div
        style={{
          // marginTop: "-35px",
          // textAlign: "right",
          float: "right",
          marginTop: "50px",
        }}
      >
        <Button
          type="just_text"
          size="small"
          onClick={() => setShowModal(true)}
        >
          request evaluation
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Request Evaluation"
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
          title="Request Evaluation"
          close={() => setShowConfirmModal(false)}
          disableFoot={true}
        >
          <div>
            Here is a public link you can share with people, so that you can
            collect their evaluations. They don't need to sign up to notata to
            use this link.
          </div>

          <div
            style={{
              padding: "10px 0px",
            }}
          >
            <SuccessBox
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-secondary)",
              }}
            >
              <a href={publicLink} target="_blank" rel="noopener noreferrer">
                {publicLink}
              </a>
            </SuccessBox>

            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={copyToClipboard}
            >
              {copySuccess ? "link copied to clipboard" : "copy link"}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
