import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Startups } from "private/Apollo/Queries/groupsGet";
import { connectionsGet, groupsGet, userGet } from "private/Apollo/Queries";
import { connectionCreate } from "private/Apollo/Mutations";

import { dashboard, group, settings, charts, signOut } from "definitions.js";
import CreateStartupModal from "Components/CreateStartupModal/CreateStartupModal";
import Groups, { GroupsData } from "private/pages/Groups/Groups";
import { Connection } from "private/pages/Dashboard/Connections/types";
import styles from "./SideBarTreeMenu.module.css";

const classnames = require("classnames");

type MenuItem = {
  key: string;
  label: string;
  link: string;
  root?: boolean;
  icon?: string;
  nodes?: MenuItem[];
  showHashTag?: boolean;
  selected?: boolean;
  action?: () => void;
  showRightMenu?: boolean;
};

function NodeItems({
  node,
  level,
  expandedState,
  selectedNodes,
  changeExpanded,
  setVisibleMobile,
}: {
  node: MenuItem;
  level: number;
  expandedState: Set<string>;
  selectedNodes: Set<string>;
  changeExpanded: Function;
  setVisibleMobile: Function;
}): JSX.Element {
  const collapsed = !expandedState.has(node.key);
  const hasSelectedChildItem = itemOrItemNodesSelected(node);
  if (node.nodes?.length) {
    return (
      <>
        <li className={classnames(node.root && styles.root_node)}>
          <Item
            key={node.key}
            node={node}
            level={level++}
            expandable={true}
            collapsed={collapsed}
            hasSelectedChildItem={hasSelectedChildItem}
            expandedState={expandedState}
            selectedNodes={selectedNodes}
            changeExpanded={changeExpanded}
            setVisibleMobile={setVisibleMobile}
          />
          <ul className={classnames(collapsed && styles.collapsed)}>
            {node.nodes.map((item, i) => (
              <NodeItems
                node={item}
                key={`${node.key}-${i}`}
                level={level}
                expandedState={expandedState}
                selectedNodes={selectedNodes}
                changeExpanded={changeExpanded}
                setVisibleMobile={setVisibleMobile}
              />
            ))}
          </ul>
        </li>

        {collapsed &&
          node.nodes
            .filter(item => itemOrItemNodesSelected(item))
            .map((item, i) => (
              <li key={`not-collapsed-${i}`}>
                <ul>
                  <NodeItems
                    node={item}
                    key={`${node.key}-${i}`}
                    level={level}
                    expandedState={expandedState}
                    selectedNodes={selectedNodes}
                    changeExpanded={changeExpanded}
                    setVisibleMobile={setVisibleMobile}
                  />
                </ul>
              </li>
            ))}
      </>
    );
  }
  return (
    <li className={classnames(node.root && styles.root_node)}>
      <Item
        key={node.key}
        node={node}
        expandable={false}
        hasSelectedChildItem={hasSelectedChildItem}
        collapsed={collapsed}
        level={level++}
        expandedState={expandedState}
        selectedNodes={selectedNodes}
        changeExpanded={changeExpanded}
        setVisibleMobile={setVisibleMobile}
      />
    </li>
  );
}

function itemOrItemNodesSelected(item: MenuItem): boolean {
  return item.selected || item.nodes?.some(i => i.selected) || false;
}

