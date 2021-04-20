import React from "react";
import { useMutation } from "@apollo/client";
import { CommentInput } from "Components/Forms/FormInputs/";

import { evaluationPut } from "private/Apollo/Mutations";

export default function CommentInputContainer({
  section,
  question,
  connectionId,
  templateId,
  evaluation,
}) {
  const [mutate, { loading }] = useMutation(evaluationPut);

  async function handleOnSubmit(data) {
    const answerNew = {
      inputType: "COMMENT",
      questionId: question.id,
      question: question.name,
      val: data.comment,
    };

    const variables = {
      id: evaluation.id,
      input: {
        // name: section.name,
        // description: section.description,
        templateId,
        answerNew,
      },
    };

    mutate({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        evaluationPut: {
          __typename: "Evaluation",
          ...evaluation,
          answers: [...evaluation.answers, { id: "", sid: "", ...answerNew }],
        },
      },
    });
  }

  async function handleDeleteComment({ id }) {
    const variables = {
      id: evaluation.id,
      input: {
        templateId,
        answerDelete: id,
      },
    };
    try {
      await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationPut: {
            __typename: "Evaluation",
            ...evaluation,
            answers: evaluation.answers.filter(({ id: _id }) => id !== _id),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleUpdateComment({ id, val }) {
    const variables = {
      id: evaluation.id,
      input: {
        answerUpdate: {
          id,
          val,
        },
      },
    };

    console.log("variables", variables);

    try {
      let res = await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationPut: {
            __typename: "Evaluation",
            ...evaluation,
            answers: evaluation.answers.map(e => ({
              ...e,
              val: e.id === id ? val : e.val,
            })),
          },
        },
      });

      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  }

  const comments = (evaluation.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <CommentInput
      comments={comments}
      style={{ padding: "15px" }}
      handleDeleteComment={handleDeleteComment}
      handleUpdateComment={handleUpdateComment}
      handleOnSubmit={handleOnSubmit}
      loading={loading}
    />
  );
}
