import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import moment from "moment";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { evaluationPut } from "private/Apollo/Mutations";
import { startup_page, group as group_route } from "definitions.js";
import { Button } from "Components/elements";
import styles from "./EvaluationBox.module.css";
import { EvaluationRequest } from "./EvaluationRequest";

import NewEvaluationLogic from "./NewEvaluationLogic";

import TeamEvaluations from "./TeamEvaluations";
import SummaryLine from "./SummaryLine";

function getEvaluationSummaries({ connection, groups, hide }) {
  // Get all shared evaluations
  // ––––––––––––––––––––––––––
  let sharedEvaluations = [];
  for (let sharedItem of connection.sharedWithMe) {
    if (sharedItem.connection) {
      for (let sharedEvaluation of sharedItem.connection.evaluations) {
        if (sharedItem.evaluations) {
          sharedEvaluations.push({
            evaluation: sharedEvaluation,
            sharedItem,
          });
        }
      }
    }
  }

  // Cluster evaluations by groupId
  // ––––––––––––––––––––––––––––––
  let evaluationsByGroup = {};
  for (let { evaluation, sharedItem } of sharedEvaluations) {
    evaluationsByGroup[sharedItem.groupId] =
      evaluationsByGroup[sharedItem.groupId] || [];
    evaluationsByGroup[sharedItem.groupId].push({ evaluation, sharedItem });
  }

  let data = [];

  for (let groupId in evaluationsByGroup) {
    let thisGroup = groups.find(g => g.id === groupId) || {};
    let sharedEvaluationsInGroup = evaluationsByGroup[groupId];

    // Cluster evaluations by template ID
    // ––––––––––––––––––––––––––––––––––
    let evaluationsByTemplate = {};
    for (let { evaluation } of sharedEvaluationsInGroup) {
      evaluationsByTemplate[evaluation.templateId] =
        evaluationsByTemplate[evaluation.templateId] || [];
      evaluationsByTemplate[evaluation.templateId].push(evaluation);
    }

    let data2 = [];
    for (let templateId in evaluationsByTemplate) {
      // Get all shared evaluations
      let evaluations = evaluationsByTemplate[templateId] || [];

      // Get possible score
      let possibleScore = evaluations[0]?.summary?.possibleScore;

      // Get template name
      let templateName = evaluations[0]?.summary?.templateName;

      // Get template sections
      let templateSections = evaluations[0]?.summary?.sections;

      // Get total score
      let totalScore = 0;
      let count = 0;
      for (let evaluation of evaluations) {
        if (!hide[evaluation.id]) {
          totalScore += evaluation.summary?.totalScore || 0;
          count += 1;
        }
      }

      // Get average score
      let averageScore = parseFloat((totalScore / count).toFixed(1));

      // Get average percentage score
      let averagePercentageScore =
        Math.round((averageScore / possibleScore) * 100) || 0;

      // Put it all together
      data2.push({
        groupName: thisGroup.name,
        groupId: thisGroup.id,
        templateId: templateId,
        templateName: templateName,
        submissions: evaluations.length,
        averageScore: averageScore,
        possibleScore: possibleScore,
        averagePercentageScore: averagePercentageScore,
        templateSections: templateSections,
        evaluations: evaluations,
      });
    }

    data.push(data2);
  }
  return data;
}

function EvaluationsByTemplate({
  data,
  connection,
  user,
  templateId,
  hide,
  toggleHide,
  history,
  settings,
}) {
  let list = (data.templateSections || []).map(item => ({
    name: item.name,
    percentageScore: Math.round((item.score / item.possibleScore) * 100),
  }));

  return (
    <div className={styles.each_template_style}>
      <div className={styles.header_style}>
        <SummaryLine
          hide={hide}
          name={data.templateName}
          percentageScore={data.averagePercentageScore}
          className={classnames(styles.template_summary_line)}
          list={list.length > 1 && list}
          history={history}
        />
      </div>

      {settings.showUsers &&
        data.evaluations.map((evaluation, i) => {
          let { given_name, family_name, email } =
            evaluation.createdByUser || {};
          let percentageScore = Math.round(
            (evaluation.summary.totalScore / evaluation.summary.possibleScore) *
              100
          );

          let list = (evaluation.summary?.sections || []).map(item => ({
            name: item.name,
            percentageScore: Math.round(
              (item.score / item.possibleScore) * 100
            ),
          }));

          let editLink = `${startup_page}/${connection.id}/evaluation/${evaluation.id}`;
          let summaryLink = `${startup_page}/${connection.id}/evaluation_summary/${evaluation.id}`;

          return (
            <SummaryLine
              key={evaluation.id}
              hide={hide}
              toggleHide={toggleHide}
              evaluationId={evaluation.id}
              timeStamp={moment(evaluation.updatedAt).format("ll")}
              name={`${given_name} ${family_name}`}
              isYou={user.email === email}
              editLink={editLink}
              summaryLink={summaryLink}
              percentageScore={percentageScore}
              className={classnames(styles.each_evaluation_line)}
              list={list.length > 1 && list}
              history={history}
            />
          );
        })}
    </div>
  );
}

