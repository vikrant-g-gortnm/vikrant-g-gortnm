import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import InfoModal from "Components/InfoModal/InfoModal";

import { Button, Content, BreadCrumbs, GhostLoader } from "Components/elements";
import styles from "./FactsTemplates.module.css";
import { creativeTemplateGet } from "private/Apollo/Queries";
import TemplatePreview from "./TemplatePreview/TemplatePreview";
import { settings, facts_templates } from "definitions.js";

export default function FactsTemplates({ history, match }) {
  const creativeTemplateQuery = useQuery(creativeTemplateGet);
  const creativeTemplate = creativeTemplateQuery.data?.creativeTemplateGet;
  const [template, setTemplate] = useState(undefined);

  useEffect(() => {
    if (creativeTemplate) {
      setTemplate(creativeTemplate);
    }
  }, [creativeTemplate]);

  if (creativeTemplateQuery.loading || !template) return <GhostLoader />;

  if (creativeTemplateQuery.error) throw creativeTemplateQuery.error;

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Startup template",
            link: `${facts_templates}`,
          },
        ]}
      />
      <Content maxWidth={780}>
        <div style={{ position: "relative", paddingRight: "15px" }}>
          <h1 style={{ marginBottom: "10px" }}>Startup Template</h1>
          <InfoModal
            title="Info"
            content={`The startup template lets you collect information about the startups you look at. It has two views: 'invited startups' and 'public web form'.\n\n'Invited startups' means that you add a startup to your deal flow on the dashboard, and invite the startup to fill out the form through the 'facts' page.\n\n'Public web form' is a form that you can embed on your website so that startups can fill out this form when contacting you.\n\nSome parts of this form is not customizable, as they represent the minimum amount of information required.`}
          />
        </div>

        <div className={styles.divider} />

        <TemplatePreview template={template} setTemplate={setTemplate} />

        <Button
          type="just_text"
          onClick={() => {
            let variables = {
              id: "default",
            };
            creativeTemplateQuery.refetch(variables);
          }}
        >
          Revert to default template
        </Button>
      </Content>
    </>
  );
}
