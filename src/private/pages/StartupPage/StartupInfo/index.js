import React, { useEffect } from "react";

// API: apollo
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

// API: queries
import { creativeGet, creativeTemplateGet } from "private/Apollo/Queries";

// API: mutations
import { creativeUpdate } from "private/Apollo/Mutations";

// Router: definitions
import { dashboard, startup_page } from "definitions.js";

// Components: general
import { Content, BreadCrumbs, GhostLoader } from "Components/elements";

// Components: unique
import NameInput from "./NameInput";
import InviteStartup from "./InviteStartup";

// Components: general
import TemplatedForm from "Components/Forms/TemplatedForm";

// Utils
import { omit } from "lodash";

function getCleanContentData({ creative }) {
  if (!creative) {
    return;
  }

  let answers = creative.answers || [];

  answers = answers.map(a => ({
    ...omit(a, ["__typename"]),
    pageMeta: a.pageMeta ? omit(a.pageMeta, ["__typename"]) : {},
  }));

  return answers;
}

// *****************
// * Main function *
// *****************
export default function StartupInfo({ history, match }) {
  // Get url params
  const { id: connectionId, creativeId } = match.params;

  // Queries
  const [
    getData,
    { data: creativeData, loading: creativeLoading },
  ] = useLazyQuery(creativeGet);

  const { data: templateData, loading: templateLoading } = useQuery(
    creativeTemplateGet
  );

  // Mutations
  const [mutate, { loading: mutationLoading }] = useMutation(creativeUpdate);

  // Definitions
  const creative = creativeData?.creativeGet || {};
  const creativeTemplate = templateData?.creativeTemplateGet || {};

  // Execute query
  useEffect(() => {
    if (creativeId) {
      getData({
        variables: {
          id: creativeId,
        },
      });
    }
  }, [creativeId]);

  // Return loader if queries are loading
  if (creativeLoading || templateLoading) {
    return <GhostLoader />;
  }

  // Define template data to include in form
  const formSections = creativeTemplate.sections.filter(
    ({ id }) => id !== "section_terms"
  );

  // ===========
  // Return page
  // ===========
  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Dashboard",
            link: `${dashboard}`,
          },
          {
            val: `Startup: ${creative.name}`,
            link: `${startup_page}/${connectionId}`,
          },
          {
            val: `Startup Info`,
            link: `${startup_page}/${connectionId}/creative/${creative.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        {/* Edit startup name */}
        <NameInput creativeId={creative.id} name={creative.name} />

        {/* Invite startup */}
        <InviteStartup connectionId={connectionId} creative={creative} />

        {/* Roll out templated form */}
        <TemplatedForm
          template={{ sections: formSections }}
          content={getCleanContentData({ creative })}
          submit={answers => {
            let variables = {
              id: creative.id,
              input: { answers },
            };
            mutate({ variables });
          }}
        />

        {/*/!* Link to edit template *!/*/}
        {/*<div style={{ textAlign: "right", marginTop: "35px" }}>*/}
        {/*  <Button*/}
        {/*    type={"just_text"}*/}
        {/*    onClick={() => {*/}
        {/*      history.push(facts_templates);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    edit form template*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </Content>
    </>
  );
}
