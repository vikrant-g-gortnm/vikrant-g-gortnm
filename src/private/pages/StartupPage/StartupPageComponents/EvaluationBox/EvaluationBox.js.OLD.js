import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { evaluationTemplatesGet } from "private/Apollo/Queries";
import { evaluationPut } from "private/Apollo/Mutations";
import { startup_page, group as group_route } from "definitions.js";
import { Button, Table, Modal } from "Components/elements";

import styles from "./EvaluationBox.module.css";
import { EvaluationRequest } from "./EvaluationRequest";

function getEvaluationSummaries({ connection, groups, hide }) {
  // Get all shared evaluations
  // ––––––––––––––––––––––––––
  let sharedEvaluations = [];
  for (let sharedItem of connection.sharedWithMe) {
    if (sharedItem.connection) {
      for (let sharedEvaluation of sharedItem.connection.evaluations) {
        if (sharedItem.evaluations) {
          sharedEvaluations.push({
            evaluation: sharedEvaluation,
            sharedItem,
          });
        }
      }
    }
  }

  // Cluster evaluations by groupId
  // ––––––––––––––––––––––––––––––
  let evaluationsByGroup = {};
  for (let { evaluation, sharedItem } of sharedEvaluations) {
    evaluationsByGroup[sharedItem.groupId] =
      evaluationsByGroup[sharedItem.groupId] || [];
    evaluationsByGroup[sharedItem.groupId].push({ evaluation, sharedItem });
  }

  let data = [];

  for (let groupId in evaluationsByGroup) {
    let thisGroup = groups.find(g => g.id === groupId) || {};
    let sharedEvaluationsInGroup = evaluationsByGroup[groupId];

    // Cluster evaluations by template ID
    // ––––––––––––––––––––––––––––––––––
    let evaluationsByTemplate = {};
    for (let { evaluation } of sharedEvaluationsInGroup) {
      evaluationsByTemplate[evaluation.templateId] =
        evaluationsByTemplate[evaluation.templateId] || [];
      evaluationsByTemplate[evaluation.templateId].push(evaluation);
    }

    let data2 = [];
    for (let templateId in evaluationsByTemplate) {
      // Get all shared evaluations
      let evaluations = evaluationsByTemplate[templateId] || [];

      // Get possible score
      let possibleScore = evaluations[0]?.summary?.possibleScore;

      // Get template name
      let templateName = evaluations[0]?.summary?.templateName;

      // Get template sections
      let templateSections = evaluations[0]?.summary?.sections;

      // Get total score
      let totalScore = 0;
      let count = 0;
      for (let evaluation of evaluations) {
        if (!hide[evaluation.id]) {
          totalScore += evaluation.summary?.totalScore || 0;
          count += 1;
        }
      }

      // Get average score
      let averageScore = parseFloat((totalScore / count).toFixed(1));

      // Get average percentage score
      let averagePercentageScore =
        Math.round((averageScore / possibleScore) * 100) || 0;

      // Put it all together
      data2.push({
        groupName: thisGroup.name,
        groupId: thisGroup.id,
        templateId: templateId,
        templateName: templateName,
        submissions: evaluations.length,
        averageScore: averageScore,
        possibleScore: possibleScore,
        averagePercentageScore: averagePercentageScore,
        templateSections: templateSections,
        evaluations: evaluations,
      });
    }

    data.push(data2);
  }
  return data;
}

