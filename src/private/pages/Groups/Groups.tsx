import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  groupsGet,
  userGet,
  // groupGetListOfStartups,
  GroupsType,
  UserType as User,
} from "private/Apollo/Queries";
import { groupPut } from "private/Apollo/Mutations";

import CreateNewGroup from "./CreateGroup";
import { group } from "definitions.js";

import {
  Content,
  Card,
  Table,
  Button,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";
import groupsColumns from "./TableColumns/Groups";

interface UserData {
  userGet: User;
}

export interface GroupsData {
  groupsGet: GroupsType[];
}

export default function Groups({
  history,
  showModalOnly,
  showModalState,
  onCloseModalEvent,
}: {
  history: any;
  showModalOnly?: boolean;
  showModalState?: { state: boolean };
  onCloseModalEvent: () => void;
}) {
  const [showModal, setShowModal] = useState(showModalState?.state);

  const [mutate, { loading: groupPutLoading }] = useMutation(groupPut);
  const { data, loading, error } = useQuery<GroupsData>(groupsGet);
  const userQuery = useQuery<UserData>(userGet);

  useEffect(() => {
    setShowModal(showModalState?.state);
  }, [showModalState]);

  let user = userQuery.data?.userGet;

  if (error) throw error;

  if (!data && loading && !showModalOnly) return <GhostLoader />;

  let groups = data?.groupsGet;

  const columns = groupsColumns({
    history,
    mutate,
    user,
    groups,
    groupPutLoading,
  });

  return (
    <>
      {!showModalOnly && (
        <>
          <BreadCrumbs
            list={[
              {
                val: "All Groups",
                link: group,
              },
            ]}
          />

          <Content maxWidth={780}>
            <h1>Groups</h1>
            {!!groups?.length && (
              <Card noMargin={true}>
                <Table
                  dataSource={groups}
                  columns={columns}
                  loading={loading}
                  disableHead={true}
                  cell_content={""}
                  noMargin={false}
                />
              </Card>
            )}

            {!groups?.length && (
              <Card style={{ paddingBottom: "20px" }}>
                <div style={{ fontSize: "18px" }}>
                  You don't have any groups yet
                </div>
                <div
                  style={{
                    padding: "20px 0px",
                    color: "var(--color-gray-medium)",
                  }}
                >
                  This is your sharing space. When other ivestors share startups
                  with you they will appear here. You can also create a group to
                  share your startups with other investors in your network. You
                  will be able to choose what data you want to share.
                </div>
              </Card>
            )}

            <Button
              onClick={() => setShowModal(true)}
              type="right_arrow"
              size="large"
            >
              Create New Group
            </Button>
          </Content>
        </>
      )}
      {showModal && (
        <Modal
          title="New Group"
          close={() => setShowModal(false)}
          disableFoot={true}
          loading={false}
          showScrollBar={false}
        >
          <CreateNewGroup
            mutate={mutate}
            setDone={(id: any) => {
              let path = `${group}/${id}`;
              history.push(path);
              showModalOnly && onCloseModalEvent();
            }}
          />
        </Modal>
      )}
    </>
  );
}
