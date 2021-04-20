import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { evaluationTemplateGet } from "private/Apollo/Queries";

import {
  // evaluationTemplatePut,
  evaluationTemplateSectionPut,
  evaluationTemplateSectionDelete,
} from "private/Apollo/Mutations";
import {
  settings,
  evaluation_template,
  evaluation_templates,
} from "definitions.js";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";

import TemplateInfo from "./TemplateInfo";

import { delete_bucket } from "./EvaluationTemplate.module.css";
import tableStyles from "../../../../Components/elements/NotataComponents/Table.module.css";

// function NameAndDescription({ template }) {
//   const [mutate] = useMutation(evaluationTemplatePut);
//   const { name, description } = template;

//   const { register, handleSubmit, setValue } = useForm();

//   useEffect(() => {
//     setValue("input.name", name);
//     setValue("input.description", description);
//   });

//   const onSubmit = async (data, event) => {
//     let variables = {
//       id: template.id,
//       ...data,
//     };
//     try {
//       await mutate({
//         variables,
//         optimisticResponse: {
//           __typename: "Mutation",
//           evaluationTemplatePut: {
//             ...template,
//             ...data.input,
//           },
//         },
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <form
//       className="focus_form mb3"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <textarea
//         className="form_h1"
//         rows={1}
//         placeholder='I.e. "Early stage evaluations"'
//         name="input.name"
//         ref={register}
//         onBlur={handleSubmit(onSubmit)}
//       />

//       <textarea
//         className="form_p1"
//         rows={1}
//         placeholder='I.e. "Template for evaluating early stage startups"'
//         name="input.description"
//         ref={register}
//         onBlur={handleSubmit(onSubmit)}
//       />
//     </form>
//   );
// }

function AddNewSection({ id, setShowModal }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(name, event) {
    try {
      await mutate({
        variables: {
          templateId: id,
          input: name,
        },
        update: (proxy, { data: evaluationTemplateSectionPut }) => {
          const data = proxy.readQuery({
            query: evaluationTemplateGet,
            variables: { id },
          });

          proxy.writeQuery({
            query: evaluationTemplateGet,
            variables: { id },
            data: {
              evaluationTemplateGet: {
                ...data.evaluationTemplateGet,
                sections: [
                  evaluationTemplateSectionPut,
                  ...data.evaluationTemplateGet.sections,
                ],
              },
            },
          });
        },
      });

      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt3">
        <input
          type="text"
          placeholder='I.e. "Team"'
          autoComplete="off"
          ref={register({ required: true })}
          name="name"
        />
      </div>

      <div
        style={{
          marginTop: "5px",
          textAlign: "right",
        }}
      >
        <Button type="input" value="OK" loading={isSubmitting} />
      </div>
    </form>
  );
}

function Delete({ sectionId, template }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateSectionDelete, {
    refetchQueries: [
      { query: evaluationTemplateGet, variables: { id: template.id } },
    ],
    awaitRefetchQueries: true,
  });

  let section = (template.sections || []).find(s => s.id === sectionId);

  return (
    <div
      onClick={() => {
        if (loading) return;
        if (section.questions.length) {
          return window.alert(
            "You have to delete all the questions in a section before you can delete the section"
          );
        }

        let variables = { id: sectionId };
        mutate({ variables });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

export default function EvaluationTemplate({ match, history }) {
  const [showModal, setShowModal] = useState(false);

  const id = match.params.id;
  const [getData, { data, loading, error }] = useLazyQuery(
    evaluationTemplateGet
  );

  let template = {};
  if (data) template = data.evaluationTemplateGet;

  useEffect(() => {
    if (id && id !== "new") {
      getData({ variables: { id } });
    }
  }, [getData, id]);

  if (error) throw error;

  if (loading && !data) {
    return <GhostLoader />;
  }

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 50,
      className: delete_bucket,
      render: sectionId => <Delete sectionId={sectionId} template={template} />,
    },

    {
      title: "Section name",
      dataIndex: "id",
      key: "name",
      render: sectionId => {
        let section =
          (template.sections || []).find(s => s.id === sectionId) || {};
        let questions = section.questions || [];

        let possibleScore = 0;
        for (let q of questions) {
          if (q.inputType === "TRAFFIC_LIGHTS") {
            possibleScore += 2;
          }

          if (q.inputType === "RADIO") {
            let max = Math.max.apply(
              Math,
              q.options.map(o => o.score || 0)
            );
            possibleScore += max;
          }

          if (q.inputType === "CHECK") {
            for (let o of q.options) {
              possibleScore += o.score;
            }
          }
        }

        return (
          <div>
            <div
              onClick={() => {
                let path = `${evaluation_template}/${id}/${sectionId}`;
                history.push(path);
              }}
              className={tableStyles.background_clicker}
            />

            <div
              className={tableStyles.actual_content}
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  maxWidth: "400px",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--color-secondary)",
                }}
              >
                {section.name}
              </div>
              <div style={{ opacity: 0.5, fontSize: "12px" }}>
                {questions.length} questions - {possibleScore} points
              </div>
            </div>
          </div>
        );
      },
    },

    // {
    //   title: "",
    //   dataIndex: "id",
    //   key: "section_button",
    //   width: 30,
    //   render: sectionId => {
    //     return (
    //       <Button
    //         // type="tiny_right"
    //         type="right_arrow"
    //         size="small"
    //         onClick={() => {
    //           let path = `${evaluation_template}/${id}/${sectionId}`;
    //           history.push(path);
    //         }}
    //       >
    //         View
    //       </Button>
    //     );
    //   },
    // },
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
            val: "Evaluation Templates",
            link: `${evaluation_templates}`,
          },
          {
            val: `Template: ${template.name}`,
            link: `${evaluation_template}/${id}`,
          },
        ]}
      />
      <Content maxWidth={780}>
        <TemplateInfo template={template} />

        <Card noMargin={true}>
          <Table
            dataSource={template.sections || []}
            columns={columns}
            pagination={false}
            loading={loading}
            disableHead={true}
          />
        </Card>

        <Button
          onClick={() => setShowModal(true)}
          type="right_arrow"
          size="large"
        >
          Create New Section
        </Button>

        {showModal && (
          <Modal
            title="New Section"
            close={() => setShowModal(false)}
            disableFoot={true}
          >
            <AddNewSection id={id} setShowModal={setShowModal} />
          </Modal>
        )}
      </Content>
    </>
  );
}
