import React from "react";

import { CommentInput } from "Components/Forms/FormInputs";

export function CommentSection({ answers, section, question, setAnswers }) {
  // const [ comments, setComments ] = useState([])

  const comments = answers.filter(
    ans => ans.questionId === question.id && ans.inputType === "COMMENT"
  );

  function handleDeleteComment(data) {
    setAnswers(answers.filter(ans => ans.id !== data.id));
  }

  function handleUpdateComment(data) {
    setAnswers(
      answers.map(ans => (ans.id === data.id ? { ...ans, ...data } : ans))
    );
  }

  function handleOnSubmit({ comment }) {
    const id = `comment-${answers.length + 1}`;
    let newComment = {
      id,
      inputType: "COMMENT",
      questionId: question.id,
      question: question.name,
      sectionId: section.id,
      sectionName: section.name,
      val: comment,
    };
    setAnswers([...answers, newComment]);
  }

  return (
    <div>
      <CommentInput
        comments={comments}
        style={{ padding: "15px" }}
        handleDeleteComment={handleDeleteComment}
        handleUpdateComment={handleUpdateComment}
        handleOnSubmit={handleOnSubmit}
      />
    </div>
  );
}
