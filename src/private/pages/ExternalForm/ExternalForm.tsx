import React, { useState } from "react";

import {
  GhostLoader,
  Content,
  Card,
  SuccessBox,
  Button,
} from "Components/elements/";

import { facts_templates } from "definitions.js";

import { useQuery } from "@apollo/client";
import accountGet from "private/Apollo/Queries/accountGet";
import styles from "private/pages/StartupPage/StartupInfo/StartupInfo.module.css";
import { History } from "history";

export default function ExternalForm({ history }: { history: History }) {
  const [copySuccess, setCopySuccess] = useState(false);

  const accountQuery = useQuery(accountGet);

  let account = accountQuery.data?.accountGet || {};

  const loading: boolean = accountQuery.loading;

  if (loading && !accountQuery.data) return <GhostLoader />;

  const iFrameUrl: string = `${window.location.protocol}//${window.location.host}/public/${account.id}/form.html`;
  const iFrameContent = `<iframe src="${iFrameUrl}" 
    style="position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;"></iframe>`;

  function copyToClipboard() {
    navigator.clipboard.writeText(iFrameContent);
    setCopySuccess(true);
  }

  return (
    <Content maxWidth={780}>
      <h1 className="mb1">External Web Form</h1>

      <Card style={{ paddingBottom: "20px" }}>
        <div className={styles.share_text}>
          This form can be posted on your website. Please copy and paste the
          embeddable code below, or refer to the link.
        </div>

        <div className="mb3">
          <div>Link</div>
          <SuccessBox
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "var(--color-secondary)",
            }}
            className=""
            key=""
            title=""
          >
            <a
              href={iFrameUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12px" }}
            >
              {iFrameUrl}
            </a>
          </SuccessBox>
        </div>

        <div className="mb2">
          <div>Embed</div>

          <SuccessBox
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "var(--color-secondary)",
            }}
            className=""
            key=""
            title=""
          >
            {iFrameContent}
          </SuccessBox>

          <div
            className={`${styles.copy_link} text-right`}
            onClick={copyToClipboard}
          >
            {copySuccess ? "code copied to clipboard" : "copy code"}
          </div>
        </div>

        <Button
          size={"medium"}
          buttonStyle={"secondary"}
          onClick={() => {
            history.push(facts_templates);
          }}
        >
          Customize form
        </Button>
      </Card>
    </Content>
  );
}
