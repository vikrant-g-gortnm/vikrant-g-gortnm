import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  groupGet,
  creativeTemplateGet,
  logGet,
  evaluationTemplateGet,
  connectionsGet,
} from "private/Apollo/Queries";

import { connectionCreate } from "private/Apollo/Mutations";
import { startup_page, group as group_route } from "definitions.js";

import {
  BreadCrumbs,
  Content,
  Card,
  Tag,
  GhostLoader,
} from "Components/elements";

import {
  header_comp,
  sub_header,
  facts_container,
  facts_section_container,
  facts_section_header,
  facts_section_description,
  facts_question_container,
  facts_question_header,
  facts_answer,
  facts_answer_link,
  no_answer,
  subjectiveScore_container,
  subjectiveScore_name,
  subjectiveScore_value,
  comment_each,
  small_traffic_light,
  question_comments,
  link_extend,
} from "./GroupConnection.module.css";

function MultipleChoiseAnswer({ question, answers }) {
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

  if (!_answers.length) return <div className={no_answer}>Not answered</div>;

  return _answers.map((answer, i) => {
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
  });
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
      return <MultipleChoiseAnswer {...props} />;
    case "RADIO":
      return <RadioAnswer {...props} />;
    case "INPUT_TEXT":
      return <InputTextAnswer {...props} />;
    case "TRAFFIC_LIGHTS":
      return <InputTrafficLightsAnswer {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <InputMutlipleLinesAnswer {...props} />;
    default:
      return <MultipleChoiseAnswer {...props} />;
  }
}

