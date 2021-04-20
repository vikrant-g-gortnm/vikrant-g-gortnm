import React from "react";
import { useMutation } from "@apollo/client";

import { SingleChoiceInput } from "Components/Forms/FormInputs";

import { creativePut } from "private/Apollo/Mutations";

export default function SingleChoiceInputContainer({ question, creative }) {
  const { options } = question;
  const [mutate] = useMutation(creativePut);
  const answer = (creative.answers || []).find(({ inputType, questionId }) => {
    return inputType === "RADIO" && questionId === question.id;
  });

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => ({
        key: sid,
        val,
        checked: answer ? answer.val === val : false,
        handleOnChange: () => {
          const variables = {
            id: creative.id,
            input: {},
          };

          let optimisticResponse = {};
          if (answer) {
            variables.input.answerUpdate = {
              id: answer.id,
              question: question.name,
              sid,
              val,
            };

            optimisticResponse = {
              __typename: "Mutation",
              creativePut: {
                __typename: "Creative",
                ...creative,
                answers: creative.answers.map(_answer => {
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
              sid,
              val,
            };

            optimisticResponse = {
              __typename: "Mutation",
              creativePut: {
                __typename: "Creative",
                ...creative,
                answers: [
                  ...creative.answers,
                  {
                    __typename: "CreativeAnswer",
                    id: "",
                    ...variables.input.answerNew,
                  },
                ],
              },
            };
          }
          mutate({ variables, optimisticResponse });
        },
      }))}
    />
  );
}
