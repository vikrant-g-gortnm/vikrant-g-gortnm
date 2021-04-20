import React from "react";

//Components
import { Card } from "Components/elements";
import {
  DeleteTagGroup,
  TagGroupNameAndDescription,
  TagList,
} from "./TagsGroups";

//styles
import styles from "../TagGroup.module.css";

//Main Function
export default function TagGroup({ id, name, tags }) {
  return (
    <Card>
      <DeleteTagGroup tags={tags} groupId={id} name={name} />

      <TagGroupNameAndDescription id={id} name={name} />

      <TagList tags={tags} tagGroupId={id} />

      <div className={styles.tag_group_footer} />
    </Card>
  );
}
