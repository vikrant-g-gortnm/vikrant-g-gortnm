import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { presentationPut } from "private/Apollo/Mutations";
import { presentationsGet } from "private/Apollo/Queries";
import { Button, Card, Table, Modal } from "Components/elements";
import moment from "moment";
import { omit } from "lodash";
import getCleanData from "../getCleanData";

export function ListOfSharings({
  connectionId,
  creativeId,
  presentations,
  isViewing,
  setIsViewing,
  defaultData,
}) {
  const [showModal, setShowModal] = useState(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const [mutate] = useMutation(presentationPut);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onDelete = async id => {
    let variables = {
      id: id,
      delete: true,
    };
    try {
      setIsDeleting(true);
      await mutate({
        variables,
        update: proxy => {
          const data = proxy.readQuery({
            query: presentationsGet,
            variables: { connectionId },
          });
          proxy.writeQuery({
            query: presentationsGet,
            variables: { connectionId },
            data: {
              presentationsGet: data.presentationsGet.filter(
                pres => pres.id !== id
              ),
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }

    setIsDeleting(false);
    setShowDeleteModal(undefined);
    setIsViewing(undefined);
  };

  const onSubmit = async ({ email }, event) => {
    let data = showModal.new ? defaultData : showModal;

    let variables = {
      input: {
        connectionId,
        creativeId,
        ...omit(data, ["id", "sharedBy", "createdAt", "seen", "opened"]),
        email,
      },
    };

    try {
      await mutate({
        variables,
        update: (proxy, { data: presentationPut }) => {
          const data = proxy.readQuery({
            query: presentationsGet,
            variables: { connectionId },
          });
          proxy.writeQuery({
            query: presentationsGet,
            variables: { connectionId },
            data: {
              presentationsGet: [
                ...data.presentationsGet,
                presentationPut.presentationPut,
              ],
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }

    setIsViewing(email);
    setShowModal(undefined);
    event.target = "";
  };

  const columns = [
    {
      title: "",
      // dataIndex: "id",
      key: "delete",
      width: 50,
      className: "delete_bucket",
      render: ({ id, email }) => {
        return (
          <span>
            <i
              className="fal fa-trash-alt"
              onClick={() => setShowDeleteModal({ id, email })}
            />
          </span>
        );
      },
    },
    {
      title: "Shared with",
      dataIndex: "email",
      key: "name",
      render: email => (
        <div
          style={{
            width: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {email}
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: "md",
      render: createdAt => <span>{moment(createdAt).format("ll")}</span>,
    },
    {
      title: "Last opened",
      dataIndex: "opened",
      key: "opened",
      responsive: "sm",
      render: opened => {
        if (!opened) {
          return (
            <span style={{ color: "var(--color-gray-light)" }}>never</span>
          );
        }
        return <span>{moment(opened).format("lll")}</span>;
      },
    },
    {
      title: "Select",
      dataIndex: "email",
      key: "view",
      width: 110,
      render: email => (
        <Button
          size="small"
          buttonStyle={isViewing !== email && "secondary"}
          onClick={() => setIsViewing(email)}
          style={{ width: "100%" }}
        >
          {isViewing !== email ? "Select" : "Selected"}
        </Button>
      ),
    },
    {
      title: "Duplicate",
      key: "duplicate",
      width: 100,
      responsive: "md",
      render: presentation => (
        <Button
          size="small"
          buttonStyle="secondary"
          onClick={() => setShowModal(getCleanData(presentation))}
          iconClass="fal fa-copy"
        >
          Duplicate
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card label="SHARING" noMargin={true}>
        <Table
          loading={!presentations}
          dataSource={(presentations || [])
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
          top: "-20px",
        }}
      >
        <span />
        <Button
          onClick={() => setShowModal({ new: true })}
          type="right_arrow"
          size="large"
        >
          Share with new person
        </Button>
      </div>

      {showDeleteModal && (
        <Modal
          title="Delete sharing"
          close={() => setShowDeleteModal(undefined)}
          disableFoot={true}
        >
          <div style={{ padding: "20px 0px " }}>
            Are you sure you want to delete your sharing with{" "}
            <span
              style={{
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-primary)",
              }}
            >
              {showDeleteModal.email}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              size="medium"
              buttonStyle="secondary"
              onClick={() => setShowDeleteModal(undefined)}
            >
              Cancel
            </Button>
            <Button
              size="medium"
              loading={isDeleting}
              onClick={() => {
                onDelete(showDeleteModal.id);
              }}
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal
          title={
            showModal.new
              ? "Create presentation"
              : `Duplicate from ${showModal.email}`
          }
          close={() => setShowModal(undefined)}
          disableFoot={true}
        >
          <div style={{ fontSize: "14px" }}>
            <div style={{ padding: "10px 0px" }}>
              We will not send any automatic emails from this page, but we need
              the email to who you want to share with in order to create a
              unique link 🎉
            </div>
            <div style={{ padding: "10px 0px" }}>
              You can preview the presentation by clicking the link at the
              bottom of the page. When you are ready you can share that link.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <input
              type="text"
              placeholder="email"
              autoComplete="off"
              ref={register({ required: true })}
              id="email"
              name="email"
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span />

              <Button type="submit" size="medium" loading={isSubmitting}>
                Start
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
