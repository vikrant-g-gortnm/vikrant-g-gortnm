import React, { useState } from "react";
import styles from "./EvaluationBox.module.css";
import classnames from "classnames";
import moment from "moment";
import { startup_page } from "definitions.js";
import SummaryLine from "./SummaryLine";

function getEvaluationSummaries({ evaluations, hide }) {
  let data = [];

  // Cluster evaluations by template ID
  // ––––––––––––––––––––––––––––––––––
  let evaluationsByTemplate = {};
  for (let evaluation of evaluations) {
    evaluationsByTemplate[evaluation.templateId] =
      evaluationsByTemplate[evaluation.templateId] || [];
    evaluationsByTemplate[evaluation.templateId].push(evaluation);
  }

  for (let templateId in evaluationsByTemplate) {
    // Get all shared evaluations
    let evaluations = evaluationsByTemplate[templateId] || [];

    // Get possible score
    let possibleScore = evaluations[0]?.summary?.possibleScore;

    // Get template name
    let templateName = evaluations[0]?.summary?.templateName;

    // Get template sections
    let templateSections = evaluations[0]?.summary?.sections || [];

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
    data.push({
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

  return data;
}

export default function TeamEvaluations({ connection, user, history }) {
  let [hide, setHide] = useState({});

  const evaluations = connection.evaluations || [];

  let data = getEvaluationSummaries({ evaluations, hide });

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }

  if (!data.length) {
    return <span />;
  }

  return (
    <div className={styles.group_of_evaluations}>
      <div className={styles.from_group}>
        <span>Your evaluations</span>
      </div>

      {data.map((templateData, i) => {
        let {
          templateName,
          averagePercentageScore,
          evaluations,
          templateSections,
        } = templateData;

        let list = templateSections.map(item => ({
          name: item.name,
          percentageScore: Math.round((item.score / item.possibleScore) * 100),
        }));

        return (
          <div key={i} className={styles.each_template_style}>
            <div className={styles.header_style}>
              <SummaryLine
                hide={hide}
                name={templateName}
                percentageScore={averagePercentageScore}
                className={classnames(styles.template_summary_line)}
                list={list.length > 1 && list}
                history={history}
              />
            </div>

            {evaluations.map((evaluation, ii) => {
              let { given_name, family_name, email } =
                evaluation.createdByUser || {};
              let totalScore = evaluation?.summary?.totalScore || 0;
              let possibleScore = evaluation?.summary?.possibleScore || 0;
              let percentageScore = Math.round(
                (totalScore / possibleScore) * 100
              );

              let list = (evaluation.summary?.sections || []).map(item => {
                let totalScore = item.score || 0;
                let possibleScore = item.possibleScore || 0;
                return {
                  name: item.name,
                  percentageScore: Math.round(
                    (totalScore / possibleScore) * 100
                  ),
                };
              });

              let editLink =
                `${startup_page}` +
                `/${connection.id}` +
                `/evaluationV2` +
                `/template/${evaluation.templateId}` +
                `/evaluation/${evaluation.id}` +
                `?section=all`;

              let summaryLink =
                `${startup_page}` +
                `/${connection.id}` +
                `/evaluation_summary/${evaluation.id}`;

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
      })}
    </div>
  );
}
