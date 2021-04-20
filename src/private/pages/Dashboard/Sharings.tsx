import React, { useState } from "react";
import moment from "moment";
import { History } from "history";
import { Link } from "react-router-dom";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  userGet,
  groupsGet,
  creativesGet,
  creativeTemplateGet,
  connectionsGet,
  presentationsGet,
} from "private/Apollo/Queries";

import {
  groupMarkAsSeen,
  creativeDelete,
  presentationPut,
  connectionCreate,
} from "private/Apollo/Mutations";

import { group as group_route, public_presentation } from "definitions.js";

import { Card, Modal } from "Components/elements";

import styles from "./Sharings.module.css";
import {
  Connection,
  Creative,
} from "private/pages/Dashboard/Connections/types";
import { Groups } from "private/Apollo/Queries/groupsGet";
import { ViewSummary } from "./ViewSummary";

enum InboxType {
  GROUP = "GROUP",
  SHARING = "SHARING",
  EXTERNAL_FORM = "EXTERNAL_FORM",
}

type Inbox = {
  timeStamp: string | Date;
  type: InboxType;
  data: InboxData;
  actionState?: "SAVE" | "DELETE" | "DETAILS";
};

type InboxData = {
  name: string;
  groupId: string;
  sharedBy?: string;
  connection?: any;
  id?: string;
  creative?: Creative;
};

