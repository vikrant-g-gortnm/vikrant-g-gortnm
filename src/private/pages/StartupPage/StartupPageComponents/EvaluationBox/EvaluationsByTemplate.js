import React from "react";
import styles from "./EvaluationBox.module.css";
import SummaryLine from "./SummaryLine";
import classnames from "classnames";
import moment from "moment";
import { startup_page } from "definitions.js";

export default function EvaluationsByTemplate({
  data,
  connection,
  user,
  hide,
  toggleHide,
  showUsers,
  showScores,
  isAdmin,
  history,
}) {
  let list = Object.keys(data.averagePerTemplateSection).map(sectionName => {
    let item = data.averagePerTemplateSection[sectionName];

    // Averages for each answer
    let scorePerAnswer = Object.keys(item.scorePerAnswer).map(questionName => {
      let it = item.scorePerAnswer[questionName];
      let averageScore = it.totalScore / it.count;
      let percentageScore = Math.round((averageScore / it.possibleScore) * 100);
      let res = {
        question: questionName,
        score: averageScore.toFixed(1),
        possibleScore: it.possibleScore,
        percentageScore: percentageScore,
      };
      return res;
    });

    // Averages for each section
    let averageScore = item.totalScore / item.count;
    let res = {
      name: sectionName,
      possibleScore: item.possibleScore,
      percentageScore: Math.round((averageScore / item.possibleScore) * 100),
      score: averageScore.toFixed(1),
      scorePerAnswer,
    };
    return res;
  });

  return (
    <div className={styles.each_template_style}>
      <div className={styles.header_style}>
        <SummaryLine
          hide={hide}
          name={data.templateName}
          percentageScore={data.averagePercentageScore}
          score={data.averageScore}
          possibleScore={data.possibleScore}
          className={classnames(styles.template_summary_line)}
          timeStamp={`${data?.evaluations?.length || 0} submissions`}
          list={!!list.length && list}
          numberScore={false}
          history={history}
        />
      </div>

      {(showUsers || isAdmin) &&
        data.evaluations.map((evaluation, i) => {
          let { given_name, family_name, email } =
            evaluation.createdByUser || {};
          let percentageScore = Math.round(
            (evaluation.summary.totalScore / evaluation.summary.possibleScore) *
              100
          );

          let list = (evaluation.summary?.sections || []).map(item => {
            let sa = {
              name: item.name,
              percentageScore: Math.round(
                (item.score / item.possibleScore) * 100
              ),
              scorePerAnswer: item.scorePerAnswer,
              score: item.score,
              possibleScore: item.possibleScore,
              numberScore: true,
            };
            return sa;
          });

          let editLink =
            connection &&
            `${startup_page}/${connection.id}/evaluation/${evaluation.id}`;
          if (connection && evaluation.summary?.sections[0]?.sectionId) {
            editLink += `/section/${evaluation.summary?.sections[0]?.sectionId}`;
          }

          return (
            <SummaryLine
              key={i}
              hide={hide}
              toggleHide={toggleHide}
              evaluationId={evaluation.id}
              timeStamp={moment(evaluation.updatedAt).format("ll")}
              name={`${given_name} ${family_name}`}
              isYou={user.email === email}
              editLink={editLink}
              percentageScore={percentageScore}
              score={evaluation.summary.totalScore}
              possibleScore={evaluation.summary.possibleScore}
              className={classnames(styles.each_evaluation_line)}
              list={list}
              history={history}
              numberScore={false}
            />
          );
        })}
    </div>
  );
}
