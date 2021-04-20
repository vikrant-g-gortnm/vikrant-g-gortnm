import React, { useEffect } from "react";

//API
import { useLazyQuery } from "@apollo/client";
import { tagGroupsGet } from "private/Apollo/Queries";

//Components
import { Content, GhostLoader, BreadCrumbs } from "Components/elements";
import CreateTagGroup from "./CreateTagGroup/index";
import TagGroup from "./TagGroups/index";

import { settings, tags } from "definitions.js";

//Main Function
export default function Tags() {
  // QUERIES
  const [
    getTags,
    {
      data: tagGroupsGetData,
      loading: tagGroupsGetLoading,
      error: tagGroupsGetError,
      called: tagGroupsGetCalled,
    },
  ] = useLazyQuery(tagGroupsGet);

  useEffect(() => {
    getTags();
  }, []);

  if (tagGroupsGetError) {
    throw tagGroupsGetError;
  }

  const loadingData = tags
    ? !tagGroupsGetCalled || (!tagGroupsGetData && tagGroupsGetLoading)
    : [];

  const data = tags ? tagGroupsGetData?.tagGroupsGet : [];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Tags",
            link: tags,
          },
        ]}
      />

      <Content maxWidth={600}>
        <h1>Tags</h1>

        {!loadingData &&
          [...data].map((props, index) => (
            <TagGroup {...props} key={props.id} index={index} />
          ))}
        {!loadingData ? (
          <CreateTagGroup index={data.length} />
        ) : (
          <GhostLoader />
        )}
      </Content>
    </>
  );
}
