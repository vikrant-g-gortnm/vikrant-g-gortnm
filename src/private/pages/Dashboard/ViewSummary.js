import React from "react";
import {
  facts_answer,
  facts_answer_link,
  facts_container,
  facts_question_container,
  facts_question_header,
  facts_section_container,
  facts_section_description,
  facts_section_header,
  no_answer,
  question_comments,
  small_traffic_light,
} from "../StartupPage/StartupInfo/StartupInfo.module.css";

function MultipleChoiceAnswer({ question, answers }) {
  const _answers = answers.filter(({ inputType, questionId }) => {
    return inputType === "CHECK" && questionId === question.id;
  });

  if (!_answers.length) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <div className={facts_answer}>
      {_answers.map(({ val }) => val).join(", ")}
    </div>
  );
}

function RadioAnswer({ question, answers }) {
  const answer = answers.find(({ inputType, questionId }) => {
    return inputType === "RADIO" && questionId === question.id;
  });

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return <div className={facts_answer}>{answer.val}</div>;
}

function InputTextAnswer({ question, answers }) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return <div className={facts_answer}>{answer.val}</div>;
}

function InputMutlipleLinesAnswer({ question, answers }) {
  const _answers = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  if (!_answers.length) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <>
      {_answers.map((answer, i) => {
        let firstThree = answer.val.substring(0, 3).toLowerCase();
        let isUrl = firstThree === "htt" || firstThree === "www";

        if (isUrl) {
          return (
            <div>
              <a
                className={facts_answer_link}
                key={i}
                href={answer.val}
                rel="noopener noreferrer"
                target="_blank"
              >
                {answer.val} <i className="fal fa-external-link-square" />
              </a>
            </div>
          );
        }

        return (
          <div key={i} className={facts_answer}>
            {answer.val}
          </div>
        );
      })}
    </>
  );
}

function InputTrafficLightsAnswer({ question, answers }) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "TRAFFIC_LIGHTS" && questionId === question.id
  );

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <div className={facts_answer}>
      <div
        className={small_traffic_light}
        style={{
          background: `var(--color-${answer.val})`,
        }}
      />{" "}
      {answer.val}
    </div>
  );
}

function GeneralAnswer(props) {
  switch (props.question.inputType) {
    case "CHECK":
      return <MultipleChoiceAnswer {...props} />;
    case "RADIO":
      return <RadioAnswer {...props} />;
    case "INPUT_TEXT":
      return <InputTextAnswer {...props} />;
    case "TRAFFIC_LIGHTS":
      return <InputTrafficLightsAnswer {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <InputMutlipleLinesAnswer {...props} />;
    default:
      return <MultipleChoiceAnswer {...props} />;
  }
}

function AnswerCommentSection({ answers, question }) {
  const comments = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  if (!comments.length) {
    return <span />;
  }

  return (
    <div>
      {comments.map(({ val, id }) => (
        <div key={id} className={question_comments}>
          {val}
        </div>
      ))}
    </div>
  );
}

export function ViewSummary({ answers, creativeTemplate }) {
  return (
    <div className={facts_container}>
      {creativeTemplate.sections.map((section, i) => {
        const { name, description, questions } = section;
        return (
          <div key={`section-${i}`} className={facts_section_container}>
            <div className={facts_section_header}>{name}</div>
            <div className={facts_section_description}>{description}</div>
            <div>
              {questions.map((question, ii) => {
                return (
                  <div
                    key={`question-${i}-${ii}`}
                    className={facts_question_container}
                  >
                    <div className={facts_question_header}>{question.name}</div>
                    <GeneralAnswer answers={answers} question={question} />
                    <AnswerCommentSection
                      question={question}
                      answers={answers}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
