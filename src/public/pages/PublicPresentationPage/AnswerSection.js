import React from "react";

import styles from "./PublicPresentationPage.module.css";

export default function AnswerSection({ answers }) {
  let answersByQuestion = {};

  answers.forEach(answer => {
    answersByQuestion[answer.questionId] = answersByQuestion[
      answer.questionId
    ] || {
      questionName: answer.question,
      index: answer.index || answer.length || 0,
      answers: [],
    };
    answersByQuestion[answer.questionId].answers.push(answer);
  });

  for (let questionId in answersByQuestion) {
    let sortedAnswers = answersByQuestion[questionId]?.answers?.sort(
      (a, b) => a.index - b.index
    );

    answersByQuestion[questionId] = {
      ...answersByQuestion[questionId],
      answers: sortedAnswers,
    };
  }

  function questionList() {
    return Object.keys(answersByQuestion)
      .map(questionId => ({ questionId, ...answersByQuestion[questionId] }))
      .sort((a, b) => a.index - b.index);
  }

  return (
    <div className={styles.facts_section_container}>
      <div style={{ marginTop: "-10px" }}>
        {questionList().map(item => {
          let { questionName, answers, questionId } = item;

          return (
            <div className={styles.facts_question_container} key={questionId}>
              <div className={styles.question_header}>{questionName}</div>

              {answers
                .sort((a, b) => (a.inputType === "COMMENT" ? 1 : -1))
                .map((answer, i) => {
                  if (answer.pageMeta) {
                    return (
                      <div className={styles.pageMeta_outer} key={i}>
                        <a
                          href={answer.pageMeta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={styles.pageMeta}>
                            <div className={styles.pageMeta_provider}>
                              {answer.pageMeta.provider}
                            </div>

                            <div className={styles.pageMeta_title}>
                              {answer.pageMeta.title}
                            </div>

                            <div className={styles.pageMeta_image}>
                              <img src={answer.pageMeta.image} alt="" />
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  }

                  if (answer.val.substring(0, 3) === "htt") {
                    return (
                      <div key={i}>
                        <a
                          className={styles.facts_answer}
                          href={answer.val}
                          target={"_blank"}
                          rel="noopener noreferrer"
                        >
                          {answer.val}
                        </a>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className={
                        answer.inputType === "COMMENT"
                          ? styles.facts_comment
                          : styles.facts_answer
                      }
                    >
                      {answer.val}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
