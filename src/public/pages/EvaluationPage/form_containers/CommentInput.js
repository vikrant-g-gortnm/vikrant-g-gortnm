import React from "react";
import { CommentInput } from "Components/Forms/FormInputs";

export default function CommentInputContainer({
  question,
  answers,
  setAnswers,
}) {
  const comments = answers.filter(
    ({ questionId, inputType }) =>
      questionId === question.id && inputType === "COMMENT"
  );

  async function handleOnSubmit(data) {
    const id = comments.length ? comments[comments.length - 1].id + 1 : 1;

    const answerNew = {
      id: id,
      inputType: "COMMENT",
      questionId: question.id,
      question: question.name,
      val: data.comment,
    };

    let newAnswers;

    newAnswers = [...answers, answerNew];

    setAnswers(newAnswers);
  }

  async function handleDeleteComment({ id }) {
    const newAnswers = answers.filter(
      ans =>
        !(
          ans.questionId === question.id &&
          ans.inputType === "COMMENT" &&
          ans.id === id
        )
    );
    setAnswers(newAnswers);
  }

  async function handleUpdateComment({ id, val }) {
    const answerNew = {
      id: id,
      inputType: "COMMENT",
      questionId: question.id,
      question: question.name,
      val: val,
    };

    const newAnswers = answers.map(ans =>
      ans.questionId === question.id &&
      ans.inputType === "COMMENT" &&
      ans.id === id
        ? answerNew
        : ans
    );
    setAnswers(newAnswers);
  }

  return (
    <CommentInput
      comments={comments || []}
      style={{ padding: "15px" }}
      handleDeleteComment={handleDeleteComment}
      handleUpdateComment={handleUpdateComment}
      handleOnSubmit={handleOnSubmit}
    />
  );
}
