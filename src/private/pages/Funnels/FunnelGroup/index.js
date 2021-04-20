import React from "react";

//Components
import { Card } from "Components/elements";
import {
  DeleteFunnelGroup,
  FunnelGroupNameAndDescription,
  FunnelList,
} from "./FunnelGroups";

//styles
import styles from "../FunnelGroup.module.css";

//Main Function
export default function FunnelGroup({ id, name, funnelTags, funnel }) {
  return (
    <Card>
      <DeleteFunnelGroup funnelTags={funnelTags} groupId={id} name={name} />

      <FunnelGroupNameAndDescription id={id} name={name} funnel={funnel} />
      <FunnelList funnelTags={funnelTags} funnelGroupId={id} />
      <div className={styles.funnel_group_footer} />
    </Card>
  );
}
