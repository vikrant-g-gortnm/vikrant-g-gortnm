import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { connectionsGet, groupGet } from "private/Apollo/Queries";
import {
  groupPut,
  connectionCreate,
  evaluationPut,
} from "private/Apollo/Mutations";
import { Button, Card, Modal, Tag } from "Components/elements";
import styles from "./StartupList2.module.css";
import ShareSetting from "./ShareSetting";
import { startup_page } from "definitions.js";

import StartupInfoSection from "../../StartupPage/StartupPageComponents/StartupInfoSection";

import classnames from "classnames";
import { getDataForEvaluationsSharedInGroup } from "../../StartupPage/StartupPageComponents/EvaluationBox/getEvaluationSummaries";
import EvaluationsByTemplate from "../../StartupPage/StartupPageComponents/EvaluationBox/EvaluationsByTemplate";

const getSummaries = (startups, hide, group) => {
  // console.log('getSummaries')

  let summaries = {
    subjectiveScores: 0,
    subjectiveScoresCount: 0,
    averageSubjectiveScore: 0,
    evaluations: {},
    // data
  };

  for (let startup of startups) {
    // console.log('startup', startup)

    // Get subjective score summaries
    if (startup.subjective_score) {
      let subjectiveScores = startup.connection?.subjectiveScores || [];
      let { score } =
        subjectiveScores.find(
          ({ createdByUser }) => createdByUser.email === startup.sharedBy
        ) || {};

      if (score) {
        summaries.subjectiveScores += score;
        summaries.subjectiveScoresCount += 1;
      }
    }

    summaries.averageSubjectiveScore = parseFloat(
      (summaries.subjectiveScores / summaries.subjectiveScoresCount).toFixed(1)
    );

    // Get evaluation summaries
    if (startup.evaluations) {
      let evaluations =
        (startup.connection?.evaluations || []).filter(
          ({ createdByUser }) => createdByUser.email === startup.sharedBy
        ) || [];

      for (let evaluation of evaluations) {
        let { templateId } = evaluation;

        summaries.evaluations[templateId] = summaries.evaluations[
          templateId
        ] || {
          totalScore: 0,
          averageScore: 0,
          percentageScore: 0,
          count: 0,
          sections: {},
        };
        summaries.evaluations[templateId].templateName =
          evaluation.summary.templateName;
        summaries.evaluations[templateId].totalScore +=
          evaluation.summary.totalScore;
        summaries.evaluations[templateId].count += 1;
        summaries.evaluations[templateId].possibleScore =
          evaluation.summary.possibleScore;

        summaries.evaluations[templateId].averageScore =
          summaries.evaluations[templateId].totalScore /
          summaries.evaluations[templateId].count;

        summaries.evaluations[templateId].percentageScore = Math.round(
          (summaries.evaluations[templateId].averageScore /
            summaries.evaluations[templateId].possibleScore) *
            100
        );

        for (let section of evaluation.summary.sections) {
          summaries.evaluations[templateId].sections[section.id] = summaries
            .evaluations[templateId].sections[section.id] || {
            totalScore: 0,
            count: 0,
          };
          summaries.evaluations[templateId].sections[section.id].sectionName =
            section.name;
          summaries.evaluations[templateId].sections[section.id].totalScore +=
            section.score || 0;
          summaries.evaluations[templateId].sections[section.id].possibleScore =
            section.possibleScore;
          summaries.evaluations[templateId].sections[section.id].count += 1;
        }
      }
    }
  }

  return summaries;
};

