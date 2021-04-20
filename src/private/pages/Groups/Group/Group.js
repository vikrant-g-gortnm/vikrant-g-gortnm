import React, { useState, useEffect } from "react";
import {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";

import {
  userGet,
  groupGet,
  connectionsGet,
  evaluationTemplateNamesGet,
} from "private/Apollo/Queries";

import { groupLogGet } from "private/Apollo/Queries";
import { groupPut, groupLogPut } from "private/Apollo/Mutations";
import { groupLogSubscription } from "private/Apollo/Subscriptions";
import AddNewMember from "./AddMember";
import AddNewStartup from "./AddStartup";
import StartupList2 from "./StartupList2";
import Activity from "Components/Activity/Activity";

import {
  group as group_route,
  evaluation_template_summary,
} from "definitions.js";

import {
  BreadCrumbs,
  Content,
  Card,
  Table,
  Button,
  Modal,
  GhostLoader,
} from "Components/elements";

function SharedBy({ group }) {
  let admins = group.members
    .filter(m => m.role === "admin")
    .map(({ email }) => email);

  return (
    <div>
      {admins.length === 1
        ? "The administrator of this group is: "
        : "The administrators of this group are: "}
      <span style={{ color: "var(--color-primary)" }}>{admins.join(", ")}</span>
    </div>
  );
}

function MemberList({ group, user, isAdmin }) {
  const [isLoading, setIsLoading] = useState({});
  const [show, setShow] = useState(false);
  const [mutate] = useMutation(groupPut);

  let columns = [
    {
      title: "",
      dataIndex: "email",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: email => {
        if (!isAdmin) return <span />;
        if (email === user.email) return <span />;

        if (isLoading[email]) {
          return <i className="fa fa-spinner fa-spin" />;
        }

        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              setIsLoading({ [email]: true });

              let variables = {
                id: group.id,
                input: { removeMember: email },
              };

              mutate({
                variables,
                update: (proxy, { data: { groupPut } }) => {
                  const data = proxy.readQuery({
                    query: groupGet,
                    variables: { id: group.id },
                  });

                  proxy.writeQuery({
                    query: groupGet,
                    variables: { id: group.id },
                    data: {
                      groupGet: {
                        ...data.groupGet,
                        members: data.groupGet.members.filter(
                          m => m.email !== email
                        ),
                      },
                    },
                  });

                  setIsLoading({ [email]: false });
                },
              });
            }}
          />
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: email => <span>{email}</span>,
    },
  ];

  if (!isAdmin) {
    columns.shift();
  }

  return (
    <>
      <div>
        This group has {group.members.length} members.
        <Button
          buttonStyle={"secondary"}
          size={"small"}
          onClick={() => setShow(true)}
        >
          See members
        </Button>
      </div>

      {show && (
        <Modal
          title="Group members"
          close={() => {
            setShow(false);
          }}
          disableFoot={false}
          showScrollBar={true}
        >
          <Table
            dataSource={group.members || []}
            columns={columns}
            disableHead={true}
            pagination={false}
          />
        </Modal>
      )}
    </>
  );
}

function AddNewTemplate({ group, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const { data } = useQuery(evaluationTemplateNamesGet);

  let templates = [];
  if (data) {
    templates = data.accountGet.evaluationTemplates;
  }

  templates = templates.filter(
    ({ id }) => !group.evaluationTemplates.some(t => t.id === id)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "add",
      width: 30,
      render: template => {
        return (
          <Button
            size="small"
            loading={isLoading === template.id}
            onClick={async () => {
              if (isLoading === template.id) return;
              setIsLoading(template.id);

              let variables = {
                id: group.id,
                input: { addTemplate: template.id },
              };
              try {
                await mutate({ variables });
                setShowModal(false);
              } catch (error) {
                console.log("error", error);
              }

              setIsLoading(null);
            }}
          >
            add
          </Button>
        );
      },
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        // top: "-40px",
      }}
    >
      <Button
        onClick={() => setShowModal(true)}
        type="just_text"
        //size="large"
      >
        Share evaluation template
      </Button>

      {showModal && (
        <Modal
          title="Share evaluation template"
          close={() => {
            setShowModal(false);
          }}
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
        </Modal>
      )}
    </div>
  );
}

