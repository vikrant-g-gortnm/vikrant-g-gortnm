import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import validateEmail from "utils/validateEmail";

// API STUFF
import {
  userGet,
  userInvitationsGet,
  accountGet,
  accountInvitationsGet,
} from "private/Apollo/Queries";

import {
  accountInvite,
  userInvitationResponse,
} from "private/Apollo/Mutations";

import {
  delete_bucket,
  external_invitation_head,
  external_invitations,
  external_invitation_each,
  external_invitation_company,
  external_invitation_name,
  external_invitation_email,
  external_invitation_buttons,
} from "./Team.module.css";

import {
  Content,
  Card,
  Table,
  Button,
  Modal,
  GhostLoader,
  BreadCrumbs,
} from "Components/elements";

import { team, settings } from "definitions.js";

function Invite({ account, user }) {
  const [showModal, setShowModal] = useState(false);

  const [mutate] = useMutation(accountInvite);
  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });
  const { isSubmitting } = formState;

  const onSubmit = async ({ email }, event) => {
    if (!validateEmail(email)) return;
    let variables = { email };

    try {
      await mutate({
        variables,
        updateQueries: {
          accountInvitationsGet: (prev, { mutationResult, queryVariables }) => {
            return {
              accountInvitationsGet: [
                ...prev.accountInvitationsGet,
                {
                  email,
                  createdAt: new Date().getTime(),
                  __typename: "AccountInvitation",
                  accountId: account.id,
                  createdBy: user.cognitoIdentityId,
                },
              ],
            };
          },
        },
      });
      event.target.reset();
      setShowModal(false);
    } catch (error) {
      return console.log("error", error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        type="right_arrow"
        size="large"
      >
        Invite new member
      </Button>

      {showModal && (
        <Modal
          title="Invite new member"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt3">
              <input
                type="text"
                placeholder="name@email.com"
                autoComplete="off"
                ref={register()}
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
        </Modal>
      )}
    </>
  );
}

function PendingInvitations({ accountInvitations }) {
  const [mutate, { loading }] = useMutation(accountInvite);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: email => <span>{email}</span>,
    },

    {
      title: "",
      dataIndex: "email",
      key: "delete",
      width: 20,
      className: delete_bucket,
      render: email => {
        if (loading) {
          return <i className="fa fa-spinner fa-spin" />;
        }

        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete the team invitation for ${email}`
                )
              ) {
                /* Do nothing */
              } else {
                return;
              }

              let variables = { email: email };
              mutate({
                variables,
                updateQueries: {
                  accountInvitationsGet: (
                    prev,
                    { mutationResult, queryVariables }
                  ) => ({
                    accountInvitationsGet: prev.accountInvitationsGet.filter(
                      ai => ai.email !== email
                    ),
                  }),
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <Table
      dataSource={accountInvitations}
      columns={columns}
      loading={loading}
      disableHead={true}
      pagination={false}
    />
  );
}

function TeamMembers({ user, account }) {
  // TODO: Create mutation backend
  // let [ mutate, { loading } ] = useMutation();
  let members = account.members || [];

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: email => <span>{email}</span>,
    },

    // {
    //   title: "",
    //   dataIndex: "email",
    //   key: "delete",
    //   width: 20,
    //   className: delete_bucket,
    //   render: email => {
    //     return (
    //       <i
    //         className="fal fa-trash-alt"
    //         onClick={() => {
    //           if (
    //             window.confirm(
    //               `Are you sure you want to delete the team invitation for ${email}`
    //             )
    //           ) {
    //             /* Do nothing */
    //           } else {
    //             return;
    //           }

    //           let variables = { email: email };
    //           mutate({
    //             variables,
    //             update: (proxy, { data: { accountInvite } }) => {
    //               let data = proxy.readQuery({
    //                 query: accountInvitationsGet
    //               });
    //               data.accountInvitationsGet = accountInvite;
    //             }
    //           });
    //         }}
    //       />
    //     )
    //   }
    // }
  ];

  if (members.length <= 1) {
    return (
      <div
        style={{
          padding: "10px",
          color: "var(--color-orange)",
        }}
      >
        You are currently the only member of this team.
      </div>
    );
  }

  return (
    <Table
      dataSource={members}
      columns={columns}
      // loading={loading.toString()}
      disableHead={true}
      pagination={false}
    />
  );
}

export function ExternalInvitations({ userInvitations }) {
  const [loadReject, setLoadReject] = useState(false);
  const [loadAccept, setLoadAccept] = useState(false);

  const [mutate] = useMutation(userInvitationResponse);

  return (
    <div style={{ marginBottom: "20px", fontSize: "14px" }}>
      <div className={external_invitation_head}>
        <div style={{ fontSize: "16px", marginBottom: "10px" }}>
          You have been invited to a team!
        </div>

        <div style={{ color: "var(--color-primary)" }}>
          By accepting the invitation below you will abandon your current team.
        </div>
      </div>

      <div className={external_invitations}>
        {userInvitations.map((invitation, i) => {
          let {
            given_name,
            family_name,
            company,
            email,
          } = invitation.createdByUser;

          return (
            <div
              className={external_invitation_each}
              key={`invitation-${invitation.email}`}
            >
              <div className={external_invitation_company}>{company}</div>

              <div className={external_invitation_name}>
                {`${given_name} ${family_name}`}
              </div>

              <div className={external_invitation_email}>{email}</div>

              <div className={external_invitation_buttons}>
                <Button
                  size="small"
                  buttonStyle="secondary"
                  loading={loadAccept}
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to leave your current team?"
                      )
                    ) {
                      /* Do nothing */
                    } else {
                      return;
                    }

                    let variables = {
                      accountId: invitation.accountId,
                      response: "ACCEPT",
                    };

                    try {
                      setLoadAccept(true);
                      await mutate({ variables });
                      window.location.reload();
                    } catch (error) {
                      console.log("error", error);
                    }
                    setLoadAccept(false);
                  }}
                >
                  accept
                </Button>

                <Button
                  size="small"
                  loading={loadReject}
                  onClick={async () => {
                    let variables = {
                      accountId: invitation.accountId,
                      response: "REJECT",
                    };
                    try {
                      setLoadReject(true);
                      await mutate({
                        variables,
                        updateQueries: {
                          userInvitationsGet: (
                            prev,
                            { mutationResult, queryVariables }
                          ) => {
                            return {
                              userInvitationsGet: prev.userInvitationsGet.filter(
                                ui => ui.accountId !== invitation.accountId
                              ),
                            };
                          },
                        },
                      });
                    } catch (error) {
                      console.log("error", error);
                    }
                    setLoadReject(false);
                  }}
                >
                  reject
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Team() {
  const userQuery = useQuery(userGet);
  let user = (userQuery.data || {}).userGet || {};

  const accountQuery = useQuery(accountGet);
  let account = (accountQuery.data || {}).accountGet || {};

  const accountInvitationsQuery = useQuery(accountInvitationsGet);
  let accountInvitations =
    (accountInvitationsQuery.data || {}).accountInvitationsGet || [];

  const userInvitationsQuery = useQuery(userInvitationsGet);
  let userInvitations =
    (userInvitationsQuery.data || {}).userInvitationsGet || [];

  const loading =
    userQuery.loading ||
    accountQuery.loading ||
    accountInvitationsQuery.loading ||
    userInvitationsQuery.loading;

  if (loading) return <GhostLoader />;

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Your team",
            link: team,
          },
        ]}
      />

      <Content maxWidth={600}>
        <div style={{ marginBottom: "40px" }}>
          <h1>Your team</h1>
        </div>

        {!!userInvitations.length && (
          <Card>
            <ExternalInvitations userInvitations={userInvitations} />
          </Card>
        )}

        {!userInvitations.length && (
          <>
            <Card style={{ paddingTop: "5px" }} label="Team members">
              <TeamMembers user={user} account={account} />
            </Card>

            {!!accountInvitations.length && (
              <Card style={{ paddingTop: "5px" }} label="Pending invitations">
                <PendingInvitations accountInvitations={accountInvitations} />
              </Card>
            )}

            <Invite
              user={user}
              account={account}
              accountInvitations={accountInvitations}
            />
          </>
        )}
      </Content>
    </>
  );
}
