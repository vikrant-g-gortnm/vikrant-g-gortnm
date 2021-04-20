import React from "react";
import { Tag } from "../elements/";

import { tag_each, tag_name, tag_kill } from "./Tags.module.css";

export default function SelectedTags({ checkedTags, tagGroups, deleteTag }) {
  return (
    <div>
      {(checkedTags || []).map(tag => {
        const group =
          (tagGroups || []).find(({ id }) => id === tag.tagGroupId) || {};
        return (
          <Tag key={tag.id}>
            <div className={tag_each}>
              <div className={tag_name}>
                {group.name}: {tag.name}
              </div>
              <div className={tag_kill} onClick={() => deleteTag(tag)}>
                <i className="fal fa-times" />
              </div>
            </div>
          </Tag>
        );
      })}
    </div>
  );
}
