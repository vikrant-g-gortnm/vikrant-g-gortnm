import React, { useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import moment from "moment";
import { Link } from "react-router-dom";
import { evaluationPut } from "private/Apollo/Mutations";
import {
  connectionGet,
  userGet,
  evaluationTemplateGet,
} from "private/Apollo/Queries";
import { startup_page } from "definitions.js";
import { getPossibleScore, getScore } from "./util";
import classnames from "classnames";

import { Card, BreadCrumbs, GhostLoader, Content } from "Components/elements";

import {
  summary_score_section,
  row,
  summary_row,
  row_score,
  header,
  header_title,
  header_details,
  header_details_small,
  header_details_regular,
  question_each,
  question_each_name,
  question_answer,
  question_comments,
  no_answer,
  small_traffic_light,
  link_style,
  delete_link_style,
} from "./Summary.module.css";

export default function Index({ match, history }) {
  const [mutate, { loading: loadingMutation }] = useMutation(evaluationPut);

  const userQuery = useQuery(userGet);
  const cognitoIdentityId = userQuery?.data?.userGet?.cognitoIdentityId;

  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, {
    variables: { id: match.params.connectionId },
  });

  const [
    getData,
    {
      data: evaluationTemplateGetData,
      loading: evaluationTemplateGetLoading,
      error: evaluationTemplateGetError,
      called,
    },
  ] = useLazyQuery(evaluationTemplateGet);

  useEffect(() => {
    if (connectionGetData) {
      const evaluation = connectionGetData.connectionGet.evaluations.find(
        ({ id }) => id === match.params.evaluationId
      );

      if (evaluation) {
        getData({
          variables: {
            id: evaluation.templateId,
          },
        });
      }
    }
  }, [connectionGetData, getData, match.params.evaluationId]);

  if (
    (!connectionGetData && connectionGetLoading) ||
    !called ||
    (!evaluationTemplateGetData && evaluationTemplateGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (connectionGetError || evaluationTemplateGetError) {
    throw connectionGetError || evaluationTemplateGetError;
  }

  const evaluation = connectionGetData.connectionGet.evaluations.find(
    ({ id }) => id === match.params.evaluationId
  );

  const isYou = evaluation.createdBy === cognitoIdentityId;

  if (!evaluation) {
    return <div>No evaluation..</div>;
  }

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connectionGetData.connectionGet.creative.name}`,
            link: `${startup_page}/${match.params.connectionId}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        <Card>
          <div className={header}>
            <div className={header_title}>Summary</div>

            <div className={header_details}>
              <div className={header_details_small}>
                Last updated {moment(evaluation.updatedAt).format("lll")}
              </div>
              <div className={header_details_regular}>
                Created by {evaluation.createdByUser.given_name}{" "}
                {evaluation.createdByUser.family_name}
              </div>
            </div>
          </div>

          <div className={summary_score_section}>
            {evaluationTemplateGetData.evaluationTemplateGet.sections.map(
              ({ name, questions, id }) => (
                <div className={row} key={id}>
                  <label>{name}</label>
                  <label className={row_score}>
                    {getScore(questions, evaluation.answers)}/
                    {getPossibleScore(questions)}
                  </label>
                </div>
              )
            )}
            <div className={classnames(row, summary_row)}>
              <label>Total</label>
              <label className={row_score}>
                {evaluationTemplateGetData.evaluationTemplateGet.sections.reduce(
                  (acc, { questions }) =>
                    acc + getScore(questions, evaluation.answers),
                  0
                )}
                /
                {evaluationTemplateGetData.evaluationTemplateGet.sections.reduce(
                  (acc, { questions }) => acc + getPossibleScore(questions),
                  0
                )}
              </label>
            </div>
          </div>
        </Card>
        {evaluationTemplateGetData.evaluationTemplateGet.sections.map(
          ({ name, questions, id }) => {
            const sectionScore = getScore(questions, evaluation.answers);
            const sectionPossibleScore = getPossibleScore(questions);
            return (
              <Card key={id}>
                <div className={header}>
                  <div className={header_title}>
                    {name}

                    {isYou && (
                      <div
                        className={link_style}
                        onClick={() => {
                          let path = `${startup_page}/${match.params.connectionId}/evaluationV2/template/${evaluation.templateId}/evaluation/${evaluation.id}?section=${id}`;
                          history.push(path);
                        }}
                      >
                        <i className="fal fa-edit" />
                      </div>
                    )}
                  </div>

                  <div className={header_details}>
                    <div className={header_details_small}>
                      {
                        questions.filter(q =>
                          evaluation.answers.some(
                            ({ questionId }) => questionId === q.id
                          )
                        ).length
                      }{" "}
                      of {questions.length} questions answered
                    </div>
                    <div className={header_details_regular}>
                      {sectionScore} out of {sectionPossibleScore} points
                    </div>
                  </div>
                </div>

                {questions.map(({ name, id, inputType, options }) => {
                  const answer = evaluation.answers.find(
                    ({ questionId, inputType: ansInputType }) =>
                      questionId === id && inputType === ansInputType
                  );
                  return (
                    <div key={id} className={question_each}>
                      <div className={question_each_name}>{name}</div>

                      {!answer && <div className={no_answer}>Not answered</div>}

                      {answer && (
                        <>
                          {(inputType === "INPUT_TEXT" ||
                            inputType === "RADIO") && (
                            <div className={question_answer}>{answer.val}</div>
                          )}

                          {inputType === "TRAFFIC_LIGHTS" && (
                            <div className={question_answer}>
                              <div
                                className={small_traffic_light}
                                style={{
                                  background: `var(--color-${answer.val})`,
                                }}
                              />{" "}
                              {answer.val}
                            </div>
                          )}

                          {inputType === "CHECK" &&
                            evaluation.answers
                              .filter(
                                ({ questionId, val, inputType }) =>
                                  questionId === id &&
                                  val &&
                                  inputType === "CHECK"
                              )
                              .map(({ val, id }) => (
                                <div className={question_answer} key={id}>
                                  {val}
                                </div>
                              ))}
                        </>
                      )}
                      {/*<p>comments</p>*/}
                      {evaluation.answers
                        .filter(
                          ({ inputType, questionId }) =>
                            inputType === "COMMENT" && id === questionId
                        )
                        .map(({ val, id }) => (
                          <div className={question_comments} key={id}>
                            {val}
                          </div>
                        ))}
                      <br />
                    </div>
                  );
                })}
              </Card>
            );
          }
        )}

        {
          <Link
            to={{
              pathname: `${startup_page}/${connectionGetData.connectionGet.id}`,
            }}
          >
            &#60; Back to startup
          </Link>
        }

        {isYou && (
          <div
            className={delete_link_style}
            onClick={async () => {
              if (loadingMutation) return;

              const variables = {
                id: evaluation.id,
                input: { delete: true },
              };
              try {
                await mutate({ variables });
              } catch (error) {
                console.log("error", error);
              }

              let path = `${startup_page}/${connectionGetData.connectionGet.id}`;
              history.push(path, { rightMenu: true });
            }}
          >
            {loadingMutation && (
              <>
                <i className="fa fa-spinner fa-spin" />{" "}
              </>
            )}
            delete evaluation
          </div>
        )}
      </Content>
    </div>
  );
}
