import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { creativePut } from "public/Apollo/Mutations";
import { omit } from "lodash";
import { creativeGet, creativeTemplateGet } from "public/Apollo/Queries";

import {
  Content,
  Card,
  Button,
  SuccessBox,
  ErrorBox,
  GhostLoader,
} from "Components/elements";

import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

import { sectionName } from "./PublicCreative.module.css";

function Question({ question, section, creative, setAnswers, answers }) {
  const { name, description } = question;
  return (
    <Card
      style={{ marginBottom: "10px", paddingBottom: "15px", marginTop: "0px" }}
    >
      <div className="form_h2">{name}</div>
      <div className="form_p2">{description}</div>
      <hr />
      <div className="p1">
        <GeneralInput
          question={question}
          section={section}
          creative={creative}
          setAnswers={setAnswers}
          answers={answers}
        />
      </div>
      <CommentSection
        question={question}
        section={section}
        creative={creative}
        answers={answers}
        setAnswers={setAnswers}
      />
    </Card>
  );
}

function findErrors(variables) {
  let errs = [];

  console.log(variables);

  if (!variables.input.name) {
    errs.push("Company name must be provided.");
  }

  if (
    !variables.input.answers.find(
      ({ questionId }) => questionId === "q01_section_terms"
    )
  ) {
    errs.push("Terms and conditions are not accepted.");
  }

  if (
    !variables.input.answers.find(
      ({ questionId }) => questionId === "q05_section_info"
    )
  ) {
    errs.push("Contact person is not provided.");
  }

  return errs;
}

function Submit({
  creative,
  template,
  accountId,
  answers,
  name,
  success,
  setSuccess,
}) {
  console.log("accountId", accountId);

  const [mutate, mres] = useMutation(creativePut, {
    context: { clientName: "public" },
  });

  const [errors, setErrors] = useState([]);

  return (
    <div>
      {!success && (
        <div className="text-right">
          <Button
            type="right_arrow"
            loading={mres.loading}
            onClick={async () => {
              if (mres.loading) return;

              const variables = {
                id: creative.id || "",
                accountId: accountId,
                input: {
                  name: name,
                  submit: true,
                  answers: answers.map(ans => omit(ans, ["__typename", "id"])),
                },
              };

              let errs = findErrors(variables);
              setErrors(errs);

              if (errs.length) return;

              try {
                await mutate({ variables });
                setSuccess(true);
              } catch (error) {
                console.log("error", error);
              }
            }}
          >
            Submit
          </Button>
        </div>
      )}

      {!!errors.length && (
        <div style={{ marginTop: "10px" }}>
          <ErrorBox>
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </ErrorBox>
        </div>
      )}

      {success && (
        <div className="mt2">
          <SuccessBox>
            {creative.id && <div>{template.successMessageInvited || ""}</div>}

            {!creative.id && <div>{template.successMessageWebForm || ""}</div>}
          </SuccessBox>
        </div>
      )}
    </div>
  );
}

const CompanyName = ({ setName, creative }) => (
  <div className="focus_form mb3">
    <textarea
      className="form_h1"
      rows={1}
      placeholder="Your company name"
      name="input.name"
      defaultValue={creative.name}
      onBlur={e => {
        setName(e.target.value);
      }}
    />
  </div>
);

export function PublicCreative({ match }) {
  const [success, setSuccess] = useState(false);

  let { id, accountId } = match.params;

  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [getCreative, creativeQuery] = useLazyQuery(creativeGet, {
    context: { clientName: "public" },
  });
  let creative = creativeQuery.data?.creativeGet;

  const [
    getCreativeTemplate,
    creativeTemplateQuery,
  ] = useLazyQuery(creativeTemplateGet, { context: { clientName: "public" } });
  const template = creativeTemplateQuery?.data?.creativeTemplateGet;

  useEffect(() => {
    if (accountId) {
      getCreativeTemplate({ variables: { id: accountId } });
    }
  }, [accountId && getCreativeTemplate]);

  useEffect(() => {
    if (id) {
      let [creativeId] = id.split("&");

      getCreative({ variables: { id: creativeId } });
    }
  }, [id && getCreative, getCreativeTemplate, id]);

  useEffect(() => {
    if (creative) {
      setAnswers(creative.answers);
    }
  }, [creative]);

  const error = creativeQuery.error || creativeTemplateQuery.error;
  const loading = creativeQuery.loading || creativeTemplateQuery.loading;

  if (error) {
    return (
      <Content maxWidth={780} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }

  if (!creative) {
    creative = {
      id: null,
      name: "",
      description: "External Form",
      templateId: "",
      sharedWithEmail: null,
      sharedByEmail: null,
      submit: false,
      answers: [],
    };
  }

  if (!loading && creative && template)
    return (
      <Content maxWidth={780}>
        {!success && (
          <div>
            <div
              style={{
                marginBottom: "30px",
                marginTop: "20px",
                whiteSpace: "pre-wrap",
              }}
            >
              {creative.id
                ? template.headerMessageInvited || ""
                : template.headerMessageWebForm || ""}
            </div>

            <CompanyName setName={setName} creative={creative} />

            {(template.sections || []).map((section, i) => (
              <div key={`section-${i}`}>
                <div className={sectionName}>{section.name}</div>
                <div>{section.description}</div>
                {(section.questions || []).map((question, ii) => (
                  <Question
                    key={`q-${i}-${ii}`}
                    question={question}
                    section={section}
                    creative={creative}
                    setAnswers={setAnswers}
                    answers={answers}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        <Submit
          creative={creative}
          accountId={accountId}
          answers={answers}
          name={name || creative.name}
          template={template}
          success={success}
          setSuccess={setSuccess}
        />
      </Content>
    );

  return <GhostLoader />;
}
