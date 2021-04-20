import React, { useEffect } from "react";

//API
import { funnelGroupGet } from "private/Apollo/Queries";
import { useLazyQuery } from "@apollo/client";

//Components
import { Content, GhostLoader, BreadCrumbs } from "Components/elements";
import CreateFunnelGroup from "./CreateFunnelGroup/index";
import FunnelGroup from "./FunnelGroup/index";

import { settings, funnels } from "definitions.js";

//Main function
export default function Funnel() {
  // QUERIES
  const [
    getFunnels,
    {
      data: funnelGroupGetData,
      loading: funnelGroupGetLoading,
      error: funnelGroupGetError,
      called: funnelGroupGetCalled,
    },
  ] = useLazyQuery(funnelGroupGet);

  useEffect(() => {
    getFunnels();
  }, []);

  if (funnelGroupGetError) {
    throw funnelGroupGetError;
  }

  const loadingData = funnels
    ? !funnelGroupGetCalled || (!funnelGroupGetData && funnelGroupGetLoading)
    : [];

  const data = funnels ? funnelGroupGetData?.accountGet.funnelGroups : [];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Funnels",
            link: funnels,
          },
        ]}
      />

      <Content maxWidth={600}>
        <h1>Funnels</h1>

        {!loadingData &&
          [...data].map((props, index) => (
            <FunnelGroup {...props} key={props.id} index={index} />
          ))}
        {!loadingData ? (
          <CreateFunnelGroup index={data.length} />
        ) : (
          <GhostLoader />
        )}
      </Content>
    </>
  );
}
