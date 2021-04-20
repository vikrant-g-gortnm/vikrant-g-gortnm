import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";

// COMPONENTS
import Filters from "../Filters";
import SelectTagsForStartup from "./SelectTagsForStartup";
// import SetSubjectiveScore from "./SetSubjectiveScore";

// import CreateNewStartup from "./CreateStartup";

// FUNCTIONS
import applyFilters from "./applyFilters";

// Definitions
import defaultFilters from "./defaultFilters";

// Components
import { Table, Card, GhostLoader } from "Components/elements";
import Paginator from "./Paginator";

import tableColumns from "./TableColumns";

function ListOfStartups({ filters, currentPage, history }) {
  //
  // console.log('filters', filters)
  //
  // let ff = {
  //   "search": "dsa",
  //   "tags": [
  //     "9e3aff58-7e87-549e-05b8-e148e9fb8c40",
  //     "dde5df4f-942e-516c-da58-0ead98219e4c",
  //   ],
  //   "funnelTags": [
  //     "87f27663-b13a-edbd-dbef-87ec1b97caf5"
  //   ],
  //   "fromDate":
  //   "toDate":
  //   "dateRange": [
  //     "2021-03-09T23:00:00.000Z", // UNIX please
  //     "2021-03-24T22:59:59.999Z"
  //   ]
  // }

  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();

  // Queries
  const { data, called, loading, error, fetchMore } = useQuery(connectionsGet, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      LastEvaluatedId: undefined,
    },
  });

  // Fetch more
  useEffect(() => {
    let LastEvaluatedId = currentPage && currentPage.LastEvaluatedId;
    let variables = { LastEvaluatedId };
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  }, [currentPage]);

  // Define data
  const connections = data?.connectionsGet || [];

  // Filter data
  const filteredConnections = applyFilters({ connections, filters });

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  const columns = tableColumns({
    history,
    setStarMutation,
    setShowTagGroupForId,
    setShowSubjectiveScoreForId,
  });

  return (
    <Card maxWidth={1200} noMargin={true}>
      <Table
        dataSource={filteredConnections}
        columns={columns}
        disableHead={false}
        pagination={false}
        allowSorting={true}
        loading={loading}
        emptyLabel={"No results."}
      />

      {showTagGroupForId && (
        <SelectTagsForStartup
          connection={connections.find(({ id }) => id === showTagGroupForId)}
          close={() => setShowTagGroupForId(undefined)}
        />
      )}

      {/*{showSubjectiveScoreForId && (*/}
      {/*  <SetSubjectiveScore*/}
      {/*    connection={connections.find(*/}
      {/*      ({ id }) => id === showSubjectiveScoreForId*/}
      {/*    )}*/}
      {/*    history={history}*/}
      {/*    close={() => {*/}
      {/*      setShowSubjectiveScoreForId(undefined);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
    </Card>
  );
}

export default function Connections({ history }) {
  // States
  const [filters, setFilterState] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(undefined);

  // Load filters from local store
  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters"));
    } catch (error) {}
    if (f) setFilterState(f);
  }, []);

  // Setting filters: save to local store
  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  return (
    <>
      <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <Filters setFilters={setFilters} filters={filters} fullFilter={true} />

      <ListOfStartups
        history={history}
        filters={filters}
        currentPage={currentPage}
      />
    </>
  );
}
