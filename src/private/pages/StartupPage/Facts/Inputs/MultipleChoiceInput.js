import React from "react";
import { useMutation } from "@apollo/client";

import { MultipleChoiceInput } from "Components/Forms/FormInputs";
import { creativePut } from "private/Apollo/Mutations";

export default function MultipleChoiceInputContainer({ question, creative }) {
  const { options } = question;
  const [mutate] = useMutation(creativePut);

  const answers = (creative.answers || []).filter(
    ({ inputType, questionId }) => {
      return inputType === "CHECK" && questionId === question.id;
    }
  );

  return (
    <MultipleChoiceInput
      options={options.map(({ val, sid }) => {
        const answer = answers.find(
          ({ sid: answersSid }) => answersSid === sid
        );

        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: () => {
            const variables = {
              id: creative.id,
              input: {},
            };

            let optimisticResponse = {};
            if (answer) {
              variables.input.answerDelete = answer.id;

              optimisticResponse = {
                __typename: "Mutation",
                creativePut: {
                  __typename: "Creative",
                  ...creative,
                  answers: answers.filter(({ id }) => answer.id !== id),
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
                      sid: "",
                      ...variables.input.answerNew,
                    },
                  ],
                },
              };
            }
            mutate({ variables, optimisticResponse });
          },
        };
      })}
    />
  );
}