function Item({
  node,
  level,
  expandable,
  collapsed,
  hasSelectedChildItem,
  expandedState,
  selectedNodes,
  changeExpanded,
  setVisibleMobile,
}: {
  node: MenuItem;
  level: number;
  expandable: boolean;
  collapsed: boolean;
  hasSelectedChildItem: boolean;
  expandedState: Set<string>;
  selectedNodes: Set<string>;
  changeExpanded: Function;
  setVisibleMobile: Function;
}): JSX.Element {
  return (
    <div
      className={`${styles.item} ${
        (node.root || (collapsed && hasSelectedChildItem)) && styles.root_item
      } ${
        (node.selected || selectedNodes.has(node.link)) && styles.selected_item
      }`}
    >
      {expandable && (
        <i
          onClick={e => {
            e.stopPropagation();
            changeExpanded(node.key);
          }}
          className={`${
            !expandedState.has(node.key) ? styles.caret : styles.caret_down
          } fas fa-caret-right`}
        />
      )}
      {node.showHashTag && <span className={styles.hash_tag}>#</span>}
      {node.link ? (
        <span onClick={() => setVisibleMobile(false)}>
          <Link
            to={{
              pathname: node.link,
              state: { rightMenu: node.showRightMenu },
            }}
            className={styles.link}
            style={{ maxWidth: `${203 - 27 * level}px` }}
          >
            {node.label}
          </Link>
        </span>
      ) : (
        <span
          className={styles.link}
          style={{
            maxWidth: `${203 - 27 * level}px`,
            opacity: 0.5,
          }}
        >
          {node.label}
        </span>
      )}
      {node.icon && (
        <i
          onClick={node.action}
          className={classnames(styles.node_item_icon, node.icon)}
        />
      )}
    </div>
  );
}

const SideBarTreeMenu = ({ location, history }: any) => {
  const menuItems: MenuItem[] = [
    {
      key: "startups",
      label: "MY STARTUPS",
      link: dashboard,
      root: true,
      icon: "fal fa-plus",
      action: () => setShowNewStartupModal(true),
    },
    {
      key: "groups",
      label: "GROUPS",
      link: group,
      root: true,
      icon: "fal fa-plus",
      action: () => setShowNewGroupModal({ state: true }),
      nodes: [],
    },
    {
      key: "settings",
      label: "Settings",
      link: settings,
      root: true,
    },
    {
      key: "charts",
      label: "Charts",
      link: charts,
      root: true,
    },
    {
      key: "log-out",
      label: "Log out",
      link: signOut,
      root: true,
    },
  ];

  const [visibleMobile, setVisibleMobile] = useState(false);
  const [expandedState, setExpandedState] = useState(new Set<string>());
  const [selectedNodes, setSelectedNodes] = useState(new Set<string>());
  const [showNewStartupModal, setShowNewStartupModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState({ state: false });
  const [loadingState, setLoadingState] = useState<string>();

  const groupsQuery = useQuery<GroupsData>(groupsGet, {
    fetchPolicy: "cache-first",
  });
  const connectionsQuery = useQuery(connectionsGet, {
    fetchPolicy: "cache-first",
  });
  const userQuery = useQuery(userGet, { fetchPolicy: "cache-first" });
  const connections = connectionsQuery.data?.connectionsGet || [];
  const user = userQuery.data?.userGet;

  const [connectionCreateMutate] = useMutation(connectionCreate);

  function changeExpanded(key: string): void {
    const node = expandedState.has(key);
    node ? expandedState.delete(key) : expandedState.add(key);
    setExpandedState(new Set(expandedState));
  }

  function changeSelected(link: string): void {
    selectedNodes.clear();
    selectedNodes.add(link);
    setSelectedNodes(new Set(selectedNodes));
  }

  const menuRef = useRef(null);

  const clickListener = useCallback((e: MouseEvent) => {
    if (!(menuRef.current! as any).contains(e.target)) setVisibleMobile(false);
  }, []);
  const touchListener = useCallback((e: TouchEvent) => {
    if (!(menuRef.current! as any).contains(e.target)) setVisibleMobile(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", clickListener);
    document.addEventListener("touchstart", touchListener);
    return () => {
      document.removeEventListener("mousedown", clickListener);
      document.removeEventListener("touchstart", touchListener);
    };
  }, [clickListener, touchListener]);

  useEffect(() => {
    changeSelected(location.pathname);
  }, [location, menuRef]);

  if (groupsQuery.data?.groupsGet.length) {
    const index = menuItems.findIndex(item => item.key === "groups");
    groupsQuery.data.groupsGet
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(group => {
        const isAdmin = group.members.some(
          ({ email, role }) => email === user.email && role === "admin"
        );

        const startups = new Map<string, Startups[]>();

        group.startups.forEach(s => {
          startups.get(s.creativeId)
            ? startups.set(s.creativeId, [
                ...(startups.get(s.creativeId) || []),
                s,
              ])
            : startups.set(s.creativeId, [s]);
        });

        menuItems[index].nodes?.push({
          key: group.id,
          label: group.name,
          link: `/dashboard/group/${group.id}`,
          icon: isAdmin ? "fal fa-cog" : "",
          selected:
            selectedNodes.has(`/dashboard/group/${group.id}`) ||
            selectedNodes.has(`/dashboard/group/${group.id}/settings`),
          action: () =>
            isAdmin && history.push(`/dashboard/group/${group.id}/settings`),
          showRightMenu: true,
          nodes: [...startups]
            .sort((a, b) =>
              a[1][0].connection?.creative?.name.localeCompare(
                b[1][0].connection?.creative?.name
              )
            )
            .map(([creativeId, value]) => {
              const haveAddedStartup = connections.find(
                (c: Connection) => c.creativeId === creativeId
              );
              return {
                key: creativeId,
                link:
                  haveAddedStartup &&
                  `/dashboard/startup_page/${haveAddedStartup.id}?group=${group.id}`,
                label: value[0].connection?.creative?.name,
                nodes: [],
                // selected: haveAddedStartup && (selectedNodes.has(`/dashboard/startup_page/${haveAddedStartup.id}?group=${group.id}`) || selectedNodes.has(`/dashboard/startup_page/${haveAddedStartup.id}`)),
                selected:
                  haveAddedStartup &&
                  selectedNodes.has(
                    `/dashboard/startup_page/${haveAddedStartup.id}?group=${group.id}`
                  ),
                showHashTag: true,
                icon:
                  !haveAddedStartup && loadingState !== creativeId
                    ? "fal fa-cloud-download"
                    : loadingState === creativeId
                    ? "fa fa-spinner fa-spin"
                    : "",
                showRightMenu: true,
                action: () => !haveAddedStartup && addStartup(creativeId),
              } as MenuItem;
            }),
        });
      });
  }

  async function addStartup(creativeId: string) {
    setLoadingState(creativeId);
    try {
      await connectionCreateMutate({
        variables: {
          creativeId: creativeId,
        },
        update: (proxy, { data: { connectionCreate } }) => {
          const data: any = proxy.readQuery({
            query: connectionsGet,
          });
          proxy.writeQuery({
            query: connectionsGet,
            data: {
              connectionsGet: [...data.connectionsGet, connectionCreate],
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(undefined);
    }
  }

  return (
    <>
      <div
        ref={menuRef}
        className={classnames(
          styles.sidebar_container,
          visibleMobile
            ? styles.open_mobile_container
            : styles.closed_mobile_container
        )}
      >
        <div className={styles.menu_container}>
          <ul>
            {menuItems.map((item, i) => (
              <NodeItems
                node={item}
                key={`root-${i}`}
                level={0}
                expandedState={expandedState}
                selectedNodes={selectedNodes}
                changeExpanded={changeExpanded}
                setVisibleMobile={setVisibleMobile}
              />
            ))}
          </ul>
        </div>
      </div>
      <div
        className={classnames(styles.icons, "mobile_only")}
        onClick={() => setVisibleMobile(!visibleMobile)}
      >
        <i className="fas fa-bars" />
      </div>

      <CreateStartupModal
        history={history}
        open={showNewStartupModal}
        close={() => setShowNewStartupModal(false)}
      />

      <Groups
        history={history}
        showModalOnly={true}
        showModalState={showNewGroupModal}
        onCloseModalEvent={() => setShowNewGroupModal({ state: false })}
      />
    </>
  );
};

export default SideBarTreeMenu;
