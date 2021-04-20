import React from "react";

import {
  groupsGet,
  GroupsType as Groups,
  UserType as User,
} from "private/Apollo/Queries";
import { group } from "definitions.js";

import { History } from "history";
import tableStyles from "Components/elements/NotataComponents/Table.module.css";

export default ({
  history,
  mutate,
  user,
  groups,
  groupPutLoading,
}: {
  history: History;
  mutate: Function;
  user: User | undefined;
  groups: Groups[] | undefined;
  groupPutLoading: any;
}) => [
  {
    title: "",
    key: "delete",
    width: 50,
    className: "delete_bucket",
    render: (group: Groups) => {
      let isAdmin = group.members.some(
        ({ email, role }) => email === user?.email && role === "admin"
      );
      if (!isAdmin) return <span />;

      return (
        <div style={{ textAlign: "center" }}>
          {(groupPutLoading && <i className="fa fa-spinner fa-spin" />) || (
            <i
              className="fal fa-trash-alt"
              onClick={() => {
                let variables = {
                  id: group.id,
                  input: { deleteGroup: true },
                };
                mutate({
                  variables,
                  update: (proxy: any) => {
                    const data = proxy.readQuery({
                      query: groupsGet,
                    });
                    proxy.writeQuery({
                      query: groupsGet,
                      data: {
                        groupsGet: data.groupsGet.filter(
                          (g: any) => g.id !== group.id
                        ),
                      },
                    });
                  },
                });
              }}
            />
          )}
        </div>
      );
    },
  },
  {
    title: "Group name",
    dataIndex: "id",
    key: "name",
    render: (id: string) => {
      let gr = groups?.find(g => g.id === id);
      let { name, members, startups } = gr || {};

      let isAdmin = gr?.members.some(
        ({ email, role }) => email === user?.email && role === "admin"
      );

      let settings = gr?.settings;
      let startupLength = [
        ...new Set(startups?.map(({ creativeId }) => creativeId)),
      ].length;

      return (
        <div>
          <div
            onClick={() => {
              let path = `${group}/${id}`;
              history.push(path);
            }}
            className={tableStyles.background_clicker}
          />

          <div
            className={tableStyles.actual_content}
            style={{
              pointerEvents: "none",
            }}
          >
            {/*{(!latestActivity && (*/}
            {/*  <div*/}
            {/*    style={{*/}
            {/*      fontWeight: "var(--font-weight-bold)" as "bold",*/}
            {/*      color: "var(--color-secondary)"*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    {name}*/}
            {/*  </div>*/}
            {/*)) || <div>{name}</div>}*/}

            <div
              style={{
                fontWeight: "var(--font-weight-bold)" as "bold",
                color: "var(--color-secondary)",
              }}
            >
              {name}
            </div>

            <div
              style={{
                opacity: 0.5,
                fontSize: "12px",
              }}
            >
              {(isAdmin || settings?.showUsers) &&
                `${(members || []).length} members -`}
              {startupLength} startups
            </div>
          </div>
        </div>
      );
    },
  },
  // {
  //   title: "",
  //   dataIndex: "id",
  //   key: "id",
  //   width: 30,
  //   render: (id: string) => (
  //     <Button
  //       // type="tiny_right"
  //       type="right_arrow"
  //       size="small"
  //       onClick={() => {
  //         let path = `${group}/${id}`;
  //         history.push(path, {rightMenu: true});
  //       }}
  //     >
  //       View
  //     </Button>
  //   ),
  // },
];