function SummaryLine({
  name,
  percentageScore,
  className,
  list,
  hide,
  toggleHide,
  evaluationId,
  timeStamp,
  isYou,
  editLink,
  summaryLink,
  history,
}) {
  let [showList, setShowList] = useState(false);

  return (
    <div>
      <div
        className={classnames(
          styles.line_style,
          className && className,
          evaluationId && hide && hide[evaluationId] && styles.hide_line
        )}
      >
        <div className={classnames(styles.name_style, styles.title_container)}>
          {list && (
            <div
              className={styles.caret_button}
              onClick={() => setShowList(!showList)}
            >
              {(showList && <i className="fas fa-caret-down" />) || (
                <i className="fas fa-caret-right" />
              )}
            </div>
          )}

          <span
            onClick={() => {
              summaryLink && history.push(summaryLink);
            }}
          >
            {isYou ? (
              <span className={styles.isYou}>{name} (you)</span>
            ) : (
              <span>{name}</span>
            )}
          </span>
        </div>

        <div className={styles.score_container}>
          <div className={styles.edit_container}>
            {(isYou && editLink && (
              <Button
                style={{ margin: "0px" }}
                size="small"
                type="just_text"
                onClick={() => {
                  history.push(editLink);
                }}
              >
                edit
              </Button>
            )) || <span />}
          </div>

          {(evaluationId && toggleHide && (
            <div
              className={styles.eye_toggle}
              onClick={() => {
                toggleHide(evaluationId);
              }}
            >
              {hide &&
                (hide[evaluationId] ? (
                  <i className="fal fa-eye-slash" />
                ) : (
                  <i className="fal fa-eye" />
                ))}
            </div>
          )) || <span />}

          {(timeStamp && (
            <div className={styles.timeStamp}>{timeStamp}</div>
          )) || <span />}

          <div className={styles.score_style}>{percentageScore}%</div>
        </div>
      </div>

      {showList && list && (
        <div className={styles.expanded_list_container}>
          {list.map((item, i) => (
            <SummaryLine
              key={i}
              hide={hide}
              evaluationId={evaluationId}
              name={item.name}
              percentageScore={item.percentageScore}
              className={classnames(className, styles.sub_list)}
              history={history}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EvaluationsByTemplate({
  data,
  connection,
  user,
  templateId,
  hide,
  toggleHide,
  history,
  settings,
}) {
  let list = (data.templateSections || []).map(item => ({
    name: item.name,
    percentageScore: Math.round((item.score / item.possibleScore) * 100),
  }));

  return (
    <div className={styles.each_template_style}>
      <div className={styles.header_style}>
        <SummaryLine
          hide={hide}
          name={data.templateName}
          percentageScore={data.averagePercentageScore}
          className={classnames(styles.template_summary_line)}
          list={list.length > 1 && list}
          history={history}
        />
      </div>

      {settings.showUsers &&
        data.evaluations.map((evaluation, i) => {
          let { given_name, family_name, email } =
            evaluation.createdByUser || {};
          let percentageScore = Math.round(
            (evaluation.summary.totalScore / evaluation.summary.possibleScore) *
              100
          );

          let list = (evaluation.summary?.sections || []).map(item => ({
            name: item.name,
            percentageScore: Math.round(
              (item.score / item.possibleScore) * 100
            ),
          }));

          let editLink = `${startup_page}/${connection.id}/evaluation/${evaluation.id}`;

          return (
            <SummaryLine
              key={evaluation.id}
              hide={hide}
              toggleHide={toggleHide}
              evaluationId={evaluation.id}
              timeStamp={moment(evaluation.updatedAt).format("ll")}
              name={`${given_name} ${family_name}`}
              isYou={user.email === email}
              editLink={editLink}
              summaryLink={`${editLink}/summary`}
              percentageScore={percentageScore}
              className={classnames(styles.each_evaluation_line)}
              list={list.length > 1 && list}
              history={history}
            />
          );
        })}
    </div>
  );
}

function PublicEvaluations({ publicEvaluations, history }) {
  let [showList, setShowList] = useState(false);
  let [hide, setHide] = useState({});

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }

  if (!publicEvaluations.length) {
    return <span />;
  }

  return (
    <div className={styles.group_of_evaluations}>
      <div className={styles.from_group}>
        <span>External evaluations</span>
      </div>
      {publicEvaluations.map((evaluation, i) => {
        let { given_name, family_name, email } = evaluation;

        let percentageScore = Math.round(
          (evaluation.summary.totalScore / evaluation.summary.possibleScore) *
            100
        );

        let list = (evaluation.summary?.sections || []).map(item => ({
          name: item.name,
          percentageScore: Math.round((item.score / item.possibleScore) * 100),
        }));

        return (
          <SummaryLine
            key={i}
            hide={hide}
            toggleHide={toggleHide}
            evaluationId={evaluation.id}
            timeStamp={moment(evaluation.updatedAt).format("ll")}
            name={`${given_name} ${family_name}`}
            isYou={false}
            percentageScore={percentageScore}
            className={classnames(styles.each_evaluation_line)}
            list={list}
            history={history}
          />
        );
      })}
    </div>
  );
}

function GroupEvaluations({
  connection,
  groups,
  user,
  evaluations,
  evaluationTemplates,
  history,
}) {
  const [hide, setHide] = useState({});
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate] = useMutation(evaluationPut);

  let data = getEvaluationSummaries({
    connection,
    groups,
    evaluations,
    evaluationTemplates,
    hide,
  });

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }
  // console.log('data', data)

  return (
    <div>
      {data
        .filter(groupEvaluations => {
          let { groupId } = groupEvaluations[0] || {};
          let group = groups.find(({ id }) => id === groupId);
          const settings = group.settings || {};
          return settings.showScores;
        })
        .map(groupEvaluations => {
          let { groupName, groupId } = groupEvaluations[0] || {};
          let group = groups.find(({ id }) => id === groupId);
          const settings = group.settings || {};
          let groupEvaluationTemplates = (
            group.evaluationTemplates || []
          ).filter(template => {
            let hasEvaluated = connection.evaluations.find(
              ({ templateId, createdBy }) => {
                let templateMatch = templateId === template.id;
                let userMatch = createdBy === user.cognitoIdentityId;
                return templateMatch && userMatch;
              }
            );
            return !hasEvaluated;
          });

          return (
            <div key={groupId}>
              <div className={styles.group_of_evaluations}>
                <div>
                  <div className={styles.from_group}>
                    <span>From group: </span>
                    <Link
                      to={{
                        pathname: `${group_route}/${groupId}`,
                      }}
                    >
                      {groupName}
                    </Link>
                  </div>

                  {groupEvaluations.map(d => {
                    return (
                      <EvaluationsByTemplate
                        key={d.templateId}
                        templateId={d.templateId}
                        connection={connection}
                        user={user}
                        data={d}
                        hide={hide}
                        toggleHide={toggleHide}
                        settings={settings}
                        history={history}
                      />
                    );
                  })}
                </div>
              </div>

              {!!groupEvaluationTemplates.length && (
                <div className={styles.group_footer}>
                  <div className={styles.group_footer_title}>
                    You are kindly requested to share the following with{" "}
                    {group.name}:
                  </div>

                  <div className={styles.group_footer_buttons_container}>
                    {groupEvaluationTemplates.map(template => {
                      return (
                        <div
                          className={styles.group_footer_button}
                          key={`${groupId}-${template.id}`}
                        >
                          <Button
                            type="right_arrow"
                            size="medium"
                            key={`${group.id}-${template.id}`}
                            loading={currentLoading === template.id}
                            onClick={async () => {
                              if (currentLoading === template.id) return;

                              setCurrentLoading(template.id);

                              let sectionId = template.sections[0]?.id;

                              try {
                                let variables = {
                                  connectionId: connection.id,
                                  groupId: group.id,
                                  input: {
                                    templateId: template.id,
                                    name: template.name,
                                    description: template.description,
                                  },
                                };

                                let res = await mutate({ variables });
                                let evaluation = res.data.evaluationPut;
                                let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${sectionId}`;
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
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

function getEvaluationSummariesForTeam({ evaluations, hide }) {
  let data = [];

  // Cluster evaluations by template ID
  // ––––––––––––––––––––––––––––––––––
  let evaluationsByTemplate = {};
  for (let evaluation of evaluations) {
    evaluationsByTemplate[evaluation.templateId] =
      evaluationsByTemplate[evaluation.templateId] || [];
    evaluationsByTemplate[evaluation.templateId].push(evaluation);
  }

  for (let templateId in evaluationsByTemplate) {
    // Get all shared evaluations
    let evaluations = evaluationsByTemplate[templateId] || [];

    // Get possible score
    let possibleScore = evaluations[0]?.summary?.possibleScore;

    // Get template name
    let templateName = evaluations[0]?.summary?.templateName;

    // Get template sections
    let templateSections = evaluations[0]?.summary?.sections;

    // Get total score
    let totalScore = 0;
    let count = 0;
    for (let evaluation of evaluations) {
      if (!hide[evaluation.id]) {
        totalScore += evaluation.summary?.totalScore || 0;
        count += 1;
      }
    }

    // Get average score
    let averageScore = parseFloat((totalScore / count).toFixed(1));

    // Get average percentage score
    let averagePercentageScore =
      Math.round((averageScore / possibleScore) * 100) || 0;

    // Put it all together

    let d = {
      // groupName: thisGroup.name,
      // groupId: thisGroup.id,
      templateId: templateId,
      templateName: templateName,
      submissions: evaluations.length,
      averageScore: averageScore,
      possibleScore: possibleScore,
      averagePercentageScore: averagePercentageScore,
      templateSections: templateSections,
      evaluations: evaluations,
    };

    data.push(d);
  }

  return data;
}

function TeamEvaluatons({ connection, user, evaluations, history }) {
  let [hide, setHide] = useState({});

  let data = getEvaluationSummariesForTeam({ evaluations, hide });

  function toggleHide(evaluationId) {
    setHide({
      ...hide,
      [evaluationId]: !hide[evaluationId],
    });
  }

  if (!data.length) {
    return <span />;
  }

  return (
    <div className={styles.group_of_evaluations}>
      <div className={styles.from_group}>
        <span>Your evaluations</span>
      </div>

      {data.map((templateData, i) => {
        let {
          templateName,
          averagePercentageScore,
          evaluations,
          templateSections,
        } = templateData;

        let list = (templateSections || []).map(item => ({
          name: item.name,
          percentageScore: Math.round((item.score / item.possibleScore) * 100),
        }));

        return (
          <div key={i} className={styles.each_template_style}>
            <div className={styles.header_style}>
              <SummaryLine
                hide={hide}
                name={templateName}
                percentageScore={averagePercentageScore}
                className={classnames(styles.template_summary_line)}
                list={list.length > 1 && list}
                history={history}
              />
            </div>

            {evaluations.map((evaluation, ii) => {
              let { given_name, family_name, email } =
                evaluation.createdByUser || {};
              let totalScore = evaluation?.summary?.totalScore || 0;
              let possibleScore = evaluation?.summary?.possibleScore || 0;
              let percentageScore = Math.round(
                (totalScore / possibleScore) * 100
              );

              let list = (evaluation.summary?.sections || []).map(item => {
                let totalScore = item.score || 0;
                let possibleScore = item.possibleScore || 0;
                return {
                  name: item.name,
                  percentageScore: Math.round(
                    (totalScore / possibleScore) * 100
                  ),
                };
              });

              let editLink = `${startup_page}/${connection.id}/evaluation/${evaluation.id}`;

              return (
                <SummaryLine
                  key={evaluation.id}
                  hide={hide}
                  toggleHide={toggleHide}
                  evaluationId={evaluation.id}
                  timeStamp={moment(evaluation.updatedAt).format("ll")}
                  name={`${given_name} ${family_name}`}
                  isYou={user.email === email}
                  editLink={editLink}
                  summaryLink={`${editLink}/summary`}
                  percentageScore={percentageScore}
                  className={classnames(styles.each_evaluation_line)}
                  list={list.length > 1 && list}
                  history={history}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function NewEvaluationLogic({ evaluations, templates, connection, history }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate, { loading }] = useMutation(evaluationPut);

  let groupsWithTemplates = [];

  async function selectTemplate({ templateId, name, description }) {
    setCurrentLoading(templateId);
    try {
      let res = await mutate({
        variables: {
          connectionId: connection.id,
          input: { templateId, name, description },
        },
      });
      let evaluation = res.data.evaluationPut;
      let template = templates.find(
        t => t && t.id === evaluation.templateId
      ) || { sections: [{ id: null }] };

      let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${template.sections[0].id}`;
      history.push(path);
    } catch (error) {
      console.log("error", error);
    }
    setCurrentLoading("");
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "use",
      width: 30,
      render: ({ id: templateId, name, description }) => {
        return (
          <Button
            type="right_arrow"
            size="small"
            onClick={() => {
              if (currentLoading) return;

              let haveUsedThisTemplateBefore = evaluations.some(
                evaluation => evaluation.templateId === templateId
              );

              if (!haveUsedThisTemplateBefore) {
                selectTemplate({ templateId, name, description });
              } else {
                setShowConfirmModal({ templateId, name, description });
                setShowModal(false);
              }
            }}
            loading={loading && currentLoading === templateId}
          >
            use
          </Button>
        );
      },
    },
  ];

  return (
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button
          type={
            (evaluations.length && !groupsWithTemplates.length) ||
            groupsWithTemplates.length ||
            connection.sharedWithMe?.length
              ? "just_text"
              : "right_arrow"
          }
          size="small"
          onClick={() => setShowModal(true)}
        >
          + new evaluation
        </Button>
      </div>

      <EvaluationRequest connection={connection} />

      {showModal && (
        <Modal
          title="Evaluate startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <div style={{ padding: "10px 0px 0px 8px" }}>
            <Table
              dataSource={templates}
              columns={columns}
              disableHead={true}
              pagination={false}
            />
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => setShowModal(false)}
            >
              cancel
            </Button>
          </div>
        </Modal>
      )}

      {showConfirmModal && (
        <Modal
          title="Evaluate startup"
          close={() => {
            setShowConfirmModal(undefined);
            setShowModal(true);
          }}
          disableFoot={true}
        >
          <div
            style={{
              padding: "10px 0px 0px 8px",
              fontSize: "16px",
              lineHeight: 2,
            }}
          >
            <span>
              You have already evaluated this startup using this template. You
              can edit evaluation, or create a new one by clicking "USE".
            </span>
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
              textAlign: "right",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => {
                setShowConfirmModal(undefined);
                setShowModal(true);
              }}
            >
              cancel
            </Button>

            <Button
              type="right_arrow"
              size="medium"
              loading={currentLoading}
              onClick={() => selectTemplate(showConfirmModal)}
            >
              use
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function EvaluationBox({ connection, groups, user, history }) {
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  let templates = [];

  if (!evaluationTemplatesQuery.loading && evaluationTemplatesQuery.data) {
    templates =
      evaluationTemplatesQuery.data.accountGet.evaluationTemplates || [];
  }

  if (!connection) return <span />;

  const evaluations = connection.evaluations || [];
  const publicEvaluations = connection.publicEvaluations || [];

  return (
    <>
      {!evaluations.length && (
        <div style={{ paddingTop: "20px" }}>
          <div style={{ fontSize: "18px" }}>Evaluate this startup</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            Evaluate this startup based on your own criteria, or choose from
            predefined templates.
          </div>
        </div>
      )}

      <PublicEvaluations
        publicEvaluations={publicEvaluations}
        connection={connection}
        history={history}
        evaluationTemplates={templates}
        user={user}
      />

      <GroupEvaluations
        groups={groups}
        evaluations={evaluations}
        connection={connection}
        evaluationTemplates={templates}
        user={user}
        history={history}
      />

      <TeamEvaluatons
        evaluations={evaluations}
        connection={connection}
        history={history}
        evaluationTemplates={templates}
        user={user}
      />

      <NewEvaluationLogic
        templates={templates}
        evaluations={evaluations}
        connection={connection}
        history={history}
      />
    </>
  );
}
