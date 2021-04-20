import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import {
  tag_list,
  question_footer,
  hr,
  list_order,
  list_order_button,
  order_up,
  order_down,
  option_dashed_container,
  option_radio_check,
  option_right_container,
  option_delete_container,
  option_traffic_light_points,
  option_save,
} from "./EditQuestion.module.css";

import { Tag, SimpleInputForm, InputTrafficLight } from "Components/elements";

const inputMap = [
  {
    label: "multiple choice",
    val: "CHECK",
  },
  {
    label: "single answer",
    val: "RADIO",
  },
  {
    label: "free text",
    val: "INPUT_TEXT",
  },
  {
    label: "text lines",
    val: "INPUT_MUTLIPLE_LINES",
  },
];

function QuestionNameAndDescription({
  templateId,
  sectionId,
  question,
  updateTemplate,
}) {
  const { register, handleSubmit, setValue } = useForm();

  const { name, description } = question;

  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  }, [description, name, setValue]);

  const onSubmit = async (data, event) => {
    let params = {
      templateId,
      sectionId,
      question: {
        ...question,
        ...data.input,
      },
    };
    updateTemplate(params);
  };

  return (
    <form className="focus_form" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        className="form_h2"
        placeholder="Question name"
        rows={1}
        name="input.name"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />

      <textarea
        className="form_p2"
        placeholder='I.e. "Template for evaluating early stage startups"'
        rows={1}
        name="input.description"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

function ToggleInputType({ templateId, sectionId, question, updateTemplate }) {
  return (
    <div className={tag_list}>
      {inputMap.map((inp, i) => {
        return (
          <Tag
            key={`toggle-${i}`}
            active={question.inputType === inp.val}
            isButton={true}
            onClick={() => {
              let params = {
                templateId,
                sectionId,
                question: {
                  ...question,
                  inputType: inp.val,
                },
              };
              updateTemplate(params);
            }}
          >
            {inp.label}
          </Tag>
        );
      })}
    </div>
  );
}

function TrafficLightOption() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {["red", "yellow", "green"].map((color, i) => (
          <div>
            <InputTrafficLight
              key={`traffic-${color}-${i}`}
              active={false}
              onClick={() => {}}
              color={color}
            />
            <div className={option_traffic_light_points}>
              {color === "red" && <span>0 points</span>}
              {color === "yellow" && <span>1 points</span>}
              {color === "green" && <span>2 points</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InputTextOption() {
  return (
    <form className="notata_form" onSubmit={e => e.preventDefault()}>
      <textarea
        rows={7}
        style={{ resize: "none" }}
        placeholder="Say something..."
      />
    </form>
  );
}

function InputTextLinesOption() {
  return (
    <form className="notata_form" onSubmit={e => e.preventDefault()}>
      <div style={{ position: "relative" }}>
        <input
          style={{
            color: "var(--color-primary)",
            marginBottom: "10px",
          }}
          type="text"
          placeholder="say something"
          // value="https://notata.io"
          onChange={() => {
            /* do nothing */
          }}
        />
        <i
          className="fal fa-times"
          style={{
            position: "absolute",
            right: "12px",
            fontSize: "28px",
            color: "var(--color-gray-light)",
            top: "11px",
          }}
        />
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="New line..."
          value=""
          onChange={() => {
            /* do nothing */
          }}
        />
        <i
          className="fas fa-plus-circle"
          style={{
            position: "absolute",
            right: "4px",
            fontSize: "30px",
            color: "var(--color-gray-light)",
            top: "10px",
          }}
        />
      </div>
    </form>
  );
}

function RadioOption({
  question,
  sectionId,
  templateId,
  inputType,
  updateTemplate,
}) {
  return (
    <div>
      {question.options.map((option, i) => {
        return (
          <div key={`option-${i}`} className={option_dashed_container}>
            <input
              className={option_radio_check}
              type={inputType.toLowerCase()}
              name={`option-${i}`}
              disabled
            />

            <SimpleInputForm
              placeholder="option name..."
              val={option.val}
              submit={({ input_val }) => {
                let oldVal = (question.options[i] || {}).val;
                if (input_val === oldVal) return;
                let params = {
                  templateId,
                  sectionId,
                  question: {
                    ...question,
                    options: question.options.map(o =>
                      o.sid !== option.sid ? o : { ...o, val: input_val }
                    ),
                  },
                };
                updateTemplate(params);
              }}
            />

            <div className={option_right_container}>
              <div
                className={option_delete_container}
                onClick={() => {
                  let params = {
                    templateId,
                    sectionId,
                    question: {
                      ...question,
                      options: question.options.filter(
                        o => o.sid !== option.sid
                      ),
                    },
                  };
                  updateTemplate(params);
                }}
              >
                <i className="fal fa-trash-alt" />
              </div>
            </div>
          </div>
        );
      })}

      <div className={option_dashed_container}>
        <input
          className={option_radio_check}
          type={inputType.toLowerCase()}
          name="new_option"
          disabled
        />

        <SimpleInputForm
          placeholder="Add new option..."
          val=""
          submit={({ input_val }) => {
            if (!input_val.length) return;
            let params = {
              templateId,
              sectionId,
              question: {
                ...question,
                options: [
                  ...question.options,
                  {
                    val: input_val,
                    sid: `tmp_sid-${new Date().getTime()}`,
                  },
                ],
              },
            };
            updateTemplate(params);
          }}
        />

        <div className={option_save}>add</div>
      </div>
    </div>
  );
}

function DeleteQuestion({ template, section, question, updateTemplate }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        color: "var(--color-primary)",
        fontSize: "12px",
        cursor: "pointer",
      }}
      onClick={() => {
        if (
          window.confirm(
            "Are you sure you want to delte this question permanently?"
          )
        ) {
          let params = {
            templateId: template.id,
            sectionId: section.id,
            questions: section.questions
              .filter(q => q.id !== question.id)
              .map(q => {
                if (q.index >= question.index) {
                  return {
                    ...q,
                    index: q.index - 1,
                  };
                }
                return q;
              })
              .sort((a, b) => a.index - b.index),
          };
          updateTemplate(params);
        }
      }}
    >
      delete question
    </div>
  );
}

export default function EditQuestion({
  template,
  section,
  question,
  updateTemplate,
}) {
  return (
    <div
      style={{
        paddingTop: "20px",
      }}
    >
      <QuestionNameAndDescription
        templateId={template.id}
        sectionId={section.id}
        question={question}
        updateTemplate={updateTemplate}
      />

      <hr className={hr} />

      <ToggleInputType
        templateId={template.id}
        sectionId={section.id}
        question={question}
        updateTemplate={updateTemplate}
      />

      <hr className={hr} />

      {(question.inputType === "RADIO" || question.inputType === "CHECK") && (
        <RadioOption
          templateId={template.id}
          sectionId={section.id}
          question={question}
          inputType={question.inputType}
          updateTemplate={updateTemplate}
        />
      )}

      {question.inputType === "TRAFFIC_LIGHTS" && <TrafficLightOption />}

      {question.inputType === "INPUT_TEXT" && <InputTextOption />}

      {question.inputType === "INPUT_MUTLIPLE_LINES" && (
        <InputTextLinesOption />
      )}

      <hr className={hr} />

      <div className={question_footer}>
        <DeleteQuestion
          template={template}
          section={section}
          question={question}
          updateTemplate={updateTemplate}
        />

        <div className={list_order}>
          <div
            className={classnames(list_order_button, order_up)}
            style={{
              opacity: question.index === 0 ? 0.2 : 1,
            }}
            onClick={() => {
              let params = {
                templateId: template.id,
                sectionId: section.id,
                questions: section.questions
                  .map(q => {
                    if (question.index === 0) return q;
                    if (q.id === question.id) {
                      return {
                        ...q,
                        index: question.index - 1,
                      };
                    }
                    if (q.index === question.index - 1) {
                      return {
                        ...q,
                        index: q.index + 1,
                      };
                    }
                    return q;
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
              move up
            </span>
            <i className="fas fa-arrow-alt-circle-up" />
          </div>

          <div
            className={classnames(list_order_button, order_down)}
            style={{
              opacity:
                question.index === section.questions.length - 1 ? 0.2 : 1,
            }}
            onClick={() => {
              let params = {
                templateId: template.id,
                sectionId: section.id,
                questions: section.questions
                  .map(q => {
                    if (question.index === section.questions.length - 1)
                      return q;
                    if (q.id === question.id) {
                      return {
                        ...q,
                        index: question.index + 1,
                      };
                    }
                    if (q.index === question.index + 1) {
                      return {
                        ...q,
                        index: q.index - 1,
                      };
                    }
                    return q;
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
              move down
            </span>
            <i className="fas fa-arrow-alt-circle-down" />
          </div>
        </div>
      </div>
    </div>
  );
}
