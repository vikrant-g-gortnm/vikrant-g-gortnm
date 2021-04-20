import React, { useState } from "react";

//components
import { CreateNewFunnelGroups } from "./CreateNewFunnelGroups";
import { Button } from "Components/elements";

//styles
import styles from "../FunnelGroup.module.css";

//Main function
export default function CreateFunnelGroup({ index }) {
  const [showCreateNewFunnelModal, setShowCreateNewFunnelModal] = useState(
    false
  );

  return (
    <>
      {/* button */}
      <div className={styles.create_funnel}>
        <Button
          onClick={() => setShowCreateNewFunnelModal(true)}
          type="right_arrow"
          size="large"
        >
          Create new funnel group
        </Button>
      </div>

      {/*  Create Funnel */}
      <CreateNewFunnelGroups
        open={showCreateNewFunnelModal}
        close={() => setShowCreateNewFunnelModal(false)}
      />
    </>
  );
}
