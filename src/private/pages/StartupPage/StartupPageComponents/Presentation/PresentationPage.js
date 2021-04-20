import React, { useState, useEffect } from "react";
import { omit } from "lodash";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Card, SuccessBox } from "Components/elements";
import { presentationPut } from "private/Apollo/Mutations";
import { presentationsGet } from "private/Apollo/Queries";
import styles from "./PresentationPage.module.css";
import { IntroMessage } from "./PresentationComponents/IntroMessage";
import { TagsSection } from "./PresentationComponents/TagsSection";
import { ExternalLinks } from "./PresentationComponents/ExternalLinks";
import { ListOfSharings } from "./PresentationComponents/ListOfSharings";
import { SeekingMoney } from "./PresentationComponents/SeekingMoney";
import { Valuation } from "./PresentationComponents/Valuation";
import { CompanyMeta } from "./PresentationComponents/CompanyMeta";
import { FactsSection } from "./PresentationComponents/FactsSection";
import getCleanData from "./getCleanData";
import { public_presentation } from "definitions.js";

function EditPresentation({ presentations, creative, isViewing, defaultData }) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mutate, { loading }] = useMutation(presentationPut);
  const [presentation, setPresentation] = useState(undefined);
  const [copySuccess, setCopySuccess] = useState(undefined);

  useEffect(() => {
    const dirty = presentations.find(({ email }) => email === isViewing);
    const clean = getCleanData(dirty);
    setPresentation(clean);
  }, [isViewing]);

  function revert() {
    setSaveSuccess(false);
    setPresentation({
      ...presentation,
      ...defaultData,
    });
  }

  const publicLink = `${window.location.protocol}//${
    window.location.host
  }${public_presentation}/${presentation?.id}/${encodeURI(
    presentation?.email
  )}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(publicLink);
    setCopySuccess(true);
  }

  return (
    <div style={{ paddingTop: "30px" }}>
      <div className={styles.header}>
        <div className={styles.header_title}>
          Viewing presentation for{" "}
          <span
            style={{
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-primary)",
            }}
          >
            {presentation?.email}
          </span>
        </div>
      </div>

      <IntroMessage
        presentation={presentation}
        setPresentation={setPresentation}
      />

      <TagsSection
        presentation={presentation}
        setPresentation={setPresentation}
      />

      {/*<CompanyHeader/>*/}

      <div className={styles.info_boxes}>
        <ExternalLinks
          presentation={presentation}
          setPresentation={setPresentation}
        />

        <SeekingMoney
          presentation={presentation}
          setPresentation={setPresentation}
        />

        <Valuation
          presentation={presentation}
          setPresentation={setPresentation}
        />

        <CompanyMeta
          presentation={presentation}
          setPresentation={setPresentation}
        />
      </div>

      <FactsSection
        presentation={presentation}
        setPresentation={setPresentation}
        creative={creative}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Button size="medium" buttonStyle="secondary" onClick={revert}>
          revert to original
        </Button>
        <Button
          size="medium"
          loading={loading}
          iconClass="fal fa-cloud-download"
          onClick={async () => {
            setSaveSuccess(false);
            const variables = {
              id: presentation.id,
              input: {
                email: presentation.email,
                message: presentation.message,
                tags: presentation.tags,
                creativeDetails: {
                  name: presentation?.creativeDetails?.name || creative.name,
                  location: presentation?.creativeDetails?.location,
                  contactPerson: presentation?.creativeDetails?.contactPerson,
                  externalLinks: presentation?.creativeDetails?.externalLinks,
                  seeking: presentation?.creativeDetails?.seeking,
                  valuation: presentation?.creativeDetails?.valuation,
                  sections: presentation?.creativeDetails?.sections,
                },
              },
            };
            try {
              await mutate({ variables });
              setSaveSuccess(true);
            } catch (err) {
              console.log("err", err);
            }
          }}
        >
          save
        </Button>
      </div>

      {saveSuccess && (
        <div
          style={{
            textAlign: "right",
            fontSize: "12px",
            color: "green",
            paddingTop: "10px",
          }}
        >
          successfully saved
        </div>
      )}

      <div
        style={{
          paddingTop: "20px",
          fontSize: "14px",
        }}
      >
        <Card style={{ paddingBottom: "20px" }}>
          <div>
            The link below gives access to this presentation. No account is
            needed.
          </div>

          <div
            style={{
              padding: "10px 0px",
            }}
          >
            <SuccessBox
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-secondary)",
              }}
            >
              <a href={publicLink} target="_blank" rel="noopener noreferrer">
                {publicLink}
              </a>
            </SuccessBox>

            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={copyToClipboard}
            >
              {copySuccess ? "link copied to clipboard" : "copy link"}
            </div>
          </div>

          <div>
            <a
              href={`mailto:${presentation?.email}?subject=Take a look at ${creative.name}!&body=Hello!%0D%0A%0D%0ATake a look at this startup:%0D%0A${publicLink}`}
            >
              Send mail with link
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

function addQuestionIndex(creativeAnswersBySection) {
  const res = {};

  for (const sectionId in creativeAnswersBySection) {
    const section = creativeAnswersBySection[sectionId];
    const answersByQuestion = {};
    let indexCount = 0;
    section.answers.forEach(answer => {
      answersByQuestion[answer.questionId] = answersByQuestion[
        answer.questionId
      ] || {
        questionName: answer.question,
        index: indexCount++,
        answers: [],
      };
      answersByQuestion[answer.questionId].answers.push(answer);
    });

    let newAnswers = [];

    for (const questionId in answersByQuestion) {
      const { index, answers } = answersByQuestion[questionId];
      newAnswers = [...newAnswers, ...answers.map(a => ({ ...a, index }))];
    }

    res[sectionId] = {
      ...section,
      answers: newAnswers,
    };
  }

  return res;
}

export function getDefaultData({ creative }) {
  let creativeAnswersBySection = {};
  (creative?.answers || []).forEach((answer, index) => {
    if (answer.sectionId) {
      creativeAnswersBySection[answer.sectionId] = creativeAnswersBySection[
        answer.sectionId
      ] || {
        name: answer.sectionName,
        answers: [],
      };

      const newAnswer = {
        ...omit(answer, ["__typename"]),
      };

      if (answer.pageMeta) {
        newAnswer.pageMeta = omit(answer.pageMeta, ["__typename"]);
      }

      creativeAnswersBySection[answer.sectionId].answers.push(newAnswer);
    }
  });

  creativeAnswersBySection = addQuestionIndex(creativeAnswersBySection);

  const sections = Object.keys(creativeAnswersBySection || {}).map(
    (sectionId, index) => ({
      ...creativeAnswersBySection[sectionId],
      index,
    })
  );

  const creativeDetails = {
    sections,
  };

  const website = creative.answers.find(
    ({ questionId }) => questionId === "q06_section_info"
  );
  const slideDecks = creative.answers.find(
    ({ questionId }) => questionId === "q01_section_materials"
  );

  const seeking = creative.answers.find(
    ({ questionId }) => questionId === "q03_section_money"
  );
  const valuation = creative.answers.find(
    ({ questionId }) => questionId === "q04_section_money"
  );

  const location = creative.answers.find(
    ({ questionId }) => questionId === "q04_section_info"
  );
  const contactPerson = creative.answers.find(
    ({ questionId }) => questionId === "q05_section_info"
  );
  const name = creative.name;

  if (location) creativeDetails.location = location.val;

  if (contactPerson) creativeDetails.contactPerson = contactPerson.val;

  if (name) creativeDetails.name = name;

  creativeDetails.externalLinks = [];

  if (website) {
    creativeDetails.externalLinks.push({
      key: website.val,
      val: "website",
    });
  }

  if (slideDecks) {
    creativeDetails.externalLinks.push({
      key: slideDecks.val,
      val: "pitch deck",
    });
  }

  if (seeking) {
    const parts = seeking.val.split(" ");
    const key = parts[0];
    const val = parts.slice(1, parts.length).join(" ");
    creativeDetails.seeking = {
      key,
      val,
    };
  }

  if (valuation) {
    const parts = valuation.val.split(" ");
    const key = parts[0];
    const val = parts.slice(1, parts.length).join(" ");
    creativeDetails.valuation = {
      key,
      val,
    };
  }

  return { creativeDetails };
}

export function PresentationPage({
  connectionId,
  creativeId,
  creative,
  history,
}) {
  const [getPresentations, presentationsQuery] = useLazyQuery(presentationsGet);
  const [isViewing, setIsViewing] = useState(undefined);

  useEffect(() => {
    if (connectionId) {
      console.log("presentationsGet", presentationsGet);
      console.log("connectionId", connectionId);

      getPresentations({
        variables: { connectionId },
      });
    }
  }, [connectionId]);

  const presentations = presentationsQuery?.data?.presentationsGet;
  const defaultData = getDefaultData({ creative });

  return (
    <div>
      <ListOfSharings
        connectionId={connectionId}
        creativeId={creativeId}
        creative={creative}
        presentations={presentations}
        history={history}
        isViewing={isViewing}
        setIsViewing={setIsViewing}
        defaultData={defaultData}
      />

      <hr />

      {isViewing && (
        <EditPresentation
          connectionId={connectionId}
          creativeId={creativeId}
          creative={creative}
          presentations={presentations}
          history={history}
          isViewing={isViewing}
          setIsViewing={setIsViewing}
          defaultData={defaultData}
        />
      )}
    </div>
  );
}
