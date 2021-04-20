import React, { useState } from "react";
import styles from "public/pages/PublicPresentationPage/PublicPresentationPage.module.css";
import { Button, Modal } from "Components/elements";
import { PageMeta } from "./PageMeta";
import { omit } from "lodash";
import classnames from "classnames";

function isUrl(str) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*) ?/gi;
  const regex = new RegExp(expression);
  return !!(str || "").match(regex);
}

export function AnswerSection({
  section,
  answers,
  presentation,
  setPresentation,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(undefined);
  const [showDeleteAnswer, setShowDeleteAnswer] = useState(undefined);
  const [showPageMeta, setShowPageMeta] = useState(undefined);

  let answersByQuestion = {};
  answers.forEach(answer => {
    answersByQuestion[answer.questionId] = answersByQuestion[
      answer.questionId
    ] || {
      questionName: answer.question,
      index: answer.index,
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

  function moveQuestionUp(questionId) {
    let current = answersByQuestion[questionId];

    if (current.index === 0) return;

    let changedAnswers = [];

    for (let qId in answersByQuestion) {
      let { index, answers } = answersByQuestion[qId];

      if (qId === questionId) {
        changedAnswers = [
          ...changedAnswers,
          ...answers.map(item => ({ ...item, index: index - 1 })),
        ];
      }

      if (index === current.index - 1) {
        changedAnswers = [
          ...changedAnswers,
          ...answers.map(item => ({ ...item, index: index + 1 })),
        ];
      }
    }

    let newAnswers = answers.map(answer => {
      let hit = changedAnswers.find(({ id }) => id === answer.id);
      return hit ? hit : answer;
    });

    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        sections: presentation?.creativeDetails?.sections.map(s =>
          s.name === section.name ? { ...s, answers: newAnswers } : s
        ),
      },
    });
  }

  function moveQuestionDown(questionId) {
    let current = answersByQuestion[questionId];

    if (current.index === section?.answers?.length - 1) return;

    let changedAnswers = [];

    for (let qId in answersByQuestion) {
      let { index, answers } = answersByQuestion[qId];

      if (qId === questionId) {
        changedAnswers = [
          ...changedAnswers,
          ...answers.map(item => ({ ...item, index: index + 1 })),
        ];
      }

      if (index === current.index + 1) {
        changedAnswers = [
          ...changedAnswers,
          ...answers.map(item => ({ ...item, index: index - 1 })),
        ];
      }
    }

    let newAnswers = answers.map(answer => {
      let hit = changedAnswers.find(({ id }) => id === answer.id);
      return hit ? hit : answer;
    });

    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        sections: presentation?.creativeDetails?.sections.map(s =>
          s.name === section.name ? { ...s, answers: newAnswers } : s
        ),
      },
    });
  }

  function deleteAnswers(answerIds) {
    let newItem = {
      ...presentation,
      creativeDetails: {
        ...presentation?.creativeDetails,
        sections: (presentation?.creativeDetails?.sections || []).map(
          section => ({
            ...section,
            answers: (section.answers || []).filter(
              ({ id }) => !answerIds.some(aid => aid === id)
            ),
          })
        ),
      },
    };
    setPresentation(newItem);
  }

  function setPageMeta(answerId, pageMeta) {
    let newItem = {
      ...presentation,
      creativeDetails: {
        ...presentation?.creativeDetails,
        sections: (presentation?.creativeDetails?.sections || []).map(
          section => ({
            ...section,
            answers: (section.answers || []).map(a => {
              if (a.id !== answerId) return a;
              return {
                ...a,
                pageMeta,
              };
            }),
          })
        ),
      },
    };
    setPresentation(newItem);
  }

  function removePageMeta(answerId) {
    let newItem = {
      ...presentation,
      creativeDetails: {
        ...presentation?.creativeDetails,
        sections: (presentation?.creativeDetails?.sections || []).map(
          section => ({
            ...section,
            answers: (section.answers || []).map(a => {
              if (a.id !== answerId) return a;
              return omit(a, "pageMeta");
            }),
          })
        ),
      },
    };
    setPresentation(newItem);
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
          let { questionName, questionId, answers, index } = item;
          return (
            <div className={styles.facts_question_container} key={questionId}>
              <div className={styles.arrow_navigation}>
                {index !== 0 && (
                  <div
                    className={styles.arrow_up}
                    onClick={() => {
                      moveQuestionUp(questionId);
                    }}
                  >
                    <i className="fas fa-arrow-alt-up" />
                  </div>
                )}

                {index < questionList().length && (
                  <div
                    className={styles.arrow_down}
                    onClick={() => {
                      moveQuestionDown(questionId);
                    }}
                  >
                    <i className="fas fa-arrow-alt-down" />
                  </div>
                )}
              </div>

              <div className={styles.question_header}>
                {questionName}
                <div
                  className={classnames("delete_bucket", styles.delete_button)}
                  onClick={() => setShowDeleteModal(item)}
                >
                  <i className={"fal fa-trash-alt"} />
                </div>
              </div>

              {answers
                .sort((a, b) => b.index - a.index)
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
                        {isUrl(answer.val) && (
                          <div
                            style={{
                              position: "relative",
                              top: "-9px",
                              left: "-2px",
                            }}
                          >
                            <Button
                              buttonStyle={"secondary"}
                              size={"small"}
                              onClick={() => {
                                removePageMeta(answer.id);
                              }}
                            >
                              Delete page meta
                            </Button>
                          </div>
                        )}
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
                      {(isUrl(answer.val) && (
                        <div className={styles.link_line}>
                          <span>{answer.val}</span>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <Button
                              buttonStyle={"secondary"}
                              size={"small"}
                              onClick={() => {
                                setShowPageMeta(answer);
                              }}
                            >
                              Load page meta
                            </Button>

                            <Button
                              size={"small"}
                              type={"just_text"}
                              onClick={() => {
                                setShowDeleteAnswer(answer.id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )) || <span>{answer.val}</span>}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {showPageMeta && (
        <Modal
          title="Show page meta"
          close={() => setShowPageMeta(undefined)}
          disableFoot={true}
        >
          <PageMeta
            answer={showPageMeta}
            presentation={presentation}
            setPageMeta={setPageMeta}
            close={() => setShowPageMeta(undefined)}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          title="Delete question"
          close={() => setShowDeleteModal(undefined)}
          disableFoot={true}
        >
          <div
            style={{
              padding: "20px 0px",
            }}
          >
            Are you sure you want to delete{" "}
            <span
              style={{
                fontWeight: "var(--font-weight-bold)",
                color: "var(--color-primary)",
              }}
            >
              {showDeleteModal.questionName}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              size={"medium"}
              buttonStyle={"secondary"}
              onClick={() => setShowDeleteModal(undefined)}
            >
              No
            </Button>
            <Button
              size={"medium"}
              onClick={() => {
                let answerIds = (showDeleteModal.answers || []).map(
                  ({ id }) => id
                );
                deleteAnswers(answerIds);
                setShowDeleteModal(undefined);
              }}
            >
              Yes
            </Button>
          </div>
        </Modal>
      )}

      {showDeleteAnswer && (
        <Modal
          title="Delete answer"
          close={() => setShowDeleteAnswer(undefined)}
          disableFoot={true}
        >
          <div
            style={{
              padding: "20px 0px",
            }}
          >
            Are you sure you want to delete this answer?
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              size={"medium"}
              buttonStyle={"secondary"}
              onClick={() => setShowDeleteAnswer(undefined)}
            >
              No
            </Button>
            <Button
              size={"medium"}
              onClick={() => {
                deleteAnswers([showDeleteAnswer]);
                setShowDeleteAnswer(undefined);
              }}
            >
              Yes
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