const getListOfStartups = ({ group, sortBy, hide, hideUser }) => {
  // console.log('getListOfStartups', group)

  let ss = {};

  for (let startup of group.startups) {
    ss[startup.creativeId] = ss[startup.creativeId] || [];
    ss[startup.creativeId].push(startup);
  }

  let list = [];

  for (let creativeId in ss) {
    if (ss[creativeId]?.[0]?.connection) {
      let evaluations = ss[creativeId]
        .filter(it => it.evaluations)
        .map(({ connection }) => connection?.evaluations || [])
        .flat()
        .filter(x => x);

      const data = getDataForEvaluationsSharedInGroup({
        group,
        evaluations,
        hide: hideUser,
      });

      // console.log('data', data)

      let item = {
        creative: ss[creativeId][0].connection.creative,
        startups: ss[creativeId],
        summaries: getSummaries(ss[creativeId], hide, group),
        data,
      };
      list.push(item);
    }
  }

  if (sortBy === "name") {
    list = list.sort((a, b) => {
      if (a.creative.name < b.creative.name) {
        return -1;
      }
      if (a.creative.name > b.creative.name) {
        return 1;
      }
      return 0;
    });
  }

  if (sortBy === "subjectiveScores") {
    list = list.sort((a, b) => {
      return (
        b.summaries.averageSubjectiveScore - a.summaries.averageSubjectiveScore
      );
    });
  }

  let [label, templateId] = sortBy.split("::");
  if (label === "template") {
    list = list.sort((a, b) => {
      let aVal = a.summaries?.evaluations?.[templateId]?.percentageScore || 0;
      let bVal = b.summaries?.evaluations?.[templateId]?.percentageScore || 0;
      return bVal - aVal;
    });
  }

  list = list.filter(({ creative }) => creative);

  return list;
};

const getAllUsedTemplates = list => {
  let templates = {};
  for (let item of list) {
    let { evaluations } = item.summaries;
    for (let key of Object.keys(evaluations)) {
      templates[key] = evaluations[key].templateName;
    }
  }

  let res = [];
  for (let templateId in templates) {
    res.push({
      templateId: templateId,
      templateName: templates[templateId],
    });
  }

  res = res.sort((a, b) => {
    if (a.templateName < b.templateName) {
      return -1;
    }
    if (a.templateName > b.templateName) {
      return 1;
    }
    return 0;
  });

  return res;
};

