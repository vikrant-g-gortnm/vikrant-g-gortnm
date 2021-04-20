import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { evaluationTemplateGet } from "private/Apollo/Queries";

import { getPossibleScore } from "../../EvaluationV2/Summary/util";
import { Card, GhostLoader, Content } from "Components/elements";

import {
  header,
  header_title,
  header_details,
  header_details_small,
  header_details_regular,
  question_each,
  question_each_name,
  question_each_score,
} from "./EvaluationTemplateSummary.module.css";

export default function Summary({ match, history }) {
  const [getData, { data, loading, error, called }] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    getData({
      variables: {
        id: match.params.templateId,
      },
    });
  }, [getData, match.params.templateId]);

  if ((!data && loading) || !called) {
    return <GhostLoader />;
  }

  if (error) throw error;

  const template = data.evaluationTemplateGet;

  return (
    <div>
      <Content maxWidth={780}>
        <h1>{template.name}</h1>

        {template.sections.map(({ name, questions, id }) => {
          // const sectionScore = getScore(questions, evaluation.answers);
          const sectionPossibleScore = getPossibleScore(questions);
          return (
            <Card
              key={id}
              style={{
                paddingBottom: "20px",
                marginBottom: "5px",
              }}
            >
              <div className={header}>
                <div className={header_title}>{name}</div>

                <div className={header_details}>
                  <div className={header_details_small}>
                    {questions.length} questions
                  </div>
                  <div className={header_details_regular}>
                    maximum score:{" "}
                    <span className={question_each_score}>
                      {sectionPossibleScore}
                    </span>
                  </div>
                </div>
              </div>

              {questions.map(question => {
                let { name, id } = question;

                return (
                  <div key={id} className={question_each}>
                    <div className={question_each_name}>{name}</div>
                    <div className={question_each_score}>
                      {getPossibleScore([question])}
                    </div>
                  </div>
                );
              })}
            </Card>
          );
        })}
      </Content>
    </div>
  );
}
