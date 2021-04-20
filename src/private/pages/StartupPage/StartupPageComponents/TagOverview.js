import React, { useState } from "react";
import { Button } from "Components/elements/";

import {
  dropdown_container,
  dropdown_title,
  dropdown_inner,
  dropdown_group,
  dropdown_group_header,
  dropdown_group_title,
  dropdown_group_item_check,
  dropdown_close,
} from "./Tags.module.css";

export default function TagOverview({
  checkedTags,
  tagGroups,
  setShowGroup,
  addTag,
  deleteTag,
  close,
}) {
  const [filter, setFilter] = useState("");

  let filteredList = [];
  if (filter.length) {
    filteredList = tagGroups
      .map(group => ({
        ...group,
        tags: group.tags.filter(({ name }) =>
          name.toLowerCase().includes(filter.toLowerCase())
        ),
      }))
      .filter(group => group.tags.length);
  }

  return (
    <div className={dropdown_container}>
      <div className={dropdown_title}>Add tags</div>

      <div className={dropdown_inner}>
        <div className="notata_form">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for tags"
          />
        </div>

        {!filter.length &&
          tagGroups.map((tagGroup, i) => (
            <div className={dropdown_group} key={i}>
              <div className={dropdown_group_header}>
                <div className={dropdown_group_title}>{tagGroup.name}</div>
                <Button
                  type="tiny_right"
                  onClick={() => setShowGroup(tagGroup)}
                />
              </div>
            </div>
          ))}

        {!!filter.length &&
          filteredList.map((tagGroup, i) => {
            return (
              <div key={i}>
                <div>{tagGroup.name}</div>
                {tagGroup.tags.map((tag, ii) => {
                  const isChecked = checkedTags.some(
                    ({ id, name }) => name === tag.name
                  );
                  return (
                    <div
                      key={`${i}-${ii}`}
                      className={dropdown_group_item_check}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            isChecked ? deleteTag(tag) : addTag(tag)
                          }
                        />
                        {tag.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      <div className={dropdown_close} onClick={close}>
        <i className="fal fa-times" />
      </div>
    </div>
  );
}
