import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { presentationGet } from "public/Apollo/Queries";
import moment from "moment";

import styles from "./PublicPresentationPage.module.css";
import {
  Content,
  ErrorBox,
  GhostLoader,
  Card,
  Tag,
  Button,
} from "Components/elements";
import AnswerSection from "./AnswerSection";

export function PublicPresentationPage({ match }) {
  let { id, email } = match.params;
  const [
    getPublicPresentation,
    { loading, called, error, data },
  ] = useLazyQuery(presentationGet, { context: { clientName: "public" } });
  let presentation = data?.presentationGet;

  useEffect(() => {
    if (id && email) {
      getPublicPresentation({ variables: { id, email } });
    }
  }, [id && email && getPublicPresentation]);

  if (loading || !called) {
    return <GhostLoader />;
  }

  if (error || (!loading && !presentation)) {
    return (
      <Content maxWidth={600} center>
        <ErrorBox>
          This page cannot be found. This might happen if the person that shared
          it with you have revoked the sharing.
        </ErrorBox>
      </Content>
    );
  }

  return (
    <Content maxWidth={780} style={{ position: "relative", top: "-20px" }}>
      <h1 className={styles.header}>{presentation?.creativeDetails?.name}</h1>

      <div className={styles.info_line}>
        <a href={`mailto:${presentation.sharedBy}`}>{presentation.sharedBy}</a>{" "}
        shared this case with you on{" "}
        {moment(presentation.createdAt).format("lll")}.
      </div>

      {presentation?.message && (
        <Card
          label={"Introduction"}
          style={{
            paddingBottom: "20px",
            paddingLeft: "30px",
            paddingRight: "30px",
            whiteSpace: "pre-wrap",
            lineHeight: "2",
          }}
        >
          {presentation?.message}
        </Card>
      )}

      {!!presentation?.tags?.length && (
        <Card label={"Tags"} style={{ paddingBottom: "20px" }}>
          {presentation.tags.map(tag => (
            <Tag>{tag}</Tag>
          ))}
        </Card>
      )}

      <hr />

      <div className={styles.facts_section}>
        <div className={styles.facts_byline}>
          <div className={styles.facts_byline_label}>Company name:</div>
          <div>{presentation?.creativeDetails?.name}</div>
        </div>

        {presentation?.creativeDetails?.location && (
          <div className={styles.facts_byline}>
            <div className={styles.facts_byline_label}>Location:</div>
            <div>{presentation?.creativeDetails?.location}</div>
          </div>
        )}

        {presentation?.creativeDetails?.contactPerson && (
          <div className={styles.facts_byline}>
            <div className={styles.facts_byline_label}>Contact person:</div>
            <div>{presentation?.creativeDetails?.contactPerson}</div>
          </div>
        )}
      </div>

      <div className={styles.info_boxes}>
        {presentation?.creativeDetails?.externalLinks && (
          <div className={styles.infoBox}>
            <Card
              label={"Links"}
              style={{
                paddingBottom: "20px",
                height: "110px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={styles.infoBoxInner}>
                <div>
                  {presentation?.creativeDetails?.externalLinks.map(
                    ({ key, val }) => (
                      <div key={key}>
                        <a href={key} target="_blank" rel="noopener noreferrer">
                          <Button
                            style={{ width: "100%" }}
                            iconClass={"fal fa-external-link"}
                            size={"small"}
                          >
                            {val}
                          </Button>
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {presentation?.creativeDetails?.seeking && (
          <div className={styles.infoBox}>
            <Card
              label={"Seeking"}
              style={{
                paddingBottom: "20px",
                height: "110px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={styles.infoBoxInner}>
                <div>
                  <div className={styles.infoBox_big_number}>
                    {presentation?.creativeDetails?.seeking?.key}
                  </div>

                  <div className={styles.infoBox_byline}>
                    {presentation?.creativeDetails?.seeking?.val}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {presentation?.creativeDetails?.valuation && (
          <div className={styles.infoBox}>
            <Card
              label={"Valuation"}
              style={{
                paddingBottom: "20px",
                height: "110px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={styles.infoBoxInner}>
                <div>
                  <div className={styles.infoBox_big_number}>
                    {presentation?.creativeDetails?.valuation?.key}
                  </div>

                  <div className={styles.infoBox_byline}>
                    {presentation?.creativeDetails?.valuation?.val}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {(presentation?.creativeDetails?.sections || [])
        .filter(section => section?.answers?.length)
        .sort((a, b) => a.index - b.index)
        .map(section => (
          <Card label={section.name} key={section.name}>
            <AnswerSection answers={section.answers || []} />
          </Card>
        ))}

      <hr />

      <div className={styles.info_line}>
        Like what you see? You can create an account at{" "}
        <a href="https://notata.io/signup">notata.io</a> to manage your deal
        flow, evaluate startups and share investment cases with your network.
      </div>
    </Content>
  );

  // return <GhostLoader />;
}
