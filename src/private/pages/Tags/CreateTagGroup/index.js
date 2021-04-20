import React, { useState } from "react";

//components
import { CreateTagGroups } from "./CreateTagGroups";
import { Button } from "Components/elements";

//styles
import styles from "../TagGroup.module.css";

//Main function
export default function CreateFunnelGroup({ index }) {
  const [showCreateNewTagModal, setShowCreateNewTagModal] = useState(false);

  return (
    <>
      {/* button */}
      <div className={styles.create_tag}>
        <Button
          onClick={() => setShowCreateNewTagModal(true)}
          type="right_arrow"
          size="large"
        >
          Create new Tag group
        </Button>
      </div>

      {/*  Create Funnel */}
      <CreateTagGroups
        open={showCreateNewTagModal}
        close={() => setShowCreateNewTagModal(false)}
      />
    </>
  );
}
