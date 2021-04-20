import React from "react";
import { useMutation } from "@apollo/client";

import { SingleChoiceInput } from "Components/Forms/FormInputs";

import { publicCreativePut } from "public/Apollo/Mutations";

export default function SingleChoiceInputContainer({
  question,
  section,
  creative,
}) {
  const { options } = question;
  const [mutate] = useMutation(publicCreativePut);
  const answer = (creative.answers || []).find(({ inputType, questionId }) => {
    return inputType === "RADIO" && questionId === question.id;
  });

  return (
    <SingleChoiceInput
      options={options.map(({ val, sid }) => ({
        val,
        checked: answer ? answer.val === val : false,

        handleOnChange: () => {
          if (creative.id) {
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
                sectionId: section.id,
                sectionName: section.name,
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
          }
        },
      }))}
    />
  );
}
