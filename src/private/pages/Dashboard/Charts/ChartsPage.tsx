import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";

import { useQuery } from "@apollo/client";
import { connectionsGet, tagGroupsGet } from "private/Apollo/Queries";

import Filters from "../Filters";

import { Content, Table, Card, GhostLoader } from "Components/elements";
import { History } from "history";

import styles from "../Connections/Connections.module.css";

import tableColumns from "./TableColumns/TableColumns";
import ChartArea from "./ChartArea";
import applyFilters from "../Connections/applyFilters";

function Connections({
  history,
  chartFilters,
}: {
  history: History;
  chartFilters: { tags: any[] };
}) {
  const [filters, setFilterState] = useState({
    tags: [],
    funnelTags: [],
    search: "",
    starred: false,
    dateRange: [null, null],
  });

  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters") || "");
      setFilterState(f);
    } catch (error) {}
  }, []);

  function setFilters(filterData: any) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  const { data, loading, error } = useQuery(connectionsGet);

  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups =
    (tagGroupsQuery.data && tagGroupsQuery.data.tagGroupsGet) || [];

  const groupsTags = useMemo(
    () =>
      tagGroups.reduce(
        (groupsMap: Map<any, any>, props: any) =>
          groupsMap.set(
            props.id,
            props.tags.reduce(
              (map: Map<any, any>, props: any) =>
                map.set(props.id, {
                  id: props.id,
                  name: props.name,
                  value: 0,
                  selected: chartFilters.tags.some(({ id }) => id === props.id),
                }),
              new Map()
            )
          ),
        new Map()
      ),
    [tagGroups, chartFilters]
  );

  if (error || tagGroupsQuery.error) {
    throw error || tagGroupsQuery.error;
  }

  if (!data && loading) return <GhostLoader />;
  if (!tagGroupsQuery.data && tagGroupsQuery.loading) return <GhostLoader />;

  let connections = data.connectionsGet;
  let connectionsGeneral: any[] = [];

  if (connections.length <= 1) {
    return (
      <div className="m2">
        You don't have enough startups available to you, once you'll have 2 or
        more you will be able to see charts on this page.
      </div>
    );
  }
  if (connections.length >= 10) {
    connectionsGeneral = applyFilters({ connections, filters });
    // Apply filters from charts, affecting selection in table but not in charts themselves
    connections = applyFilters({
      connections: connectionsGeneral,
      filters: chartFilters,
    });
  } else {
    connectionsGeneral.concat(connections);
  }

  const columns = tableColumns({ history });

  let hasFilters =
    filters.tags.length ||
    filters.funnelTags.length ||
    filters.search ||
    filters.starred ||
    (filters.dateRange.length &&
      (filters.dateRange[0] || filters.dateRange[1]));

  return (
    <Content maxWidth={1200}>
      {/*{data.connectionsGet.length >= 10 && (*/}
      {/*  <Filters*/}
      {/*    connections={}*/}
      {/*    setFilters={setFilters}*/}
      {/*    filters={filters}*/}
      {/*    tagGroups={tagGroups}*/}
      {/*    fullFilter={false}*/}
      {/*  />*/}
      {/*)}*/}
      <Card maxWidth={1200} style={{ paddingBottom: "20px" }}>
        <ChartArea
          connections={connectionsGeneral}
          groupsTags={groupsTags}
          tagGroups={tagGroups}
        />
      </Card>

      <div className={styles.small_text_flex}>
        {(hasFilters && (
          <div
            className={styles.clear_filters}
            onClick={() => {
              setFilters({
                search: "",
                tags: [],
                funnelTags: [],
                dateRange: [null, null],
              });
            }}
          >
            clear all filters
          </div>
        )) || <div />}

        <div className={styles.counter}>
          Showing {connections.length} results
        </div>
      </div>

      <Card maxWidth={1200} noMargin={true} style={{ paddingBottom: "20px" }}>
        <Table
          dataSource={connections || []}
          columns={columns}
          disableHead={false}
          pagination={false}
          allowSorting={true}
          loading={loading}
          emptyLabel="No results."
        />
      </Card>
    </Content>
  );
}

const mapStateToProps = (state: any) => ({
  chartFilters: state.connections.chartFilters,
});

export default connect(mapStateToProps)(Connections);
