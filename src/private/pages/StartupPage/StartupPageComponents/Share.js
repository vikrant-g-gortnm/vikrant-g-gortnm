import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import moment from "moment";
import * as yup from "yup";
import { Modal, Table, Button } from "Components/elements";

import { groupsGet, connectionGet } from "private/Apollo/Queries";
import { groupPut } from "private/Apollo/Mutations";

import validateEmail from "utils/validateEmail";
import { group as group_route } from "definitions.js";

import styles, { share_description, action_link } from "./Share.module.css";
import { Link } from "react-router-dom";

function ShareSetting({ group, connection, mutate, done }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let variables = {
      id: group.id,
      input: {
        addStartup: {
          connectionId: connection.id,
          creativeId: connection.creativeId,
          ...data,
        },
      },
    };

    try {
      await mutate({
        variables,
        refetchQueries: [
          {
            query: connectionGet,
            variables: { id: connection.id },
          },
        ],
      });
      done();
    } catch (error) {
      console.log("error", error);
    }
  };

  let { haveShared } = group;

  return (
    <div>
      <div className={share_description}>
        In addition to the facts part of the startup, what else would you like
        to share with this group?
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={!haveShared || haveShared.evaluations}
            name="evaluations"
            id="evaluations"
          />
          <label>evaluations</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={!haveShared || haveShared.subjective_score}
            name="subjective_score"
            id="subjective_score"
          />
          <label>subjective score</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={!haveShared || haveShared.tags}
            name="tags"
            id="tags"
          />
          <label>tags</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={!haveShared || haveShared.comments}
            name="comments"
            id="comments"
          />
          <label>comments</label>
        </div>

        <div
          style={{
            marginTop: "15px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </form>
    </div>
  );
}

function RevokeSharing({ group, connection, user }) {
  const [mutate, { loading }] = useMutation(groupPut);

  return (
    <div
      className={action_link}
      onClick={() => {
        if (loading) return;

        let variables = {
          id: group.id,
          input: { removeStartup: connection.id },
        };
        mutate({
          variables,
          update: (proxy, { data: { groupPut } }) => {
            const data = proxy.readQuery({
              query: groupsGet,
            });
            proxy.writeQuery({
              query: groupsGet,
              data: {
                groupsGet: [
                  ...data.groupsGet.map(g => {
                    if (g.id !== group.id) return g;
                    return {
                      ...g,
                      startups: g.startups.filter(
                        s =>
                          !(
                            s.connectionId === connection.id &&
                            s.sharedBy === user.email
                          )
                      ),
                    };
                  }),
                ],
              },
            });
          },
        });
      }}
    >
      {/*<i className="fal fa-trash-alt" />*/}
      revoke sharing {loading && <i className="fa fa-spinner fa-spin" />}
    </div>
  );
}

function SharedWithGroupList(props) {
  let { groups, connection, user, shareStartup } = props;

  const columns = [
    {
      title: "Name",
      key: "name",
      render: group => {
        let haveShared = group.startups.find(
          ({ sharedBy, connectionId }) =>
            sharedBy === user.email && connectionId === connection.id
        );

        // console.log("group", group);

        return (
          <span>
            <div>
              {group.name}

              {haveShared && (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    shareStartup(group, haveShared);
                  }}
                >
                  {" "}
                  <i className="fal fa-gear" />
                </span>
              )}
            </div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {group.members.length} members -{" "}
              {moment(group.createdAt).format("ll")}
            </div>

            {haveShared && (
              <>
                <RevokeSharing
                  user={user}
                  group={group}
                  connection={connection}
                />
              </>
            )}

            {!haveShared && group.settings && group.settings.addStartup && (
              <div className={action_link} onClick={() => shareStartup(group)}>
                <i className="fal fa-share-alt" /> share with this group
              </div>
            )}
          </span>
        );
      },
    },

    {
      title: "",
      key: "connectionId",
      width: 30,
      render: group => (
        <Link
          className={styles.link}
          to={{
            pathname: `${group_route}/${group.id}`,
          }}
        >
          VIEW
        </Link>
      ),
    },
  ];

  return (
    <div
      style={{
        marginTop: "-10px",
        borderBottom: "1px solid var(--color-gray-light)",
      }}
    >
      <Table
        dataSource={groups}
        columns={columns}
        disableHead={true}
        pagination={false}
      />
    </div>
  );
}