function CommentSection({ answers, question }) {
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

function Facts({ answers, creativeTemplate, with_comments }) {
  let order = ["Info", "Materials", "Business", "Money"];

  const hasAnswer = question =>
    answers.some(({ questionId }) => questionId === question.id);

  return order.map(n => {
    const section = creativeTemplate.sections.find(({ name }) => name === n);

    if (!section) return <span key={n} />;

    let { name, description, questions } = section;

    questions = questions.filter(question => hasAnswer(question));

    if (!questions.length) return <span key={n} />;

    return (
      <div key={n} className={facts_section_container}>
        <div className={facts_section_header}>{name}</div>
        <div className={facts_section_description}>{description}</div>
        <div>
          {questions.map((question, i) => {
            return (
              <div
                key={`question-${n}-${i}`}
                className={facts_question_container}
              >
                <div className={facts_question_header}>{question.name}</div>
                <GeneralAnswer answers={answers} question={question} />
                {with_comments && (
                  <CommentSection question={question} answers={answers} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });
}

function Comments({ connection }) {
  const logQuery = useQuery(logGet, {
    variables: { connectionId: connection.id },
  });
  if (logQuery.loading) {
    return <span>loading...</span>;
  }
  let comments = logQuery.data.logGet.filter(l => l.logType === "COMMENT");
  if (!comments.length) {
    return <span>There are no comments for this startup</span>;
  }

  return comments.map((commentItem, i) => {
    let comment = commentItem.dataPairs[0].val;
    return (
      <div key={i} className={comment_each}>
        {comment}
      </div>
    );
  });
}

function Evaluation({ evaluation, with_comments }) {
  const evaluationTemplateQuery = useQuery(evaluationTemplateGet, {
    variables: { id: evaluation.templateId },
  });
  if (evaluationTemplateQuery.loading || !evaluationTemplateQuery.data) {
    return <span>... loading</span>;
  }
  const evaluationTemplate = evaluationTemplateQuery.data.evaluationTemplateGet;

  return (
    <div className={facts_container}>
      {evaluationTemplate.sections.map(({ name, questions, id }) => {
        return (
          <div key={id} className={facts_section_container}>
            <div className={facts_section_header}>{name}</div>

            <div>
              {questions.map((question, i) => {
                return (
                  <div key={`${id}-${i}`} className={facts_question_container}>
                    <div className={facts_question_header}>{question.name}</div>

                    <GeneralAnswer
                      answers={evaluation.answers}
                      question={question}
                    />
                    {with_comments && (
                      <CommentSection
                        question={question}
                        answers={evaluation.answers}
                      />
                    )}
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

function AddButton({ creative, history }) {
  const [mutate, { data, error, loading }] = useMutation(connectionCreate);
  const { data: query_data, loading: query_loading } = useQuery(connectionsGet);

  if (query_loading && !query_data) {
    return <span />;
  }

  let connections = query_data.connectionsGet;

  let connection;
  if (connections) {
    connection = connections.find(
      ({ creativeId }) => creativeId === creative.id
    );
  }

  if (!connection && !data) {
    return (
      <div
        style={{
          textAlign: "right",
          color: "var(--color-primary)",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => {
          if (loading) return;
          let variables = {
            creativeId: creative.id,
          };
          mutate({ variables });
        }}
      >
        {(loading && <i className="fa fa-spinner fa-spin" />) || (
          <i className="fal fa-cloud-download" />
        )}{" "}
        save this startup
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "right",
        color: "var(--color-primary)",
        cursor: "pointer",
        fontSize: "14px",
      }}
      onClick={() => {
        let id = connection ? connection.id : data.connectionCreate.id;
        history.push(`${startup_page}/${id}`);
      }}
    >
      view startup
    </div>
  );
}

function Summaries({ answers }) {
  let tagIds = [
    "q03_section_money",
    "q01_section_business",
    "q03_section_business",
    "q04_section_business",
    "q06_section_business",
    "q04_section_info",
  ];

  let website;
  let w = answers.find(({ questionId }) => questionId === "q06_section_info");
  if (w) {
    w.val.substring(0, 3).toLowerCase() === "htt"
      ? (website = w.val)
      : (website = `http://${w.val}`);
  }

  let d = {
    slideDeck: (
      answers.find(
        ({ questionId }) => questionId === "q01_section_materials"
      ) || {}
    ).val,
    oneLiner: (
      answers.find(({ questionId }) => questionId === "q01_section_info") || {}
    ).val,
    solution: (
      answers.find(({ questionId }) => questionId === "q03_section_info") || {}
    ).val,
    tags: answers.filter(
      ({ questionId, inputType }) =>
        inputType !== "COMMENT" && tagIds.some(id => id === questionId)
    ),
    website,
  };

  return (
    <div className="mb3">
      {d.oneLiner && <div className="p1">{d.oneLiner}</div>}

      {!d.oneLiner && d.solution && <div className="p1">{d.solution}</div>}

      {(d.website || d.slideDeck) && (
        <div style={{ paddingBottom: "10px" }}>
          {d.website && (
            <Tag active={true} isButton={true}>
              <a href={d.website} target="_blank" rel="noopener noreferrer">
                Website <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}

          {d.slideDeck && (
            <Tag active={true} isButton={true}>
              <a href={d.slideDeck} target="_blank" rel="noopener noreferrer">
                Slide deck <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}
        </div>
      )}

      {!!d.tags.length && d.tags.map(({ val }, i) => <Tag key={i}>{val}</Tag>)}
    </div>
  );
}

export default function GroupConnection({ match, history }) {
  const [viewFacts, setViewFacts] = useState(false);

  const id = match.params.id;
  const connectionId = match.params.connectionId;

  const [getData, groupGetQuery] = useLazyQuery(groupGet);
  const creativeTemplateQuery = useQuery(creativeTemplateGet);

  useEffect(() => {
    getData({ variables: { id, connectionId } });
  }, [getData, id, connectionId]);

  const loading = groupGetQuery.loading || creativeTemplateQuery.loading;
  const error = groupGetQuery.error || creativeTemplateQuery.error;
  const hasData = groupGetQuery.data && creativeTemplateQuery.data;

  if (loading || !hasData) {
    return <GhostLoader />;
  }

  if (error) {
    console.log("error", error);
    return <div>We're updating...</div>;
  }

  let group = groupGetQuery.data.groupGet;
  let startups = group.startups;
  let shared_startup = startups.find(c => c.connectionId === connectionId);

  let connection = shared_startup.connection;
  let creative = connection.creative;

  let creativeTemplate = creativeTemplateQuery.data.creativeTemplateGet;

  const {
    comments: with_comments,
    evaluations: with_evaluations,
    subjective_score: with_subjectiveScore,
    tags: with_tags,
  } = shared_startup;

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "All Groups",
            link: `${group_route}`,
          },
          {
            val: `Group: ${group.name}`,
            link: `${group_route}/${id}`,
          },
          {
            val: `Startup: ${(connection.creative || {}).name}`,
            link: `${group_route}/${id}/${connection.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        {/*HEADER*/}
        <Card style={{ paddingBottom: "20px" }}>
          <div className={header_comp}>{creative.name}</div>

          <div className={sub_header}>
            Shared by{" "}
            <b>
              {shared_startup.sharedBy} in{" "}
              <span
                style={{
                  color: "var(--color-primary",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push(`${group_route}/${group.id}`);
                }}
              >
                {group.name}
              </span>
              .
            </b>
          </div>

          <AddButton creative={creative} history={history} />
        </Card>

        {/*FACTS*/}
        <Card label="Facts">
          <Summaries answers={creative.answers} />
          <div onClick={() => setViewFacts(!viewFacts)} className={link_extend}>
            {viewFacts ? "hide facts" : "...show facts"}
          </div>

          {viewFacts && (
            <div>
              <hr />
              <Facts
                answers={connection.creative.answers}
                creativeTemplate={creativeTemplate}
                with_comments={with_comments}
              />
            </div>
          )}
        </Card>

        {/*TAGS*/}
        {with_tags && !!connection.tags.length && (
          <Card label="Tags" style={{ paddingBottom: "20px" }}>
            {connection.tags.map(({ name }, i) => (
              <Tag key={i}>{name}</Tag>
            ))}
          </Card>
        )}

        {/*SUBJECTIVE SCORE*/}
        {with_subjectiveScore &&
          connection.subjectiveScores &&
          !!connection.subjectiveScores.length && (
            <Card label="Subjective score" style={{ paddingBottom: "20px" }}>
              {(connection.subjectiveScores || []).map((subjectiveScore, i) => {
                return (
                  <div key={i} className={subjectiveScore_container}>
                    <div className={subjectiveScore_name}>
                      {subjectiveScore.createdByUser.given_name}{" "}
                      {subjectiveScore.createdByUser.family_name}
                    </div>
                    <div className={subjectiveScore_value}>
                      {subjectiveScore.score}
                    </div>
                  </div>
                );
              })}
            </Card>
          )}

        {/*COMMENTS*/}
        {with_comments && (
          <Card label="Comments" style={{ paddingBottom: "20px" }}>
            <Comments connection={connection} />
          </Card>
        )}

        {/*EVALUATIONS*/}
        {with_evaluations &&
          (connection.evaluations || []).map((evaluation, i) => {
            return (
              <Card
                label={`Evaluation: ${evaluation.name}`}
                style={{ paddingBottom: "20px" }}
                key={i}
              >
                <Evaluation
                  key={i}
                  evaluation={evaluation}
                  with_comments={with_comments}
                />
              </Card>
            );
          })}

        <AddButton creative={creative} history={history} />
      </Content>
    </>
  );
}
