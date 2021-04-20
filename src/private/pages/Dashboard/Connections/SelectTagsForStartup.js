import React from "react";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";

import { tagGroupsGet } from "private/Apollo/Queries";

import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";

// COMPONENTS
import TagSelector from "Components/TagSelector/TagSelector";

// Definitions
import mutationOptions from "./mutationOptions";

export default function SelectTagsForStartup({ connection, close }) {
  // Queries
  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [deleteTagMutation] = useMutation(connectionTagRemove);

  // Add tag function
  function addTag(tag) {
    addTagMutation(mutationOptions.addTag(tag, connection));
  }

  // Remove tag function
  async function deleteTag(tag) {
    try {
      let res = await deleteTagMutation(
        mutationOptions.deleteTag(tag, connection)
      );
      console.log("res", res);
    } catch (error) {
      console.log("deleteTagMutation", error);
    }
  }

  return (
    <TagSelector
      title={connection?.creative?.name}
      show={connection}
      tagGroups={tagGroups}
      checkedTags={connection?.tags}
      addTag={addTag}
      deleteTag={deleteTag}
      close={close}
    />
  );
}
