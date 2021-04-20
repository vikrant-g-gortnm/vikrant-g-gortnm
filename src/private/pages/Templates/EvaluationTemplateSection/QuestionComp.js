import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { omit } from "lodash";
import classnames from "classnames";

import { evaluationTemplateGet } from "private/Apollo/Queries";

import {
  evaluationTemplateQuestionPut,
  evaluationTemplateQuestionDelete,
} from "private/Apollo/Mutations";

import { delete_question } from "./EvaluationTemplateSection.module.css";

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
  option_score_container,
  option_delete_container,
  option_score_toggler,
  option_score_toggle_up,
  option_score_toggle_down,
  option_traffic_light_points,
  option_save,
} from "./QuestionComp.module.css";

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
    label: "traffic lights",
    val: "TRAFFIC_LIGHTS",
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

function QuestionNameAndDescription({ templateId, sectionId, question }) {
  const [mutate] = useMutation(evaluationTemplateQuestionPut);
  const { register, handleSubmit, setValue } = useForm();

  const { name, description } = question;

  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  }, [description, name, setValue]);

  const onSubmit = async (data, event) => {
    let variables = {
      id: question.id,
      ...data,
    };

    console.log("variables", variables);

    try {
      await mutate({ variables });
    } catch (error) {
      console.log(error);
    }
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

function ToggleInputType({ question }) {
  const [mutate] = useMutation(evaluationTemplateQuestionPut);

  return (
    <div className={tag_list}>
      {inputMap.map((inp, i) => {
        return (
          <Tag
            key={`toggle-${i}`}
            active={question.inputType === inp.val}
            isButton={true}
            onClick={() => {
              let inputType = inp.val;
              let variables = {
                id: question.id,
                input: { inputType },
              };
              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationTemplateQuestionPut: {
                    ...question,
                    inputType,
                  },
                },
              });
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
          value="https://notata.io"
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

function RadioOption({ question, inputType }) {
  const [mutate] = useMutation(evaluationTemplateQuestionPut);

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

                let variables = {
                  id: question.id,
                  input: {
                    editOption: {
                      ...omit(option, ["__typename"]),
                      val: input_val,
                    },
                  },
                };

                let optimisticOptions = question.options.map(o =>
                  o.sid !== option.sid ? o : { ...o, val: input_val }
                );

                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    evaluationTemplateQuestionPut: {
                      ...question,
                      options: optimisticOptions,
                    },
                  },
                });
              }}
            />

            <div className={option_right_container}>
              <div className={option_score_container}>
                <div className={option_score_toggler}>
                  <div
                    className={option_score_toggle_up}
                    onClick={() => {
                      let score = option.score + 1;

                      let variables = {
                        id: question.id,
                        input: {
                          editOption: {
                            ...omit(option, ["__typename"]),
                            score,
                          },
                        },
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          evaluationTemplateQuestionPut: {
                            ...question,
                            options: question.options.map(o =>
                              o.sid === option.sid ? { ...o, score } : o
                            ),
                          },
                        },
                      });
                    }}
                  >
                    <i className="fas fa-caret-up" />
                  </div>
                  <div
                    className={option_score_toggle_down}
                    onClick={() => {
                      let score = option.score - 1;

                      let variables = {
                        id: question.id,
                        input: {
                          editOption: {
                            ...omit(option, ["__typename"]),
                            score,
                          },
                        },
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          evaluationTemplateQuestionPut: {
                            ...question,
                            options: question.options.map(o =>
                              o.sid === option.sid ? { ...o, score } : o
                            ),
                          },
                        },
                      });
                    }}
                  >
                    <i className="fas fa-caret-down" />
                  </div>
                </div>

                <span>points:</span>
                <span style={{ paddingLeft: "5px" }}>{option.score || 0}</span>
              </div>

              <div
                className={option_delete_container}
                onClick={() => {
                  let variables = {
                    id: question.id,
                    input: {
                      deleteOption: option.sid,
                    },
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      evaluationTemplateQuestionPut: {
                        ...question,
                        options: question.options.filter(
                          o => o.sid !== option.sid
                        ),
                      },
                    },
                  });
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

            let variables = {
              id: question.id,
              input: {
                newOptions: [
                  {
                    val: input_val,
                  },
                ],
              },
            };

            let optimisticOptions = [
              ...question.options,
              {
                sid: "tmp_sid",
                val: input_val,
                score: 0,
                __typename: "evaluationTemplateQuestionOption",
              },
            ];

            mutate({
              variables,
              optimisticResponse: {
                __typename: "Mutation",
                evaluationTemplateQuestionPut: {
                  ...question,
                  options: optimisticOptions,
                },
              },
            });
          }}
        />

        <div className={option_save}>add</div>
      </div>
    </div>
  );
}

function DeleteQuestion({ templateId, sectionId, question }) {
  const [mutate] = useMutation(evaluationTemplateQuestionDelete);

  return (
    <div
      className={delete_question}
      onClick={() => {
        if (
          ["RADIO", "CHECK"].some(s => s === question.inputType) &&
          question.options.length
        ) {
          return window.alert(
            "You have to delete the options below before you can delete this question:\n\n" +
              question.options.map(o => `"${o.val}"`).join(", ")
          );
        }
        if (
          window.confirm(
            "Are you sure you want to delte this question permanently?"
          )
        ) {
          let variables = { id: question.id };
          mutate({
            variables,
            //            update: (proxy, { data: { evaluationTemplateQuestionDelete } }) => {
            //              let data = proxy.readQuery({
            //                query: evaluationTemplateGet,
            //                variables: { id: templateId }
            //              });
            //              let sections = data.evaluationTemplateGet.sections;
            //              data.evaluationTemplateGet.sections = sections.map(s => {
            //                if (s.id !== sectionId) return s;
            //                return {
            //                  ...s,
            //                  questions: s.questions.filter(q => q.id !== question.id)
            //                };
            //              });
            //            },
            refetchQueries: [
              {
                query: evaluationTemplateGet,
                variables: { id: templateId },
              },
            ],
          });
        }
      }}
    >
      delete question
    </div>
  );
}

export default function Question({ templateId, sectionId, question }) {
  return (
    <div>
      <QuestionNameAndDescription
        templateId={templateId}
        sectionId={sectionId}
        question={question}
      />

      <hr className={hr} />

      <ToggleInputType question={question} />

      <hr className={hr} />

      {(question.inputType === "RADIO" || question.inputType === "CHECK") && (
        <RadioOption question={question || {}} inputType={question.inputType} />
      )}

      {question.inputType === "TRAFFIC_LIGHTS" && <TrafficLightOption />}

      {question.inputType === "INPUT_TEXT" && <InputTextOption />}

      {question.inputType === "INPUT_MUTLIPLE_LINES" && (
        <InputTextLinesOption />
      )}

      <hr className={hr} />

      <div className={question_footer}>
        <DeleteQuestion
          templateId={templateId}
          sectionId={sectionId}
          question={question}
        />

        <div className={list_order}>
          <div className={classnames(list_order_button, order_up)}>
            <i className="fas fa-arrow-alt-circle-up" />
          </div>

          <div className={classnames(list_order_button, order_down)}>
            <i className="fas fa-arrow-alt-circle-down" />
          </div>
        </div>
      </div>
    </div>
  );
}