const Templates = ({ templates, isAdmin, mutate, group, history }) => {
  const [isLoading, setIsLoading] = useState(null);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "add",
      width: 30,
      render: template => {
        return (
          <Button
            size="small"
            type="right_arrow"
            onClick={() => {
              let path = `${evaluation_template_summary}/${template.id}`;
              history.push(path);
            }}
          >
            view
          </Button>
        );
      },
    },
  ];

  if (isAdmin) {
    let delCel = {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: id => {
        if (isLoading === id) {
          return <i className="fa fa-spinner fa-spin" />;
        }

        return (
          <i
            className="fal fa-trash-alt"
            onClick={async () => {
              setIsLoading(id);

              try {
                let variables = {
                  id: group.id,
                  input: { removeTemplate: id },
                };

                await mutate({ variables });

                // await mutate({
                //   variables,
                //   refetchQueries: [
                //     {
                //       query: groupGet,
                //       variables: { id: group.id },
                //     },
                //   ],
                // });
              } catch (error) {
                console.log("error", error);
              }

              setIsLoading(null);
            }}
          />
        );
      },
    };

    columns.unshift(delCel);
  }

  return (
    <Table
      dataSource={templates}
      columns={columns}
      disableHead={true}
      pagination={false}
    />
  );
};

const GroupActivity = ({ user, group }) => {
  const [mutate] = useMutation(groupLogPut);
  const logQuery = useQuery(groupLogGet, {
    variables: { groupId: group.id },
  });
  const [logsState, setLogsState] = useState([]);

  // let logs = [];
  // if (!logQuery.error && !logQuery.loading && logQuery.data) {
  //   logs = logQuery.data.groupLogGet;
  // }

  useSubscription(groupLogSubscription, {
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (
        !data ||
        data.subscribeToAllGroupLogPutEvents.groupId !== group.id ||
        data.subscribeToAllGroupLogPutEvents.createdByUser.email === user.email
      ) {
        return;
      }
      const groupLogs = client.readQuery({
        query: groupLogGet,
        variables: { groupId: group.id },
      });
      client.writeQuery({
        query: groupLogGet,
        variables: { groupId: group.id },
        data: {
          groupLogGet: [
            ...groupLogs.groupLogGet,
            data.subscribeToAllGroupLogPutEvents,
          ],
        },
      });
      setLogsState(
        [...groupLogs.groupLogGet, data.subscribeToAllGroupLogPutEvents].filter(
          l => l.logType === "COMMENT"
        )
      );
    },
  });

  useEffect(() => {
    if (logQuery.data?.groupLogGet) {
      setLogsState(
        logQuery.data.groupLogGet.filter(l => l.logType === "COMMENT")
      );
    }
  }, [logQuery.data]);

  const submitMutation = value => {
    let variables = {
      groupId: group.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "TEXT",
            val: value,
          },
        ],
      },
    };

    mutate({
      variables,
      // optimisticResponse: {
      //   __typename: "Mutation",
      //   groupLogPut: {
      //     __typename: "GroupLogItem",
      //     id: "",
      //     groupId: group.id,
      //     createdByUser: {
      //       __typename: "SimpleUser",
      //       given_name: user.given_name,
      //       family_name: user.family_name,
      //       email: user.email,
      //     },
      //     dataPairs: [
      //       {
      //         key: "TEXT",
      //         val: data.val,
      //         __typename: "KeyVal",
      //       },
      //     ],
      //   },
      // },
      update: (proxy, { data: { groupLogPut } }) => {
        const data = proxy.readQuery({
          query: groupLogGet,
          variables: { groupId: group.id },
        });

        proxy.writeQuery({
          query: groupLogGet,
          variables: { groupId: group.id },
          data: {
            groupLogGet: [...data?.groupLogGet, groupLogPut],
          },
        });
      },
    });
  };

  return (
    <Activity user={user} logs={logsState} submitMutation={submitMutation} />
  );
};

