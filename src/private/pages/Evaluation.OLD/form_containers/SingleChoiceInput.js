import React from "react";
import { useMutation } from "@apollo/client";
import { SingleChoiceInput } from "Components/Forms";
import { evaluationPut } from "private/Apollo/Mutations";

export default function SingleChoiceInputContainer({
  question,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);

  const answer = (evaluation.answers || []).find(
    ({ inputType, questionId }) =>
      inputType === "RADIO" && questionId === question.id
  );

  return (
    <SingleChoiceInput
      style={{ padding: "10px" }}
      disabled={loading}
      options={question.options.map(({ val, sid }) => ({
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {
          const variables = {
            id: evaluation.id,
            input: {
              // name: section.name,
              // description: section.description,
              templateId,
            },
          };

          let optimisticResponse = {};
          if (answer) {
            variables.input.answerUpdate = {
              id: answer.id,
              question: question.name,
              val,
              sid,
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
                      val,
                      sid,
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
              val,
              sid,
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
                    ...variables.input.answerNew,
                  },
                ],
              },
            };
          }

          mutate({
            variables,
            optimisticResponse,
          });
        },
      }))}
    />
  );
}