function PublicEvaluations({ publicEvaluations, history }) {
  let [showList, setShowList] = useState(false);
  let [hide, setHide] = useState({});

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }

  if (!publicEvaluations.length) {
    return <span />;
  }

  return (
    <div className={styles.group_of_evaluations}>
      <div className={styles.from_group}>
        <span>External evaluations</span>
      </div>
      {publicEvaluations.map((evaluation, i) => {
        let { given_name, family_name, email } = evaluation;

        let percentageScore = Math.round(
          (evaluation.summary.totalScore / evaluation.summary.possibleScore) *
            100
        );

        let list = (evaluation.summary?.sections || []).map(item => ({
          name: item.name,
          percentageScore: Math.round((item.score / item.possibleScore) * 100),
        }));

        return (
          <SummaryLine
            key={i}
            hide={hide}
            toggleHide={toggleHide}
            evaluationId={evaluation.id}
            timeStamp={moment(evaluation.updatedAt).format("ll")}
            name={`${given_name} ${family_name}`}
            isYou={false}
            percentageScore={percentageScore}
            className={classnames(styles.each_evaluation_line)}
            list={list}
            history={history}
          />
        );
      })}
    </div>
  );
}

function GroupEvaluations({
  connection,
  groups,
  user,
  evaluations,
  evaluationTemplates,
  history,
}) {
  const [hide, setHide] = useState({});
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate] = useMutation(evaluationPut);

  let data = getEvaluationSummaries({
    connection,
    groups,
    evaluations,
    evaluationTemplates,
    hide,
  });

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }
  // console.log('data', data)

  return (
    <div>
      {data
        .filter(groupEvaluations => {
          let { groupId } = groupEvaluations[0] || {};
          let group = groups.find(({ id }) => id === groupId);
          const settings = group.settings || {};
          return settings.showScores;
        })
        .map(groupEvaluations => {
          let { groupName, groupId } = groupEvaluations[0] || {};
          let group = groups.find(({ id }) => id === groupId);
          const settings = group.settings || {};
          let groupEvaluationTemplates = (
            group.evaluationTemplates || []
          ).filter(template => {
            let hasEvaluated = connection.evaluations.find(
              ({ templateId, createdBy }) => {
                let templateMatch = templateId === template.id;
                let userMatch = createdBy === user.cognitoIdentityId;
                return templateMatch && userMatch;
              }
            );
            return !hasEvaluated;
          });

          return (
            <div key={groupId}>
              <div className={styles.group_of_evaluations}>
                <div>
                  <div className={styles.from_group}>
                    <span>From group: </span>
                    <Link
                      to={{
                        pathname: `${group_route}/${groupId}`,
                      }}
                    >
                      {groupName}
                    </Link>
                  </div>

                  {groupEvaluations.map(d => {
                    return (
                      <EvaluationsByTemplate
                        key={d.templateId}
                        templateId={d.templateId}
                        connection={connection}
                        user={user}
                        data={d}
                        hide={hide}
                        toggleHide={toggleHide}
                        settings={settings}
                        history={history}
                      />
                    );
                  })}
                </div>
              </div>

              {!!groupEvaluationTemplates.length && (
                <div className={styles.group_footer}>
                  <div className={styles.group_footer_title}>
                    You are kindly requested to share the following with{" "}
                    {group.name}:
                  </div>

                  <div className={styles.group_footer_buttons_container}>
                    {groupEvaluationTemplates.map(template => {
                      return (
                        <div
                          className={styles.group_footer_button}
                          key={`${groupId}-${template.id}`}
                        >
                          <Button
                            type="right_arrow"
                            size="medium"
                            key={`${group.id}-${template.id}`}
                            loading={currentLoading === template.id}
                            onClick={async () => {
                              if (currentLoading === template.id) return;

                              setCurrentLoading(template.id);

                              let sectionId = template.sections[0]?.id;

                              try {
                                let variables = {
                                  connectionId: connection.id,
                                  groupId: group.id,
                                  input: {
                                    templateId: template.id,
                                    name: template.name,
                                    description: template.description,
                                  },
                                };

                                let res = await mutate({ variables });
                                let evaluation = res.data.evaluationPut;
                                let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${sectionId}`;
                                history.push(path);
                              } catch (error) {
                                console.log("error", error);
                              }
                              setCurrentLoading("");
                            }}
                          >
                            {template.name}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export function EvaluationBox({ connection, groups, user, history }) {
  if (!connection) return <span />;
  const evaluations = connection.evaluations || [];

  // const publicEvaluations = connection.publicEvaluations || [];

  return (
    <>
      {!evaluations.length && (
        <div style={{ paddingTop: "20px" }}>
          <div style={{ fontSize: "18px" }}>Evaluate this startup</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            Evaluate this startup based on your own criteria, or choose from
            predefined templates.
          </div>
        </div>
      )}

      {/*<PublicEvaluations*/}
      {/*  publicEvaluations={publicEvaluations}*/}
      {/*  connection={connection}*/}
      {/*  history={history}*/}
      {/*  evaluationTemplates={templates}*/}
      {/*  user={user}*/}
      {/*/>*/}

      {/*<GroupEvaluations*/}
      {/*  groups={groups}*/}
      {/*  evaluations={evaluations}*/}
      {/*  connection={connection}*/}
      {/*  evaluationTemplates={templates}*/}
      {/*  user={user}*/}
      {/*  history={history}*/}
      {/*/>*/}

      <TeamEvaluations connection={connection} user={user} history={history} />

      <NewEvaluationLogic connection={connection} history={history} />
    </>
  );
}
