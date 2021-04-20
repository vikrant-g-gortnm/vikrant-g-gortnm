import React, { useState } from "react";
import { Card, Button, Modal, SuccessBox } from "Components/elements";

import { useForm } from "react-hook-form";
import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";
import EditQuestion from "../EditQuestion";
import classnames from "classnames";
import { useMutation } from "@apollo/client";
import { creativeTemplatePut } from "private/Apollo/Mutations";
import { omit } from "lodash";

import {
  list_order,
  list_order_button,
  order_up,
  order_down,
  option_delete_container,
} from "../EditQuestion.module.css";

import styles from "./TemplatePreview.module.css";

function CompanyName({ creative }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data, event) => {};
  return (
    <form className="focus_form mb3" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        className="form_h1"
        rows={1}
        placeholder="Your company name"
        name="input.name"
        ref={register}
        onBlur={e => {}}
      />
    </form>
  );
}

export function Section({ section, template, updateTemplate }) {
  const { name, questions } = section;
  const [isEditingQuestion, setIsEditionQuestion] = useState({});
  const [editSectionMeta, setEditSectionMeta] = useState(undefined);
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    let params = {
      templateId: template.id,
      sectionId: section.id,
      section: {
        ...section,
        ...data,
      },
    };
    updateTemplate(params);
    setEditSectionMeta(undefined);
  }

  return (
    <div>
      <div
        style={{
          marginTop: "30px",
          fontSize: "28px",
          position: "relative",
          bottom: "-8px",
          color: "var(--color-secondary)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {!section.questions.length && (
            <div
              style={{
                display: "inline-block",
                fontSize: "24px",
                marginRight: "10px",
              }}
              className={option_delete_container}
              onClick={() => {
                let params = {
                  templateId: template.id,
                  sections: template.sections
                    .filter(s => s.id !== section.id)
                    .map(s => ({
                      ...s,
                      index: s.index >= section.index ? s.index : s.index - 1,
                    })),
                };
                updateTemplate(params);
              }}
            >
              <i className="fal fa-trash-alt" />
            </div>
          )}
          {name}{" "}
          {!section.noEdit && (
            <i
              style={{
                fontSize: "18px",
                cursor: "pointer",
              }}
              className="fal fa-pen"
              onClick={() => {
                setEditSectionMeta(section);
              }}
            />
          )}
        </span>

        <div
          style={{
            position: "relative",
            top: "-5px",
          }}
        >
          <Button
            buttonStyle="secondary"
            size="small"
            onClick={() => {
              let newId = `tmpID-${new Date().getTime()}`;

              let params = {
                templateId: template.id,
                sectionId: section.id,
                questions: [
                  {
                    index: 0,
                    id: newId,
                    name: "new question",
                    inputType: "INPUT_TEXT",
                    options: [],
                  },
                  ...section.questions.map(q => ({
                    ...q,
                    index: q.index + 1,
                  })),
                ],
              };

              setIsEditionQuestion({ [newId]: true });
              updateTemplate(params);
            }}
          >
            + new question
          </Button>
        </div>
      </div>

      {questions.map((question, i) => (
        <Question
          key={`q-${i}`}
          question={question}
          section={section}
          template={template}
          updateTemplate={updateTemplate}
          isEditingQuestion={isEditingQuestion}
          setIsEditionQuestion={setIsEditionQuestion}
        />
      ))}

      {editSectionMeta && (
        <Modal
          title="Edit section name"
          close={() => setEditSectionMeta(undefined)}
          disableFoot={true}
        >
          <div>
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt3">
                <input
                  type="text"
                  placeholder="Section title"
                  autoComplete="off"
                  defaultValue={editSectionMeta.name}
                  ref={register}
                  name="name"
                />

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    buttonStyle="secondary"
                    size="medium"
                    onClick={() => setEditSectionMeta(undefined)}
                  >
                    Cancel
                  </Button>

                  <Button type="input" value="Save" />
                </div>
              </div>
            </form>
          </div>

          <div
            className={list_order}
            style={{
              textAlign: "right",
              width: "100%",
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid var(--color-gray-light)",
            }}
          >
            <div
              className={classnames(list_order_button, order_up)}
              style={{
                opacity: editSectionMeta.index === 0 ? 0.2 : 1,
              }}
              onClick={() => {
                let params = {
                  templateId: template.id,
                  sectionId: editSectionMeta.id,
                  sections: template.sections
                    .map(s => {
                      if (editSectionMeta.index === 0) return s;
                      if (s.id === editSectionMeta.id) {
                        let item = {
                          ...s,
                          index: editSectionMeta.index - 1,
                        };
                        setEditSectionMeta(item);

                        return item;
                      }
                      if (s.index === editSectionMeta.index - 1) {
                        let item = {
                          ...s,
                          index: s.index + 1,
                        };
                        return item;
                      }
                      return s;
                    })
                    .sort((a, b) => a.index - b.index),
                };
                updateTemplate(params);
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  position: "relative",
                  top: "-6px",
                  right: "9px",
                }}
              >
                move section up
              </span>
              <i className="fas fa-arrow-alt-circle-up" />
            </div>

            <div
              className={classnames(list_order_button, order_down)}
              style={{
                opacity:
                  editSectionMeta.index === template.sections.length - 1
                    ? 0.2
                    : 1,
              }}
              onClick={() => {
                let params = {
                  templateId: template.id,
                  sectionId: editSectionMeta.id,
                  sections: template.sections
                    .map(s => {
                      if (
                        editSectionMeta.index ===
                        template.sections.length - 1
                      )
                        return s;
                      if (s.id === editSectionMeta.id) {
                        let item = {
                          ...s,
                          index: editSectionMeta.index + 1,
                        };
                        setEditSectionMeta(item);
                        return item;
                      }
                      if (s.index === editSectionMeta.index + 1) {
                        return {
                          ...s,
                          index: s.index - 1,
                        };
                      }
                      return s;
                    })
                    .sort((a, b) => a.index - b.index),
                };
                updateTemplate(params);
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  position: "relative",
                  top: "-6px",
                  right: "9px",
                }}
              >
                move section down
              </span>
              <i className="fas fa-arrow-alt-circle-down" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Question({
  question,
  section,
  template,
  updateTemplate,
  isEditingQuestion,
  setIsEditionQuestion,
}) {
  return (
    <Card style={{ marginBottom: "10px", paddingBottom: "15px" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        {!question.noEdit && (
          <Button
            type="just_text"
            onClick={() =>
              setIsEditionQuestion({
                [question.id]: !isEditingQuestion[question.id],
              })
            }
          >
            {isEditingQuestion[question.id] ? "preview" : "edit"}
          </Button>
        )}

        {question.noEdit && (
          <div className={styles.noEdit}>you cannot edit this</div>
        )}
      </div>

      {!isEditingQuestion[question.id] && (
        <div>
          <div className="form_h2">{question.name}</div>

          <div className="form_p2">{question.description}</div>
          <hr />
          <div className="p1">
            <GeneralInput question={question} section={section} />
          </div>
          <CommentSection question={question} section={section} />
        </div>
      )}

      {isEditingQuestion[question.id] && (
        <EditQuestion
          template={template}
          question={question}
          section={section}
          updateTemplate={updateTemplate}
        />
      )}
    </Card>
  );
}

function TemplateHeader({ template, updateTemplate }) {
  const [invitedView, setInvitedView] = useState(true);
  const [editMessage, setEditMessage] = useState(undefined);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data, event) => {
    updateTemplate({
      templateId: template.id,
      [editMessage]: data.name,
    });
    setEditMessage(undefined);
  };

  return (
    <div>
      <div>
        <Button
          size="small"
          buttonStyle={invitedView ? "primary" : "secondary"}
          onClick={() => setInvitedView(true)}
        >
          {invitedView ? (
            <i className="fas fa-eye" />
          ) : (
            <i className="fas fa-eye-slash"></i>
          )}
          <span> Header message for invited startup form</span>
        </Button>
        <Button
          size="small"
          buttonStyle={invitedView ? "secondary" : "primary"}
          onClick={() => setInvitedView(false)}
        >
          {invitedView ? (
            <i className="fas fa-eye-slash"></i>
          ) : (
            <i className="fas fa-eye" />
          )}
          <span> Header message on public web form</span>
        </Button>
      </div>

      <div className={styles.header_message}>
        {(invitedView && <span>{template.headerMessageInvited} </span>) || (
          <span>{template.headerMessageWebForm} </span>
        )}

        <Button
          type="just_text"
          onClick={() =>
            setEditMessage(
              invitedView ? "headerMessageInvited" : "headerMessageWebForm"
            )
          }
        >
          edit
        </Button>
      </div>

      {editMessage && (
        <Modal
          title="Edit success message"
          close={() => setEditMessage(undefined)}
          disableFoot={true}
        >
          <div>
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt3">
                <textarea
                  type="text"
                  placeholder="Success message"
                  autoComplete="off"
                  rows={7}
                  style={{
                    resize: "none",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                  defaultValue={template[editMessage]}
                  ref={register}
                  name="name"
                  onBlur={e => {}}
                />

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    buttonStyle="secondary"
                    size="medium"
                    onClick={() => setEditMessage(undefined)}
                  >
                    Cancel
                  </Button>
                  <Button type="input" value="ok" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TemplateSuccessMessage({ template, updateTemplate }) {
  const [invitedView, setInvitedView] = useState(true);
  const [editMessage, setEditMessage] = useState(undefined);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data, event) => {
    updateTemplate({
      templateId: template.id,
      [editMessage]: data.name,
    });
    setEditMessage(undefined);
  };

  return (
    <div>
      <div style={{ marginTop: "50px" }}>
        <div style={{ marginBottom: "10px" }}>
          <Button
            size={"small"}
            buttonStyle={invitedView ? "primary" : "secondary"}
            onClick={() => setInvitedView(true)}
          >
            {invitedView ? (
              <i className="fas fa-eye" />
            ) : (
              <i className="fas fa-eye-slash"></i>
            )}
            <span> Success message for invited startup form</span>
          </Button>
          <Button
            size={"small"}
            buttonStyle={invitedView ? "secondary" : "primary"}
            onClick={() => setInvitedView(false)}
          >
            {invitedView ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye" />
            )}
            <span> Success message on public web form</span>
          </Button>
        </div>

        <SuccessBox>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {invitedView
              ? template.successMessageInvited
              : template.successMessageWebForm}
          </div>
        </SuccessBox>

        <div className="text-right">
          <Button
            type="just_text"
            onClick={() =>
              setEditMessage(
                invitedView ? "successMessageInvited" : "successMessageWebForm"
              )
            }
          >
            edit
          </Button>
        </div>
      </div>

      {editMessage && (
        <Modal
          title="Edit success message"
          close={() => setEditMessage(undefined)}
          disableFoot={true}
        >
          <div>
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt3">
                <textarea
                  type="text"
                  placeholder="Success message"
                  autoComplete="off"
                  rows={7}
                  style={{
                    resize: "none",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                  defaultValue={template[editMessage]}
                  ref={register}
                  name="name"
                  onBlur={e => {}}
                />

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    buttonStyle="secondary"
                    size="medium"
                    onClick={() => setEditMessage(undefined)}
                  >
                    Cancel
                  </Button>
                  <Button type="input" value="ok" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function TemplatePreview({ template, setTemplate }) {
  const { sections } = template;
  const [mutate, { loading }] = useMutation(creativeTemplatePut);
  const { register, handleSubmit } = useForm();
  const [newSection, setNewSection] = useState(false);
  const [success, setSuccess] = useState(false);

  function onSubmit(data) {
    let sections = [
      {
        name: data.name,
        index: 0,
        id: `newId-${new Date().getTime()}`,
        questions: [],
      },
      ...template.sections.map(s => ({ ...s, index: s.index + 1 })),
    ];

    updateTemplate({
      templateId: template.id,
      sections,
    });

    setNewSection(false);
  }

  function getCleanFields(item) {
    let cleanFields = {};
    for (let k in item) {
      if (
        item[k] &&
        (typeof item[k] === "string" || typeof item[k] === "boolean") &&
        k !== "__typename"
      ) {
        cleanFields[k] = item[k];
      }
    }
    return cleanFields;
  }

  function getCleanTemplate() {
    return {
      ...omit(getCleanFields(template), ["id"]),
      sections: (template.sections || []).map(section => ({
        ...getCleanFields(section),
        questions: (section.questions || []).map(question => ({
          ...getCleanFields(question),
          options: (question.options || []).map(option => ({
            ...getCleanFields(option),
          })),
        })),
      })),
    };
  }

  function updateTemplate(data) {
    if (data.headerMessageInvited) {
      let newTemplate = {
        ...template,
        headerMessageInvited: data.headerMessageInvited,
      };
      setTemplate(newTemplate);
    }

    if (data.headerMessageWebForm) {
      let newTemplate = {
        ...template,
        headerMessageWebForm: data.headerMessageWebForm,
      };
      setTemplate(newTemplate);
    }

    if (data.successMessageInvited) {
      let newTemplate = {
        ...template,
        successMessageInvited: data.successMessageInvited,
      };
      setTemplate(newTemplate);
    }

    if (data.successMessageWebForm) {
      let newTemplate = {
        ...template,
        successMessageWebForm: data.successMessageWebForm,
      };
      setTemplate(newTemplate);
    }

    if (data.section) {
      let newTemplate = {
        ...template,
        sections: template.sections.map(section =>
          section.id === data.section.id ? data.section : section
        ),
      };
      setTemplate(newTemplate);
    }

    if (data.sections) {
      let newTemplate = {
        ...template,
        sections: data.sections,
      };
      setTemplate(newTemplate);
    }

    if (data.question) {
      let newTemplate = {
        ...template,
        sections: template.sections.map(section =>
          section.id !== data.sectionId
            ? section
            : {
                ...section,
                questions: section.questions.map(question =>
                  question.id !== data.question.id ? question : data.question
                ),
              }
        ),
      };
      setTemplate(newTemplate);
    }

    if (data.questions) {
      let newTemplate = {
        ...template,
        sections: sections.map(section => {
          let questions =
            section.id === data.sectionId ? data.questions : section.questions;
          return {
            ...section,
            questions,
          };
        }),
      };
      setTemplate(newTemplate);
    }
  }

  return (
    <div>
      <TemplateHeader template={template} updateTemplate={updateTemplate} />

      <CompanyName />

      <div
        style={{
          marginTop: "40px",
        }}
      >
        <Button
          size="medium"
          buttonStyle={"secondary"}
          onClick={() => setNewSection(true)}
        >
          + create new section
        </Button>
      </div>

      {sections.map((section, i) => (
        <Section
          key={`section-${i}`}
          section={section}
          template={template}
          updateTemplate={updateTemplate}
        />
      ))}

      <TemplateSuccessMessage
        template={template}
        updateTemplate={updateTemplate}
      />

      <div
        style={{
          textAlign: "right",
          marginTop: "50px",
        }}
      >
        <Button
          size="large"
          type="right_arrow"
          loading={loading}
          onClick={async () => {
            if (loading) return;
            setSuccess(false);
            let cleanTemplate = getCleanTemplate();
            let variables = {
              input: cleanTemplate,
            };
            try {
              await mutate({ variables });
              setSuccess(true);
            } catch (error) {
              console.log("error");
            }
          }}
        >
          Save
        </Button>

        {success && (
          <div
            style={{
              color: "green",
              fontSize: "12px",
              position: "relative",
              top: "5px",
              right: "6px",
              opacity: 0.75,
            }}
          >
            template successfully saved
          </div>
        )}
      </div>

      {newSection && (
        <Modal
          title="Edit section name"
          close={() => setNewSection(undefined)}
          disableFoot={true}
        >
          <div>
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt3">
                <input
                  type="text"
                  placeholder="Section title"
                  autoComplete="off"
                  // defaultValue={editSectionMeta.name}
                  ref={register}
                  name="name"
                />

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    buttonStyle="secondary"
                    size="medium"
                    onClick={() => setNewSection(undefined)}
                  >
                    Cancel
                  </Button>

                  <Button type="input" value="Save" />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