function CreateNewGroup({ done, cancel, mutate }) {
  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    let variables = {
      input: {
        name: email,
        addMember: email,
      },
    };
    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupsGet,
          });

          proxy.writeQuery({
            query: groupsGet,
            data: {
              groupsGet: [...data.groupsGet, groupPut],
            },
          });
          done(groupPut);
        },
      });
      event.target.reset();
    } catch (error) {
      return console.log("error", error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder={"name@email.com"}
          autoComplete="off"
          ref={register({ required: true })}
          name="email"
        />
        {errors && errors.email && (
          <p style={{ color: "red" }}>must be a valid email address</p>
        )}

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
}

export function Share({ connection, groups, user, history }) {
  const [showModal, setShowModal] = useState(false);
  const [showCreateNewGroup, setShowCreateNewGroup] = useState(false);
  const [showShareSettings, setShowShareSettings] = useState(null);

  const [mutate] = useMutation(groupPut);

  // const { data } = useQuery(groupsGet);
  // let groups = data?.groupsGet || [];

  let sharedWithGroups =
    groups.filter(g =>
      g.startups.some(s => {
        return s.connectionId === connection.id;
      })
    ) || [];

  let groupsWithThisStartup =
    groups.filter(g =>
      g.startups.some(s => {
        return s.creativeId === connection.creativeId;
      })
    ) || [];

  sharedWithGroups = groupsWithThisStartup;

  let notSharedWithGroups =
    groups.filter(
      g =>
        !g.startups.some(s => s.connectionId === connection.id) &&
        g.settings &&
        g.settings.addStartup
    ) || [];

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
      render: group => {
        return (
          <Button
            size="small"
            onClick={() => {
              setShowShareSettings(group);
            }}
          >
            add
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: "15px" }}>
      {(!sharedWithGroups.length && (
        <div>
          <div style={{ fontSize: "18px" }}>Share this startup</div>
          <div
            style={{
              padding: "20px 0px",
              color: "var(--color-gray-medium)",
            }}
          >
            You can share this starup with your external network, regardless of
            them having a Notata account or not. You can choose what you would
            like to give access to. No emails will be sent automatically from
            Notata, so you can safely expermient and send the shared link when
            you are ready for it.
          </div>
        </div>
      )) || (
        <SharedWithGroupList
          user={user}
          connection={connection}
          groups={sharedWithGroups}
          mutate={mutate}
          history={history}
          shareStartup={(shareGroup, haveShared) => {
            setShowModal(true);
            setShowCreateNewGroup(false);
            setShowShareSettings({ ...shareGroup, haveShared });
          }}
        />
      )}

      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button
          onClick={() => setShowModal(true)}
          type="right_arrow"
          size="small"
        >
          Share
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Share startup"
          close={() => {
            setShowModal(false);
            setShowShareSettings(null);
            setShowCreateNewGroup(false);
          }}
          disableFoot={true}
        >
          {!showShareSettings && (
            <div>
              {((!notSharedWithGroups.length || showCreateNewGroup) && (
                <>
                  <CreateNewGroup
                    mutate={mutate}
                    done={group => {
                      setShowShareSettings(group);
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
                      onClick={() => {
                        setShowCreateNewGroup(false);
                        setShowModal(false);
                      }}
                    >
                      cancel
                    </Button>
                  </div>
                </>
              )) || (
                <div style={{ padding: "10px 0px 0px 8px" }}>
                  <Table
                    dataSource={notSharedWithGroups}
                    columns={columns}
                    disableHead={true}
                    pagination={false}
                  />

                  <div
                    style={{
                      textAlign: "right",
                      paddingTop: "30px",
                      borderTop: "1px solid var(--color-gray-light)",
                    }}
                  >
                    <Button
                      size="medium"
                      onClick={() => {
                        setShowCreateNewGroup(true);
                      }}
                    >
                      Share with new
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showShareSettings && (
            <>
              <ShareSetting
                group={showShareSettings}
                connection={connection}
                mutate={mutate}
                done={() => {
                  setShowModal(false);
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
                  onClick={() => {
                    setShowModal(false);
                    setShowShareSettings(null);
                  }}
                >
                  cancel
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
