import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";

import { delete_bucket } from "./EvaluationTemplates.module.css";

import { evaluationTemplatesGet } from "private/Apollo/Queries";

import {
  evaluationTemplatePut,
  evaluationTemplateDelete,
} from "private/Apollo/Mutations";

import {
  settings,
  evaluation_template,
  evaluation_templates,
} from "definitions.js";
import tableStyles from "Components/elements/NotataComponents/Table.module.css";

function Delete({ id, templates }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateDelete, {
    // refetchQueries: [{ query: accountGet }],
    refetchQueries: [{ query: evaluationTemplatesGet }],
    awaitRefetchQueries: true,
  });

  let template = (templates || []).find(t => t.id === id);

  return (
    <div
      onClick={() => {
        if (loading) return;
        if (template && template.sections && template.sections.length) {
          return window.alert(
            "You have to delete all the section before you can delete the template"
          );
        }
        let variables = { id };
        mutate({ variables });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

const CreateNewTemplate = ({ setShowModal }) => {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async ({ variables }, event) => {
    try {
      await mutate({
        variables,
        update: (proxy, { data: { evaluationTemplatePut } }) => {
          const data = proxy.readQuery({
            query: evaluationTemplatesGet,
          });
          proxy.writeQuery({
            query: evaluationTemplatesGet,
            data: {
              accountGet: {
                ...data.accountGet,
                evaluationTemplates: [
                  evaluationTemplatePut,
                  ...data.accountGet.evaluationTemplates,
                ],
              },
            },
          });
        },
      });

      setShowModal(false);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt3">
        <input
          type="text"
          placeholder={`I.e. "Early Stage Companies"`}
          autoComplete="off"
          ref={register({ required: true })}
          name="variables.input.name"
        />

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default function EvaluationTemplates(props) {
  const [showModal, setShowModal] = useState(false);
  const { data, loading, error } = useQuery(evaluationTemplatesGet);

  if (error) throw error;

  let templates;
  if (data) {
    let { evaluationTemplates } = data.accountGet;
    templates = evaluationTemplates;
  }

  if (loading && !data) return <GhostLoader />;

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 50,
      className: delete_bucket,
      render: id => <Delete id={id} templates={templates} />,
    },

    {
      title: "Template name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let template = templates.find(t => t.id === id) || {};
        let { name, sections } = template;

        return (
          <div>
            <div
              onClick={() => {
                let path = `${evaluation_template}/${id}`;
                props.history.push(path);
              }}
              className={tableStyles.background_clicker}
            />

            <div
              className={tableStyles.actual_content}
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  color: "var(--color-secondary)",
                  fontWeight: "var(--font-weight-bold)",
                }}
              >
                {name}
              </div>
              <div style={{ opacity: 0.5, fontSize: "12px" }}>
                {(sections || []).length} sections
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Evaluation templates",
            link: `${evaluation_templates}`,
          },
        ]}
      />
      <Content maxWidth={780}>
        <h1>Evaluation templates</h1>

        <Card noMargin={true}>
          <Table
            dataSource={templates || []}
            columns={columns}
            loading={loading}
            disableHead={true}
          />
        </Card>

        <Button
          onClick={() => setShowModal(true)}
          type="right_arrow"
          size="large"
        >
          New Evaluation Template
        </Button>

        {showModal && (
          <Modal
            title="New Evaluation Template"
            close={() => setShowModal(false)}
            disableFoot={true}
          >
            <CreateNewTemplate setShowModal={setShowModal} />
          </Modal>
        )}
      </Content>
    </>
  );
}
