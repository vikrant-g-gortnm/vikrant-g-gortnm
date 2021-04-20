import React from "react";

// Components: general
import { Card } from "Components/elements";

// Components: unique
import { GeneralInput } from "./Inputs/GeneralInput";
import { Comments } from "./Comments";

// Styles
import styles from "./TemplatedForm.module.css";

// *****************
// * Main function *
// *****************
export default function Question({ question, section, answers, setAnswers }) {
  return (
    <div className={styles.question_container}>
      {/* Question name */}
      <div className={styles.question_title}>{question.name}</div>

      {/* Question description */}
      {question.description && (
        <div className={styles.question_description}>
          {question.description}
        </div>
      )}

      {/* Each input */}
      <div className={styles.question_options}>
        <GeneralInput
          section={section}
          question={question}
          answers={answers}
          setAnswers={setAnswers}
        />
      </div>

      {/* Comment section */}
      <Comments questionId={question.id} answers={answers} />
    </div>
  );
}
