import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { Card, Button, ErrorBox, GhostLoader } from "Components/elements";

import { evaluationTemplateSectionGet } from "public/Apollo/Queries";

import GeneralInput from "./form_containers/GeneralInput";
import styles from "./EvaluationPage.module.css";

function Navigation({
  sections,
  sectionId,
  setSectionId,
  setSubmit,
  isSubmit,
  submitEvaluation,
}) {
  let currentIndex = sections.map(s => s.id).indexOf(sectionId);

  const cols = useMemo(() => {
    window.scrollTo(0, 0);
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginBottom: "10px" }}>
          {(isSubmit && (
            <Button
              type="left_arrow"
              size="large"
              onClick={() => setSubmit(false)}
            >
              {sections[currentIndex].name}
            </Button>
          )) ||
            (currentIndex !== 0 && (
              <Button
                type="left_arrow"
                size="large"
                onClick={() => setSectionId(sections[currentIndex - 1].id)}
              >
                {sections[currentIndex - 1].name}
              </Button>
            )) ||
            ""}
        </div>
        <div style={{ marginBottom: "10px" }}>
          {(isSubmit && (
            <Button type="right_arrow" onClick={submitEvaluation}>
              Submit
            </Button>
          )) ||
            (currentIndex !== sections.length - 1 && (
              <Button
                type="right_arrow"
                onClick={() => setSectionId(sections[currentIndex + 1].id)}
              >
                {sections[currentIndex + 1].name}
              </Button>
            )) || (
              <Button type="right_arrow" onClick={() => setSubmit(true)}>
                Continue
              </Button>
            )}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSectionId, isSubmit, setSubmit, currentIndex, sections]);
  return cols;
}

function SubmitForm({ setPersonalData }) {
  const { register, handleSubmit } = useForm();

  return (
    <Card key="submit" style={{ marginBottom: "30px" }}>
      <div className="form_h2">Who are you?</div>

      <form
        onSubmit={handleSubmit(setPersonalData)}
        className="notata_form mb3"
      >
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="firstname"
            placeholder="First name"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="lastname"
            placeholder="Last name"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="email"
            placeholder="Email"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
      </form>
    </Card>
  );
}

function checkErrors(answers, personalData) {
  let errs = [];

  if (answers.length === 0)
    errs.push(
      "You didn't provide any evaluations, please return to previous sections and fill in at least 1 question."
    );

  if (!personalData.firstname || !personalData.lastname || !personalData.email)
    errs.push("Contact info is not provided.");

  return errs;
}

export default function Section({
  sections,
  sectionId,
  setSectionId,
  answers,
  setAnswers,
  submitEvaluation,
}) {
  const [isSubmit, setSubmit] = useState(false);
  const [personalData, setPersonalData] = useState({});
  const [errors, setErrors] = useState([]);

  // Get evaluation template section
  const evaluationTemplateSectionQuery = useQuery(
    evaluationTemplateSectionGet,
    {
      variables: { id: sectionId },
      context: { clientName: "public" },
    }
  );

  const evaluationTemplateSection =
    evaluationTemplateSectionQuery.data?.evaluationTemplateSectionGet;

  if (!evaluationTemplateSection) return <GhostLoader />;

  let currentForm;
  if (isSubmit) currentForm = <SubmitForm setPersonalData={setPersonalData} />;
  else
    currentForm = (
      <>
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
              answers={answers}
              setAnswers={setAnswers}
            />
          </Card>
        ))}
      </>
    );

  return (
    <>
      {currentForm}

      {!!errors.length && isSubmit && (
        <ErrorBox className="mb3">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </ErrorBox>
      )}

      <Navigation
        sections={sections}
        sectionId={sectionId}
        setSectionId={setSectionId}
        setSubmit={setSubmit}
        isSubmit={isSubmit}
        submitEvaluation={() => {
          const errors = checkErrors(answers, personalData);
          setErrors(errors);
          if (errors.length) return;
          submitEvaluation(personalData);
        }}
      />
    </>
  );
}
