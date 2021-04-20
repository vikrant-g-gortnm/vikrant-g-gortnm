import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { publicCreativePut } from "public/Apollo/Mutations";

import {
  publicCreativeGet,
  publicCreativeTemplateGet,
} from "public/Apollo/Queries";

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

function Question({ question, section, creative }) {
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
        />
      </div>
      <CommentSection
        question={question}
        section={section}
        creative={creative}
      />
    </Card>
  );
}

function Submit({ creative, accountId }) {
  // const [success, setSuccess] = useState(false);
  const [mutate, { loading }] = useMutation(publicCreativePut);

  return (
    <div>
      <div className="text-right">
        <Button
          type="right_arrow"
          loading={loading}
          onClick={async () => {
            // setSuccess(false);
            const variables = {
              id: creative.id || "",
              accountId: accountId,
              input: { submit: true, name: creative.name },
            };
            try {
              await mutate({ variables });
              // setSuccess(true);
            } catch (error) {
              console.log("error", error);
            }
          }}
        >
          Submit
        </Button>
      </div>

      {creative.submit && !loading && (
        <SuccessBox>
          Your information has been submitted, and the investor that requested
          this information have been notified on {creative.sharedByEmail}. You
          may still change the information in this form. By clicking "submit"
          again, the investor will get notified again.
        </SuccessBox>
      )}
    </div>
  );
}

function CompanyName({ creative }) {
  const [mutate] = useMutation(publicCreativePut);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, event) => {
    console.log("THIS IS NEVER CALLED! WHY?");

    let variables = { id: creative.id, ...data };
    try {
      if (creative.id) {
        await mutate({ variables });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="focus_form mb3" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        className="form_h1"
        rows={1}
        placeholder="Your company name"
        name="input.name"
        defaultValue={creative.name}
        ref={register}
        onBlur={async e => {
          creative.id && handleSubmit(onSubmit);

          if (creative.id) {
            let variables = {
              id: creative.id,
              input: {
                name: e.target.value,
              },
            };

            try {
              await mutate({ variables });
            } catch (error) {
              console.log(error);
            }
          }
        }}
      />
    </form>
  );
}

export function PublicCreative({ match }) {
  const { id, accountId } = match.params;

  const [getCreative, creativeQuery] = useLazyQuery(publicCreativeGet);
  let creative = creativeQuery.data?.publicCreativeGet;

  const [getCreativeTemplate, creativeTemplateQuery] = useLazyQuery(
    publicCreativeTemplateGet
  );
  const template = creativeTemplateQuery.data?.publicCreativeTemplateGet;

  useEffect(() => {
    if (id) getCreative({ variables: { id } });
    getCreativeTemplate();
  }, [id && getCreative, getCreativeTemplate, id]);

  const error = creativeQuery.error || creativeTemplateQuery.error;
  const loading = creativeQuery.loading || creativeTemplateQuery.loading;

  if (error) {
    console.log("creativeQuery.error", creativeQuery.error);
    console.log("creativeTemplateQuery.error", creativeTemplateQuery.error);

    return (
      <Content maxWidth={1200} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }

  if (!loading && creative && template)
    return (
      <Content maxWidth={1200}>
        <CompanyName creative={creative} />

        {creative.id && (
          <div>
            <span style={{ color: "var(--color-primary)" }}>
              {creative.sharedByEmail}
            </span>
            have invited you to share some information about your company with
            them. Fill out the relevant parts of this form, and hit "submit"
            when you are ready.
          </div>
        )}

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
              />
            ))}
          </div>
        ))}

        <Submit creative={creative} accountId={accountId} />
      </Content>
    );

  return <GhostLoader />;
}
