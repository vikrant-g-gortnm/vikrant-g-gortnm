import React from "react";
import { useMutation } from "@apollo/client";
import { TrafficLightInput } from "Components/Forms/FormInputs";

import { evaluationPut } from "private/Apollo/Mutations";
import { connectionGet } from "private/Apollo/Queries";

export default function TrafficLightInputContainer({
  section,
  question,
  templateId,
  evaluation,
  connectionId,
}) {
  const [mutate] = useMutation(evaluationPut);

  const answer = (evaluation.answers || []).find(
    ({ inputType, questionId }) =>
      inputType === "TRAFFIC_LIGHTS" && questionId === question.id
  );

  return (
    <TrafficLightInput
      value={answer && answer.val}
      handleOnClick={color => {
        const variables = {
          id: evaluation.id,
          input: {
            name: section.name,
            description: section.description,
            templateId,
          },
        };

        let optimisticResponse = {};
        if (answer) {
          variables.input.answerUpdate = {
            id: answer.id,
            question: question.name,
            val: color,
          };

          optimisticResponse = {
            __typename: "Mutation",
            evaluationPut: {
              __typename: "Evaluation",
              ...evaluation,
              answers: evaluation.answers.map(_answer => {
                if (answer.id === _answer.id) {
                  return {
                    ..._answer,
                    val: color,
                  };
                }

                return _answer;
              }),
            },
          };
        } else {
          variables.input.answerNew = {
            inputType: question.inputType,
            questionId: question.id,
            question: question.name,
            val: color,
          };

          optimisticResponse = {
            __typename: "Mutation",
            evaluationPut: {
              __typename: "Evaluation",
              ...evaluation,
              answers: [
                ...evaluation.answers,
                {
                  __typename: "EvaluationAnswer",
                  id: "",
                  sid: "",
                  ...variables.input.answerNew,
                },
              ],
            },
          };
        }

        mutate({
          variables,
          optimisticResponse,
          update: (proxy, { data: { evaluationPut } }) => {
            const data = proxy.readQuery({
              query: connectionGet,
              variables: {
                id: connectionId,
              },
            });

            proxy.writeQuery({
              query: connectionGet,
              variables: {
                id: connectionId,
              },
              data: {
                ...data.connectionGet,
                evaluations: data.connectionGet.evaluations.map(evaluation => {
                  if (evaluation.id === evaluationPut.id) {
                    return evaluationPut;
                  }

                  return evaluation;
                }),
              },
            });
          },
        });
      }}
    />
  );
}