function getUnbindedCreatives(
  connections: Connection[],
  creatives: Creative[]
): Creative[] {

  const existCreativeIds = new Set(
    connections.map(({ creativeId }) => creativeId)
  );
  return creatives
    .filter(creative => !existCreativeIds.has(creative.id))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export default function Sharings({ history }: { history: History }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  const [loadingMark, setLoadingMark] = useState<{ [key: string]: boolean }>({
    ALL: false,
  });

  // QUERIES
  const userGetQuery = useQuery(userGet);
  const groupsGetQuery = useQuery(groupsGet);
  const creativesGetQuery = useQuery(creativesGet);
  const connectionsGetQuery = useQuery(connectionsGet);
  const creativeTemplateQuery = useQuery(creativeTemplateGet);
  const presentationsQuery = useQuery(presentationsGet);

  // MUTATIONS
  const [creativeDeleteQuery, { loading: creativeDeleteLoading }] = useMutation(
    creativeDelete
  );
  const [
    mutateConnectionCreate,
    { loading: connectionCreateLoading },
  ] = useMutation(connectionCreate);

  const [markAsSeen] = useMutation(groupMarkAsSeen, {
    refetchQueries: [{ query: groupsGet }],
    awaitRefetchQueries: true,
  });

  const [markSharingAsSeen] = useMutation(presentationPut, {
    refetchQueries: [{ query: presentationsGet }],
    awaitRefetchQueries: true,
  });

  // DEFINITIONS
  const isLoading =
    userGetQuery.loading ||
    groupsGetQuery.loading ||
    creativesGetQuery.loading ||
    connectionsGetQuery.loading ||
    presentationsQuery.loading;

  const hasError =
    userGetQuery.error ||
    groupsGetQuery.error ||
    creativesGetQuery.error ||
    connectionsGetQuery.error ||
    presentationsQuery.error;

  const missingData =
    !userGetQuery.data ||
    !groupsGetQuery.data ||
    !creativesGetQuery.data ||
    !connectionsGetQuery.data ||
    !presentationsQuery.data;

  if (isLoading) return <span />;

  async function processCreative() {
    try {
      if (selectedInbox?.actionState === "DELETE") {
        await creativeDeleteQuery({
          variables: {
            id: selectedInbox?.data.creative?.id,
          },
          update: (proxy, { data: { creativeDelete } }) => {
            let data: any = proxy.readQuery({
              query: creativesGet,
            });
            proxy.writeQuery({
              query: creativesGet,
              data: {
                creativesGet: [
                  ...data.creativesGet.filter(
                    (creative: Creative) =>
                      creative.id !== selectedInbox.data.creative?.id
                  ),
                ],
              },
            });
          },
        });
      } else if (selectedInbox?.actionState === "SAVE") {
        await mutateConnectionCreate({
          variables: { creativeId: selectedInbox.data.creative?.id },
          update: (proxy, { data: { connectionCreate } }) => {
            let data: any = proxy.readQuery({
              query: connectionsGet,
            });
            proxy.writeQuery({
              query: connectionsGet,
              data: {
                connectionsGet: [connectionCreate, ...data.connectionsGet],
              },
            });
          },
        });
      }
      setSelectedInbox(null);
    } catch (error) {
      console.log("error", error);
    }
  }

  // ================

  // Loading state
  if (isLoading && missingData) return <span />;
  // Error
  if (hasError) return <span />;
  // No data
  if (missingData) return <span />;

  // Definitions
  let creativeTemplate = creativeTemplateQuery.data?.creativeTemplateGet || {};
  let user = userGetQuery.data.userGet;
  let groups: Groups[] = groupsGetQuery.data.groupsGet;
  let creatives = creativesGetQuery.data.creativesGet || [];
  let connections = connectionsGetQuery.data.connectionsGet || [];
  let presentations = presentationsQuery.data.presentationsGet || [];

  // Item to be populated
  let inboxData: Inbox[] = [];

  // Populate list with group invitations
  for (let group of groups) {
    let { members } = group;

    let isAdmin = group.members.some(
      ({ email, role }) => email === user.email && role === "admin"
    );

    let member = members.find(({ email }) => email === user.email) || {
      latestActivity: null,
    };

    let { latestActivity } = member;

    if (!latestActivity && !isAdmin) {
      inboxData.push({
        timeStamp: group.createdAt,
        type: InboxType.GROUP,
        data: {
          groupId: group.id,
          name: group.name,
        },
      });
    }
  }

  // Populate list with web form items
  for (let creative of getUnbindedCreatives(connections, creatives)) {
    inboxData.push({
      timeStamp: moment(creative.createdAt, "x").format(),
      type: InboxType.EXTERNAL_FORM,
      data: {
        name: creative.name || "New Company",
        groupId: "",
        creative: creative,
      },
    });
  }

  for (let presentation of presentations) {
    if (!presentation.seen) {
      inboxData.push({
        timeStamp: moment(presentation.createdAt, "x").format(),
        type: InboxType.SHARING,
        data: {
          name: presentation?.creativeDetails?.name || "New Company",
          sharedBy: presentation?.sharedBy || "",
          groupId: "",
          id: presentation?.id,
          creative: {
            id: presentation?.creativeId,
            createdAt: new Date().getTime(),
            name: "",
            description: "",
            templateId: "",
            sharedByEmail: "",
            sharedWithEmail: "",
            submit: true,
            answers: [],
          },
        },
      });
    }
  }

  inboxData = inboxData.sort(
    (a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
  );

  let capListAt = 5;

  if (!inboxData.length) return <span />;
  return (
    <Card label="Inbox" maxWidth={1200} style={{ paddingBottom: "20px" }}>
      {inboxData
        .filter((a, i) => (expanded ? true : i < capListAt))
        .map(({ timeStamp, type, data }, i) => {
          return (
            <div key={i} className={styles.list_item}>
              {type === "GROUP" && (
                <div className={styles.group_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-users" />
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    You have been invited to join the group{" "}
                    <Link
                      className={styles.highlight_1}
                      to={{ pathname: `${group_route}/${data.groupId}` }}
                    >
                      {data.name}
                    </Link>
                  </div>

                  <div
                    className={styles.mark_as_seen}
                    onClick={async () => {
                      if (loadingMark[data.groupId]) return;
                      try {
                        setLoadingMark({ [data.groupId]: true });
                        await markAsSeen({
                          variables: { groupId: data.groupId },
                        });
                      } catch (error) {
                        console.error(error);
                      }
                      setLoadingMark({ [data.groupId]: false });
                    }}
                  >
                    mark as seen{" "}
                    {loadingMark[data.groupId] && (
                      <i className="fa fa-spinner fa-spin" />
                    )}
                  </div>
                </div>
              )}

              {type === "SHARING" && (
                <div className={styles.sharing_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-share-alt" />
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    <span className={styles.highlight_2}>{data.sharedBy}</span>
                    <span> shared </span>

                    <span className={styles.highlight_1}>
                      <a
                        href={`${public_presentation}/${data?.id}/${user?.email}`}
                        target={"_blank"}
                        rel="noopener noreferrer"
                      >
                        {data?.name}
                      </a>
                    </span>

                    <span> with you</span>
                  </div>

                  {!connections.find(({ creative }: { creative: Creative }) => {
                    return creative.id === data?.creative?.id;
                  }) && (
                    <div
                      className={styles.mark_as_seen}
                      style={{ paddingRight: "5px" }}
                      onClick={() => {
                        setSelectedInbox({
                          actionState: "SAVE",
                          timeStamp,
                          type,
                          data,
                        });
                      }}
                    >
                      save
                    </div>
                  )}

                  <div
                    className={styles.delete_creative}
                    style={{ marginLeft: "0px" }}
                    onClick={async () => {
                      if (loadingMark[`${data.id}`]) return;
                      setLoadingMark({ [`${data.id}`]: true });

                      let variables = {
                        id: data.id,
                        markAsSeen: new Date().getTime(),
                      };

                      try {
                        await markSharingAsSeen({ variables });
                      } catch (error) {
                        console.log("error", error);
                      }
                      setLoadingMark({ [`${data.id}`]: false });
                    }}
                  >
                    mark as seen{" "}
                    {loadingMark[`${data.id}`] && (
                      <i className="fa fa-spinner fa-spin" />
                    )}
                  </div>
                </div>
              )}

              {type === "EXTERNAL_FORM" && (
                <div className={styles.sharing_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-inbox" />
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    <span> A new startup has submitted your web form </span>

                    <span
                      onClick={() =>
                        setSelectedInbox({
                          actionState: "DETAILS",
                          timeStamp,
                          type,
                          data,
                        })
                      }
                      className={styles.highlight_1}
                    >
                      {data.name}
                    </span>
                  </div>
                  <div
                    className={styles.mark_as_seen}
                    onClick={() =>
                      setSelectedInbox({
                        actionState: "SAVE",
                        timeStamp,
                        type,
                        data,
                      })
                    }
                  >
                    save
                  </div>
                  <div
                    className={styles.delete_creative}
                    onClick={() =>
                      setSelectedInbox({
                        actionState: "DELETE",
                        timeStamp,
                        type,
                        data,
                      })
                    }
                  >
                    delete permanently
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {inboxData.length > capListAt && !expanded && (
        <div onClick={() => setExpanded(true)} className={styles.list_expander}>
          <span>View {inboxData.length - capListAt} more items...</span>
        </div>
      )}

      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          className={styles.list_expander}
        >
          <span>View less</span>
        </div>
      )}

      {selectedInbox && selectedInbox.actionState !== "DETAILS" && (
        <Modal
          title={
            selectedInbox.actionState === "SAVE"
              ? "Save Startup"
              : "Delete Permanently"
          }
          submit={() => processCreative()}
          close={() => setSelectedInbox(null)}
          loading={creativeDeleteLoading || connectionCreateLoading}
          disableFoot={false}
          key="actionModal"
          noKill
          showScrollBar={false}
        >
          <span>
            {selectedInbox.actionState === "SAVE"
              ? "Save "
              : "Do you really want to delete "}
          </span>
          <span className={styles.highlight_1}>{selectedInbox.data.name}</span>
          <span>?</span>
        </Modal>
      )}

      {selectedInbox && selectedInbox.actionState === "DETAILS" && (
        <Modal
          title={selectedInbox.data.name}
          close={() => setSelectedInbox(null)}
          disableFoot={false}
          key="actionModal"
          noKill
          loading={false}
          showScrollBar={true}
        >
          <ViewSummary
            creativeTemplate={creativeTemplate}
            answers={selectedInbox.data.creative?.answers}
          />
        </Modal>
      )}
    </Card>
  );
}
