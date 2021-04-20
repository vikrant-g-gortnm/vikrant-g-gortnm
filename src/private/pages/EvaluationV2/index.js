import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { omit } from "lodash";

import {
  connectionGet,
  evaluationTemplateGet,
  evaluationGet,
} from "private/Apollo/Queries";

import { evaluationCreate, evaluationUpdate } from "../../Apollo/Mutations";

import { startup_page } from "definitions";

// Components
import { ContentCard } from "Components/UI_kit/";
import { GhostLoader } from "Components/elements";
import TemplatedForm from "Components/Forms/TemplatedForm";

import BackButton from "./BackButton";
import Navigation from "./Navigation";

export default function Evaluation({ match, history, location }) {
  const { connectionId, templateId, evaluationId } = match.params;

  const [answers, setAnswersState] = useState([]);

  /* *********************** */
  /* Get evaluation template */
  /* *********************** */
  const [getEvaluationTemplate, evaluationTemplateQuery] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    if (templateId) {
      getEvaluationTemplate({
        variables: { id: templateId },
      });
    }
  }, [templateId]);

  const evaluationTemplate =
    evaluationTemplateQuery?.data?.evaluationTemplateGet;

  /* ************** */
  /* Get connection */
  /* ************** */
  const [getConnection, connectionQuery] = useLazyQuery(connectionGet);

  useEffect(() => {
    if (connectionId) {
      getConnection({
        variables: { id: connectionId },
      });
    }
  }, [connectionId]);

  const connection = connectionQuery?.data?.connectionGet;

  /* ************** */
  /* Get evaluation */
  /* ************** */
  const [getEvaluation, evaluationQuery] = useLazyQuery(evaluationGet);

  useEffect(() => {
    if (evaluationId) {
      getEvaluation({
        variables: { id: evaluationId },
      });
    }
  }, [evaluationId]);

  const evaluation = evaluationQuery?.data?.evaluationGet;

  // Load answers from query to state
  useEffect(() => {
    if (evaluation && evaluation.answers) {
      let answers = evaluation.answers.map(a => omit(a, ["__typename", "id"]));
      setAnswers(answers);
    }
  }, [evaluation]);

  // ------------------

  useEffect(() => {
    if (!evaluation) {
      try {
        let res = localStorage.getItem(
          `evaluation:${connectionId}/${templateId}`
        );
        res && setAnswersState(JSON.parse(res));
      } catch (error) {
        localStorage.removeItem(`evaluation:${connectionId}/${templateId}`);
        setAnswersState([]);
      }
    }
  }, [connectionId, templateId]);

  // Set answers temporarily
  function setAnswers(newAnswers) {
    // Set answers in local store
    localStorage.setItem(
      `evaluation:${connectionId}/${templateId}`,
      JSON.stringify(newAnswers)
    );

    // Set answers in state
    setAnswersState(newAnswers);
  }

  // ------------------

  const [loading, setLoading] = useState(false);
  const [createEvaluation] = useMutation(evaluationCreate);
  const [updateEvaluation] = useMutation(evaluationUpdate);

  async function save() {
    if (loading) return;
    setLoading(true);

    // Create new item
    if (!evaluationId) {
      let variables = {
        connectionId,
        templateId,
        answers,
      };
      try {
        let res = await createEvaluation({ variables });
        let { id } = res?.data?.evaluationCreate;
        localStorage.removeItem(`evaluation:${connectionId}/${templateId}`);
        let path = `${startup_page}/${connectionId}/evaluation_summary/${id}`;
        history.push(path);
      } catch (error) {
        console.log("error", error);
      }
    }

    // Update existing item
    if (evaluationId) {
      let variables = {
        id: evaluationId,
        answers,
      };
      try {
        await updateEvaluation({ variables });
        localStorage.removeItem(`evaluation:${connectionId}/${templateId}`);
        let path = `${startup_page}/${connectionId}/evaluation_summary/${evaluationId}`;
        history.push(path);
      } catch (error) {
        console.log("error", error);
      }
    }

    setLoading(false);
  }

  if (!evaluationTemplate) {
    return <GhostLoader />;
  }

  if (evaluationId && !evaluation) {
    return <GhostLoader />;
  }

  return (
    <ContentCard>
      <div
      // style={{
      //   position: "relative",
      //   padding: "30px 40px"
      // }}
      >
        <BackButton
          connection={connection}
          onClick={() => {
            let path = `${startup_page}/${connection.id}?tab=evaluations`;
            history.push(path);
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "start",
          marginTop: "35px",
        }}
      >
        <div style={{ width: "350px" }}>
          <Navigation
            sections={evaluationTemplate.sections || []}
            history={history}
            location={location}
          />
        </div>

        <div>
          {/* Roll out templated form */}
          <TemplatedForm
            template={{
              sections: evaluationTemplate.sections,
            }}
            location={location}
            submit={answers => {
              console.log("answers", answers);
              // let variables = {
              //   id: creative.id,
              //   input: { answers },
              // };
              // mutate({ variables });
            }}
          />
        </div>
      </div>
    </ContentCard>
  );
}
