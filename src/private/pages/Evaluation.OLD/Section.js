import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

import {
  Card,
  Content,
  BreadCrumbs,
  Button,
  GhostLoader,
} from "Components/elements";

import {
  evaluationTemplateGet,
  evaluationTemplateSectionGet,
  connectionGet,
} from "private/Apollo/Queries";

import GeneralInput from "./form_containers/GeneralInput";
import { startup_page } from "definitions.js";

function Navigation({ connection, evaluationId, sectionId, history }) {
  // Get all sections of evaluation template,
  // so that we can navigate to next section.
  // TODO: make a leaner query for this.
  const [getEvaluationTemplateData, evaluationTemplateQuery] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    if (connection.evaluations.length) {
      const evaluation = connection.evaluations.find(
        ({ id }) => id === evaluationId
      );

      if (evaluation) {
        getEvaluationTemplateData({
          variables: { id: evaluation.templateId },
        });
      }
    }
  }, [connection.evaluations, evaluationId, getEvaluationTemplateData]);

  const evaluationTemplate =
    evaluationTemplateQuery.data?.evaluationTemplateGet || {};

  const sections = evaluationTemplate.sections || [];

  let currentIndex = sections.map(s => s.id).indexOf(sectionId);

  return (
    <div className="text-right">
      <div style={{ marginBottom: "10px" }}>
        {(currentIndex !== sections.length - 1 && (
          <Button
            type="right_arrow"
            onClick={() => {
              let path = `${startup_page}/${
                connection.id
              }/evaluation/${evaluationId}/section/${
                sections[currentIndex + 1].id
              }`;
              history.push(path);
            }}
          >
            {sections[currentIndex + 1].name}
          </Button>
        )) || (
          <Button
            type="right_arrow"
            onClick={() => {
              let path = `${startup_page}/${connection.id}/evaluation/${evaluationId}/summary`;
              history.push(path);
            }}
          >
            Go to summary
          </Button>
        )}
      </div>

      <div style={{ lineHeight: "2" }}>
        <div>
          <Button
            type="just_text"
            onClick={() => {
              let path = `${startup_page}/${connection.id}/evaluation/${evaluationId}`;
              history.push(path);
            }}
          >
            Go to overview
          </Button>
        </div>

        {currentIndex !== sections.length - 1 && (
          <div>
            <Button
              type="just_text"
              onClick={() => {
                let path = `${startup_page}/${connection.id}/evaluation/${evaluationId}/summary`;
                history.push(path);
              }}
            >
              Go to summary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Section({ match, history }) {
  const { connectionId, sectionId, evaluationId } = match.params;

  // Get connection
  const connectionQuery = useQuery(connectionGet, {
    variables: { id: connectionId },
  });

  const connection = connectionQuery.data?.connectionGet || {
    creative: {},
    evaluations: [],
  };

  // Get evaluation template section
  const evaluationTemplateSectionQuery = useQuery(
    evaluationTemplateSectionGet,
    {
      variables: { id: sectionId },
    }
  );

  // console.log('connectionQuery', connectionQuery)
  // console.log('evaluationTemplateSectionQuery', evaluationTemplateSectionQuery)

  const evaluationTemplateSection =
    evaluationTemplateSectionQuery.data?.evaluationTemplateSectionGet;

  // Define loading & error
  // const loading =
  //   connectionQuery.loading || evaluationTemplateSectionQuery.loading;

  const error = connectionQuery.error || evaluationTemplateSectionQuery.error;

  // Filter out current evaluation
  let evaluation = connection.evaluations.find(({ id }) => id === evaluationId);

  // console.log("evaluation", evaluation);

  // if (loading && !connectionQuery.data) {
  if (!evaluation || !evaluationTemplateSection) {
    return <GhostLoader />;
  }

  if (error) throw error;

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connection.creative.name}`,
            link: `${startup_page}/${connectionId}`,
          },
          {
            val: `Template: ${evaluation.name}`,
            link: `${startup_page}/${connectionId}/evaluation/${evaluation.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <div className="form_h1">{evaluationTemplateSection.name}</div>
        <div className="form_p1">{evaluationTemplateSection.description}</div>

        {(evaluationTemplateSection.questions || []).map((question, i) => (
          <Card
            key={`question-${i}-${question.id}`}
            style={{ marginBottom: "10px" }}
          >
            <GeneralInput
              section={evaluationTemplateSection}
              question={question}
              templateId={evaluation.templateId}
              evaluation={evaluation}
              connectionId={connectionId}
            />
          </Card>
        ))}

        <Navigation
          connection={connection}
          sectionId={sectionId}
          evaluationId={evaluationId}
          history={history}
        />
      </Content>
    </div>
  );
}
