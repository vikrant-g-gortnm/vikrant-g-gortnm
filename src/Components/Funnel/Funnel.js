import React from "react";

// API Stuff
import { useMutation, useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";
import { connectionFunnelTagAdd } from "private/Apollo/Mutations";

// Helpers
import { cloneDeep } from "lodash";
import classnames from "classnames";

// Styles
import {
  funnel_tag,
  funnel_tag_active,
  funnel_tag_container,
} from "./Funnel.module.css";

// -----------------
// END IMPORT REGION
// -----------------

// ********************
// * HELPER FUNCTIONS *
// ********************

// Get optimistic response
function getOptimisticResponse({ funnelGroups, connection, funnelTag }) {
  let funnelGroup = funnelGroups.find(
    ({ id }) => id === funnelTag.funnelGroupId
  );

  let allFunnelTags = cloneDeep(funnelGroup.funnelTags);

  let tags = [];

  if (
    connection.funnelTags.length === 1 &&
    connection.funnelTags[0].id === funnelTag.id
  ) {
    tags = [];
  } else {
    tags = allFunnelTags.filter(({ index }) => (index || 0) <= funnelTag.index);
  }

  const optimisticResponse = {
    __typename: "Mutation",
    connectionFunnelTagAdd: {
      ...connection,
      funnelTags: tags,
    },
  };
  return optimisticResponse;
}

// ********************

// Main component
export function Funnel({ connection }) {
  // Query
  const { data } = useQuery(funnelGroupGet);

  // Mutation
  const [mutate] = useMutation(connectionFunnelTagAdd);

  // Define data
  const funnelGroups = data?.accountGet?.funnelGroups || [];

  // Action function
  async function addFunnelTag({ funnelTag }) {
    const optimisticResponse = getOptimisticResponse({
      funnelGroups,
      connection,
      funnelTag,
    });

    const variables = {
      connectionId: connection.id,
      funnelTagId: funnelTag.id,
    };

    mutate({
      variables,
      optimisticResponse,
    });
  }

  // Display all funnel groups
  return funnelGroups.map(funnelGroup => {
    // Get all funnel tags in funnel group
    let funnelTags = cloneDeep(funnelGroup.funnelTags).sort(
      (a, b) => a.index - b.index
    );

    // Display all funnel tags
    return (
      <div
        className={funnel_tag_container}
        key={`funnelGroup-${funnelGroup.id}`}
      >
        {funnelTags.map((funnelTag, i) => (
          <div
            key={funnelTag.id}
            className={classnames(
              funnel_tag,
              connection.funnelTags.some(({ id }) => id === funnelTag.id) &&
                funnel_tag_active
            )}
            style={{ width: `${100 - i * 10}%` }}
            onClick={() => {
              addFunnelTag({ funnelTag });
            }}
          >
            {funnelTag.name}
          </div>
        ))}
      </div>
    );
  });
}
