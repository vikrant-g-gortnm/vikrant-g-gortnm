import * as React from "react";
import { startup_page } from "definitions";
import { Tag } from "Components/elements";
import styles from "./Connections.module.css";

import tableStyles from "Components/elements/NotataComponents/Table.module.css";
import {
  highestFunnelTagIndex,
  subjectiveScore,
  tagCount,
} from "private/pages/Dashboard/Connections/types";

import moment from "moment";

export default ({
  history,
  setStarMutation,
  setShowTagGroupForId,
  setShowSubjectiveScoreForId,
  setShowFunnelScoreForId,
}) => {
  return [
    // Star
    {
      title: "",
      key: "starred",
      width: 50,
      className: styles.list_star,
      allowSorting: false,
      render: connection => {
        const { starred, id } = connection;

        return (
          <div
            onClick={() => {
              setStarMutation({
                variables: { id },

                optimisticResponse: {
                  __typename: "Mutation",
                  connectionSetStar: {
                    ...connection,
                    starred: !starred,
                  },
                },
              });
            }}
          >
            {(!starred && <i className="fal fa-star" />) || (
              <i
                className="fas fa-star"
                style={{ color: "var(--color-orange)" }}
              />
            )}
          </div>
        );
      },
    },

    {
      title: "Company name",
      className: styles.max_width_200,
      type: "string",
      render: connection => {
        return (
          <div className={styles.company_name}>
            <div
              onClick={() => {
                history.push(`${startup_page}/${connection.id}`, {
                  rightMenu: true,
                });
              }}
              className={styles.actual_content}
            >
              {connection.creative.name}
            </div>
          </div>
        );
      },
    },

    {
      title: "Funnels",
      // dataIndex: "funnelTags",
      key: "tags",
      responsive: "sm",
      valueExpr: connection => highestFunnelTagIndex(connection.funnelTags),
      render: connection => {
        let { funnelTags } = connection;

        let tag;
        if (funnelTags.length) {
          let highest = funnelTags.reduce(
            (max, tag) => (tag.index > max ? tag.index : max),
            funnelTags[0].index
          );
          tag = funnelTags.find(({ index }) => index === highest);
        }

        return (
          <div>
            <div
              // onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />
            <div className={styles.actual_content}>
              {(!funnelTags.length && (
                <Tag
                  className={""}
                  active={false}
                  isButton={false}
                  onClick={() => {
                    setShowFunnelScoreForId(connection.id);
                  }}
                  kill={false}
                >
                  +
                </Tag>
              )) || (
                <Tag
                  className={styles.funnel_tag}
                  active={false}
                  isButton={false}
                  kill={false}
                  onClick={() => {
                    setShowFunnelScoreForId(connection.id);
                  }}
                >
                  {tag?.name}
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },

    {
      title: "Tags",
      key: "tags",
      responsive: "md",
      valueExpr: connection => tagCount(connection.tags),
      render: connection => (
        <div>
          <div className={tableStyles.background_clicker} />

          <div className={styles.actual_content}>
            {(connection.tags || []).slice(0, 3).map(({ name, id, group }) => (
              <Tag
                key={id}
                isButton={false}
                active={false}
                className={""}
                onClick={() => {}}
                kill={false}
              >
                {group.name}: {name}
              </Tag>
            ))}

            <Tag
              isButton={true}
              active={false}
              className={""}
              kill={false}
              onClick={() => {
                setShowTagGroupForId(connection.id);
              }}
            >
              +
            </Tag>
          </div>
        </div>
      ),
    },

    {
      title: "Subjective score",
      key: "subjectiveScores",
      responsive: "sm",
      type: "number",
      valueExpr: connection => subjectiveScore(connection) || 0,
      render: connection => {
        let avg = subjectiveScore(connection);
        return (
          <div>
            <div
              // onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />

            <div className={styles.actual_content}>
              {avg && (
                <div
                  className={styles.average_score}
                  onClick={() => {
                    setShowSubjectiveScoreForId(connection.id);
                  }}
                >
                  <span>{avg}</span>
                </div>
              )}

              {!avg && (
                <Tag
                  isButton={true}
                  active={false}
                  className={""}
                  onClick={() => {
                    setShowSubjectiveScoreForId(connection.id);
                  }}
                  kill={false}
                >
                  +
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },

    {
      title: "Updated",
      key: "updatedAt",
      responsive: "lg",
      className: styles.pre_space,
      type: "date",
      render: connection => {
        return (
          <div>
            <div
              // onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />
            <div className={styles.actual_content}>
              <span className={styles.date_style}>
                {moment(connection.updatedAt).format("ll")}
              </span>
            </div>
          </div>
        );
      },
    },
  ];
};