export default function Group({ match, history }) {
  const [memberView, setMemberView] = useState(false);

  const id = match.params.id;
  const [mutate] = useMutation(groupPut);
  const [getData, groupQuery] = useLazyQuery(groupGet);
  const connectionsQuery = useQuery(connectionsGet);
  const userQuery = useQuery(userGet);

  useEffect(() => getData({ variables: { id } }), [getData, id]);

  const hasAllData = groupQuery.data && connectionsQuery.data && userQuery.data;

  const error = groupQuery.error || connectionsQuery.error || userQuery.error;

  const loading =
    groupQuery.loading || connectionsQuery.loading || userQuery.loading;

  if (error) {
    console.log("error", error);
    return <div>We're updaing...</div>;
  }

  if (!hasAllData && loading) return <GhostLoader />;

  // const group = groupQuery.data?.groupGet;

  let g = groupQuery.data?.groupGet;

  let group = {
    ...g,
    startups: [
      ...g.startups.map(s => {
        return {
          ...s,
          connection: {
            ...s.connection,
            id: s?.connection?.id?.split("?")[0],
          },
        };
      }),
    ],
  };

  const connections = connectionsQuery.data?.connectionsGet || [];
  const user = userQuery.data?.userGet;
  const settings = group?.settings || { showUsers: false };

  // console.log('group', group)
  // console.log('connections.length', connections.length)

  let isActualAdmin = group?.members?.some(
    ({ email, role }) => email === user.email && role === "admin"
  );

  let isAdmin = memberView ? !memberView : isActualAdmin;

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "All Groups",
            link: `${group_route}`,
          },
          {
            val: `Group: ${group.name}`,
            link: `${group_route}/${id}`,
          },
        ]}
      />

      <GroupActivity user={user} group={group} />
      <Content maxWidth={780} style={{ paddingBottom: "200px" }}>
        <div style={{ marginBottom: "50px" }}>
          <h1>{group.name}</h1>
        </div>

        {/* List ALL users to everyone */}
        <Card label="Group members" style={{ padding: "20px" }}>
          <SharedBy
            group={group}
            mutate={mutate}
            isAdmin={isAdmin}
            user={user}
          />

          {(isAdmin || (!isAdmin && settings.showUsers)) && (
            <div style={{ marginTop: "10px" }}>
              <MemberList
                group={group}
                mutate={mutate}
                isAdmin={isAdmin}
                user={user}
              />
            </div>
          )}
        </Card>

        {
          /* Invite member */
          (isAdmin || (!isAdmin && settings.showUsers && settings.addUser)) && (
            <AddNewMember group={group} mutate={mutate} />
          )
        }

        {isActualAdmin && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Button
                buttonStyle={memberView && "secondary"}
                size={"medium"}
                onClick={() => setMemberView(false)}
              >
                Admin view
              </Button>
              <Button
                buttonStyle={!memberView && "secondary"}
                size={"medium"}
                onClick={() => setMemberView(true)}
              >
                Member view
              </Button>
            </div>

            <div
              style={{
                fontWeight: "var(--font-weight-light)",
                fontSize: "16px",
                cursor: "pointer",
                position: "relative",
                top: "10px",
              }}
              onClick={() => {
                let path = `${group_route}/${group.id}/settings`;
                history.push(path);
              }}
            >
              <i className="fal fa-gear" /> settings
            </div>
          </div>
        )}

        {!!group.startups.length && (
          <StartupList2
            connections={connections || []}
            group={group}
            mutate={mutate}
            history={history}
            user={user}
            isAdmin={isAdmin}
            settings={settings}
          />
        )}

        {
          /* Add new startup */
          (isAdmin || (!isAdmin && settings.addStartup)) && (
            <AddNewStartup
              connections={connections}
              group={group}
              mutate={mutate}
            />
          )
        }

        {isAdmin && (
          <div style={{ top: "40px", position: "relative" }}>
            {group.evaluationTemplates && !!group.evaluationTemplates.length && (
              <Card label="Evaluation templates" style={{ paddingTop: "5px" }}>
                <Templates
                  templates={group.evaluationTemplates}
                  isAdmin={isAdmin}
                  history={history}
                  mutate={mutate}
                  group={group}
                />
              </Card>
            )}

            {
              /* Add new startup */
              (isAdmin || (!isAdmin && settings.addStartup)) && (
                <AddNewTemplate
                  isAdmin={isAdmin}
                  // connections={connections}
                  group={group}
                  mutate={mutate}
                />
              )
            }
          </div>
        )}

        {isAdmin && (
          <div
            style={{
              float: "right",
              fontWeight: "var(--font-weight-light)",
              fontSize: "16px",
              cursor: "pointer",
              position: "relative",
              top: "100px",
            }}
            onClick={() => {
              let path = `${group_route}/${group.id}/settings`;
              history.push(path);
            }}
          >
            <i className="fal fa-gear" /> settings
          </div>
        )}
      </Content>
    </>
  );
}
