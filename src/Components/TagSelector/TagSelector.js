import React, { useState } from "react";

import TagPage from "./TagPage";
import TagOverview from "./TagOverview";
import SelectedTags from "./SelectedTags";

import { Modal } from "../elements/";

export default function TagSelector(props) {
  const [showGroup, setShowGroup] = useState(null);

  const { show, tagGroups } = props;

  if (!show) return <span />;

  return (
    <Modal
      title={props.title || ""}
      noKill
      close={props.close}
      disableFoot={true}
    >
      <SelectedTags {...props} />

      {/*OVERVIEW*/}
      {tagGroups && !showGroup && (
        <TagOverview
          {...props}
          setShowGroup={setShowGroup}
          close={() => {
            props.close();
            setShowGroup(null);
          }}
        />
      )}

      {/*PAGE*/}
      {showGroup && (
        <TagPage
          {...props}
          tagGroups={tagGroups}
          groupId={showGroup}
          // setShowGroup={setShowGroup}
          close={() => {
            setShowGroup(null);
          }}
        />
      )}
    </Modal>
  );
}