function AddStartup({ creative, connections, isLoading }) {
  const [mutate, { loading }] = useMutation(connectionCreate);

  return (
    <div
      className={styles.action_link}
      onClick={async () => {
        if (loading) return;

        try {
          await mutate({
            variables: {
              creativeId: creative.id,
            },
            update: (proxy, { data: { connectionCreate } }) => {
              proxy.readQuery({
                query: connectionsGet,
              });
              proxy.writeQuery({
                query: connectionsGet,
                data: {
                  connectionsGet: [...connections, connectionCreate],
                },
              });
            },
          });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {loading || (isLoading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-cloud-download" />
      )}

      <span>save startup</span>
    </div>
  );
}

export function ShareBack({ connection, group, isLoading }) {
  const [showShareSettings, setShowShareSettings] = useState(null);
  const [mutate, { loading }] = useMutation(groupPut, {
    refetchQueries: [
      {
        query: groupGet,
        variables: { id: group.id },
      },
    ],
  });

  return (
    <>
      <div
        className={styles.action_link}
        onClick={() => {
          setShowShareSettings(connection);
        }}
      >
        {loading || (isLoading && <i className="fa fa-spinner fa-spin" />) || (
          <i className="fal fa-share-alt" />
        )}

        <span>share back</span>
      </div>

      {showShareSettings && (
        <Modal
          title="Share startup"
          close={() => {
            setShowShareSettings(null);
          }}
          disableFoot={true}
        >
          <ShareSetting
            group={group}
            connection={showShareSettings}
            mutate={mutate}
            done={() => {
              setShowShareSettings(null);
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "26px",
              bottom: "33px",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => setShowShareSettings(null)}
            >
              cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function TemplateLogic({
  group,
  connections,
  connection,
  creative,
  user,
  history,
}) {
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate] = useMutation(evaluationPut);

  let { evaluationTemplates } = group;

  let mySharedStartup = group.startups.find(
    ({ connectionId, sharedBy }) =>
      connection.id.split("?")[0] === connectionId && sharedBy === user.email
  );

  let unusedEvaluationTemplates = evaluationTemplates.filter(
    ({ id }) =>
      !mySharedStartup?.connection?.evaluations?.some(
        ({ templateId }) => templateId === id
      )
  );

  if (!unusedEvaluationTemplates.length) {
    return <span />;
  }

  return (
    <div className={styles.evaluation_templates_container}>
      <div className={styles.evaluation_templates_label}>
        You are kindly requested to complete the following evaluations:
      </div>

      {unusedEvaluationTemplates.map(template => {
        return (
          <div key={template.id}>
            <Button
              type="right_arrow"
              size="medium"
              loading={currentLoading === template.id}
              onClick={async () => {
                if (currentLoading === template.id) return;

                setCurrentLoading(template.id);

                // let sectionId = template.sections[0]?.sectionId;

                try {
                  let variables = {
                    connectionId: connection.id.split("?")[0],
                    groupId: group.id,
                    input: {
                      templateId: template.id,
                      name: template.name,
                      description: template.description,
                    },
                  };

                  let res = await mutate({ variables });
                  let evaluation = res.data.evaluationPut;
                  // let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${sectionId}`;
                  let path = `${startup_page}/${
                    connection.id.split("?")[0]
                  }/evaluation/${evaluation.id}`;
                  history.push(path);
                } catch (error) {
                  console.log("error", error);
                }
                setCurrentLoading("");
              }}
            >
              {template.name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function SortBy({ sortBy, setSortBy, allUsedTemplates }) {
  const [showModal, setShowModal] = useState(false);
  let templateId = sortBy.split("::")[1];

  let sortByName = sortBy ? sortBy : "choose";

  if (sortBy === "name") {
    sortByName = "Name";
  }

  if (sortBy === "subjectiveScores") {
    sortByName = "Subjective scores";
  }

  if (templateId) {
    let template = allUsedTemplates.find(
      template => template.templateId === templateId
    );
    sortByName = template?.templateName;
  }

  return (
    <>
      <Card
        style={{
          paddingBottom: "18px",
          marginBottom: 0,
          marginTop: "8px",
        }}
      >
        <span>Sort by: </span>
        <Tag
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
          // active
        >
          {sortByName}
        </Tag>
      </Card>

      {showModal && (
        <Modal
          title="Sort"
          close={() => {
            setShowModal(false);
          }}
          disableFoot={true}
        >
          <div className={styles.sort_list}>
            <div
              className={classnames(
                styles.sort_list_item,
                sortBy === "name" && styles.selected_sort_list_item
              )}
              onClick={() => setSortBy("name")}
            >
              Name
            </div>

            <div
              className={classnames(
                styles.sort_list_item,
                sortBy === "subjectiveScores" && styles.selected_sort_list_item
              )}
              onClick={() => setSortBy("subjectiveScores")}
            >
              Subjective score
            </div>

            {allUsedTemplates.map(({ templateId, templateName }) => (
              <div
                key={templateId}
                className={classnames(
                  styles.sort_list_item,
                  sortBy === `template::${templateId}` &&
                    styles.selected_sort_list_item
                )}
                onClick={() => {
                  setSortBy(`template::${templateId}`);
                }}
              >
                {templateName}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Button
              size="medium"
              buttonStyle="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function HideLogic({ hide, setHide, allUsedTemplates }) {
  const [showModal, setShowModal] = useState(false);

  let hideItems = [];
  for (let key in hide) {
    if (hide[key]) {
      if (key === "subjectiveScores") {
        hideItems.push({
          key,
          name: "Subjective scores",
        });
      }

      let template = allUsedTemplates.find(
        ({ templateId }) => templateId === key
      );

      if (template) {
        hideItems.push({
          key,
          name: template.templateName,
        });
      }
    }
  }

  return (
    <>
      <Card
        style={{
          paddingBottom: "18px",
          marginBottom: 0,
          marginTop: "8px",
        }}
      >
        <div>
          Hide:
          {hideItems.map(item => (
            <Tag
              style={{ cursor: "pointer" }}
              className={styles.hide_item}
              key={item.key}
              onClick={() => {
                setHide({
                  ...hide,
                  [item.key]: !hide[item.key],
                });
              }}
            >
              <span>{item.name}</span>
              <span className={styles.tag_kill}>
                <i className="fal fa-times" />
              </span>
            </Tag>
          ))}
          <Tag
            // active
            style={{ cursor: "pointer" }}
            className={styles.hide_item}
            onClick={() => {
              setShowModal(true);
            }}
          >
            <span>choose</span>
          </Tag>
        </div>
      </Card>

      {showModal && (
        <Modal
          title="Hide"
          close={() => {
            setShowModal(false);
          }}
          disableFoot={true}
        >
          <div className={styles.hide_list}>
            <div
              className={classnames(
                styles.hide_list_item,
                hide["subjectiveScores"] && styles.selected_hide_list_item
              )}
              onClick={() => {
                setHide({
                  ...hide,
                  subjectiveScores: !hide["subjectiveScores"],
                });
              }}
            >
              {(!hide["subjectiveScores"] && (
                <span>
                  <i className="fal fa-eye" />
                  <span> Subjective score</span>
                </span>
              )) || (
                <span>
                  <i className="fal fa-eye-slash" />
                  <span> Subjective score</span>
                </span>
              )}
            </div>

            {allUsedTemplates.map(({ templateId, templateName }) => (
              <div
                key={templateId}
                className={classnames(
                  styles.hide_list_item,
                  hide[templateId] && styles.selected_hide_list_item
                )}
                onClick={() => {
                  setHide({
                    ...hide,
                    [templateId]: !hide[templateId],
                  });
                }}
              >
                {(!hide[templateId] && (
                  <span>
                    <i className="fal fa-eye" />
                    <span> {templateName}</span>
                  </span>
                )) || (
                  <span>
                    <i className="fal fa-eye-slash" />
                    <span> {templateName}</span>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Button
              size="medium"
              buttonStyle="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AddAll({
  group,
  list,
  user,
  connections,
  settings,
  setIsLoadingDownload,
}) {
  const [isLoadingAddAll, setIsLoadingAddAll] = useState(false);

  const [mutate] = useMutation(groupPut, {
    refetchQueries: [
      {
        query: groupGet,
        variables: { id: group.id },
      },
    ],
  });

  const [connectionCreateMutate] = useMutation(connectionCreate);

  function getAddAllStatus() {
    let saveAndShare = 0;
    let share = 0;

    for (let g of list) {
      let { creative, startups } = g;

      // let my_startups = haveShared({ startups });
      let match = startups.find(({ sharedBy }) => sharedBy === user.email);

      if (!match) share += 1;

      let match2 = connections.find(
        ({ creativeId }) => creativeId === creative.id
      );
      if (!match2) saveAndShare += 1;
    }
    return { share, saveAndShare };
  }

  const { saveAndShare, share } = getAddAllStatus();

  async function addAllAndShareBack() {
    if (isLoadingAddAll) return;

    setIsLoadingAddAll(true);

    for (let g of list) {
      let { creative } = g;

      let match = connections.find(
        ({ creativeId }) => creativeId === creative.id
      );

      setIsLoadingDownload({ [creative.id]: true });

      // SAVE STARTUP
      if (!match) {
        try {
          await connectionCreateMutate({
            variables: {
              creativeId: creative.id,
            },
            update: (proxy, { data: { connectionCreate } }) => {
              proxy.readQuery({
                query: connectionsGet,
              });
              proxy.writeQuery({
                query: connectionsGet,
                data: {
                  connectionsGet: [...connections, connectionCreate],
                },
              });
              match = connectionCreate;
            },
          });
        } catch (error) {
          console.log("error", error);
        }
      }

      try {
        let variables = {
          id: group.id,
          input: {
            addStartup: {
              connectionId: match.id.split("?")[0],
              creativeId: match.creativeId,
              comments: true,
              evaluations: true,
              subjective_score: true,
              tags: true,
            },
          },
        };

        await mutate({ variables });
      } catch (error) {
        console.log("error", error);
      }
      setIsLoadingDownload({ [creative.id]: false });
    }

    setIsLoadingAddAll(false);
  }

  let showButton = settings.addStartup && (saveAndShare !== 0 || share !== 0);

  if (!showButton) {
    return <span />;
  }

  return (
    <div>
      <Button
        size="large"
        style={{ width: "100%" }}
        buttonStyle={"danger"}
        loading={isLoadingAddAll}
        iconClass="fas fa-cloud-download"
        onClick={async () => {
          await addAllAndShareBack();
        }}
      >
        sync with group
      </Button>
    </div>
  );
}

function StartupList2({
  group,
  connections,
  settings,
  user,
  isAdmin,
  history,
}) {
  const [sortBy, _setSortBy] = useState("");
  const [hide, _setHide] = useState({});
  const [hideUser, setHideUser] = useState({});
  const [isLoadingDownload, setIsLoadingDownload] = useState({});

  let list = getListOfStartups({ group, sortBy, hide, hideUser });

  let allUsedTemplates = getAllUsedTemplates(list);

  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem(`group::${group.id}`));
      let { sortBy, hide } = f;
      _setSortBy(sortBy);
      _setHide(hide);
    } catch (error) {}
  }, []);

  function setSortBy(d) {
    _setSortBy(d);
    localStorage.setItem(
      `group::${group.id}`,
      JSON.stringify({ hide, sortBy: d })
    );
  }

  function setHide(d) {
    _setHide(d);
    localStorage.setItem(
      `group::${group.id}`,
      JSON.stringify({ hide: d, sortBy })
    );
  }

  return (
    <div className={styles.container}>
      <AddAll
        group={group}
        list={list}
        user={user}
        connections={connections}
        settings={settings}
        isLoadingDownload={isLoadingDownload}
        setIsLoadingDownload={setIsLoadingDownload}
      />

      {(settings.showScores || isAdmin) && (
        <>
          <SortBy
            sortBy={sortBy}
            setSortBy={setSortBy}
            allUsedTemplates={allUsedTemplates}
          />

          <HideLogic
            hide={hide}
            setHide={setHide}
            allUsedTemplates={allUsedTemplates}
          />
        </>
      )}

      {list.map(({ creative, startups, summaries, data }) => {
        let haveAddedStartup = connections.find(
          ({ creativeId }) => creativeId === creative.id
        );

        let haveSharedStartup = startups.find(
          ({ sharedBy }) => sharedBy === user.email
        );

        let isLoading = isLoadingDownload[creative.id];

        let visibleEvaluations = data.filter(
          ({ templateId }) => !hide[templateId]
        );

        return (
          <div className={styles.startup} key={creative.id}>
            <div>
              <div
                className={styles.name}
                style={{
                  textDecoration: haveAddedStartup ? "underline" : "none",
                  cursor: haveAddedStartup ? "pointer" : "default",
                }}
                onClick={() => {
                  if (!haveAddedStartup) return;
                  let path = `${startup_page}/${haveAddedStartup.id}?group=${group.id}`;
                  history.push(path, { rightMenu: true });
                }}
              >
                {creative.name}
              </div>
            </div>

            {!!creative.answers.length && (
              <StartupInfoSection
                creative={creative}
                answers={creative.answers}
              />
            )}

            {!haveAddedStartup && (
              <AddStartup
                creative={creative}
                connections={connections}
                isLoading={isLoading}
              />
            )}

            {haveAddedStartup && !haveSharedStartup && (
              <ShareBack
                connection={haveAddedStartup}
                group={group}
                isLoading={isLoading}
              />
            )}

            {/* SUBJECTIVE SCORE */}

            {!hide["subjectiveScores"] &&
              (settings.showScores || isAdmin) &&
              summaries.subjectiveScoresCount !== 0 && (
                <div className={styles.list_outer_container}>
                  <div className={styles.list_label}>Subjective score:</div>

                  <div className={styles.list_container}>
                    <div className={styles.list_item}>
                      <div className={styles.list_item_label}>
                        Average subjective score
                      </div>

                      <div className={styles.list_item_right}>
                        <div className={styles.list_item_sub_line}>
                          {summaries.subjectiveScoresCount} submissions
                        </div>

                        <div className={styles.list_item_score}>
                          {summaries.averageSubjectiveScore || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {(isAdmin || settings.showScores) && !!visibleEvaluations.length && (
              <div className={styles.list_outer_container}>
                <div className={styles.list_label}>Evaluations:</div>
                {visibleEvaluations.map(d => {
                  return (
                    <div style={{ marginBottom: "5px" }}>
                      <EvaluationsByTemplate
                        templateId={d.templateId}
                        user={user}
                        data={d}
                        isAdmin={isAdmin}
                        hide={hideUser}
                        showUsers={settings.showUsers}
                        showScores={settings.showScores}
                        toggleHide={eId => {
                          setHideUser({
                            ...hideUser,
                            [eId]: !hideUser[eId],
                          });
                        }}
                        history={history}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* TEMPLATE LOGIC */}
            {haveAddedStartup && haveSharedStartup && (
              <TemplateLogic
                group={group}
                connections={connections}
                creative={creative}
                connection={haveAddedStartup}
                user={user}
                history={history}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StartupList2;
