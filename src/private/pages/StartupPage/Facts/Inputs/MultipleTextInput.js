import React from "react";
import { useMutation } from "@apollo/client";

import { MultipleTextInput } from "Components/Forms/FormInputs";

import { creativePut } from "private/Apollo/Mutations";

export default function MultipleTextInputContainer({
  question,
  section,
  creative,
}) {
  const [mutate] = useMutation(creativePut);

  const answers = (creative.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  async function handleOnSubmit(data, event) {
    const variables = {
      id: creative.id,
      input: {},
    };

    if (data.new) {
      if (!data.new.length) return;

      variables.input.answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        val: data.new,
      };

      mutate({
        variables,
        optimisticResponse: {
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
        },
      });

      event.target.value = "";
    } else {
      let hit = answers.find(answer => answer.val !== data[answer.id]);
      if (!hit) return;
      variables.input.answerUpdate = {
        id: hit.id,
        question: question.name,
        val: data[hit.id],
      };

      try {
        await mutate({ variables });
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  async function handleOnDelete(id) {
    const variables = {
      id: creative.id,
      input: { answerDelete: id },
    };
    try {
      await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          creativePut: {
            __typename: "Creative",
            ...creative,
            answers: creative.answers.filter(({ id: _id }) => _id !== id),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <MultipleTextInput
      answers={answers}
      handleOnSubmit={handleOnSubmit}
      handleOnDelete={handleOnDelete}
    />
  );
}
