import React, { useState } from "react";

import {
  dropdown_container,
  dropdown_title,
  dropdown_inner,
  dropdown_list_container,
  dropdown_group_item,
  dropdown_group_item_check,
  dropdown_close,
} from "./Tags.module.css";

export default function TagPage({
  group,
  checkedTags,
  addTag,
  deleteTag,
  close,
}) {
  const [filter, setFilter] = useState("");

  let tags = group.tags || [];

  if (filter.length) {
    tags = tags.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  return (
    <div className={dropdown_container}>
      <div className={dropdown_title}>Add tags</div>
      <div className={dropdown_inner}>
        <div>{group.name}</div>

        <div className="notata_form">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="filter list..."
          />
        </div>

        <div className={dropdown_list_container}>
          {tags.map(tag => {
            // This should be based on ID, but since we're using optimistic,
            // we don't know the ID before we get the data back from server...
            const isChecked = checkedTags.some(
              ({ id, name }) => name === tag.name
            );
            return (
              <div key={tag.id} className={dropdown_group_item}>
                <div className={dropdown_group_item_check}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        isChecked ? deleteTag(tag) : addTag(tag);
                      }}
                    />
                    {tag.name}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={dropdown_close} onClick={close}>
        <i className="fal fa-arrow-left" />
      </div>
    </div>
  );
}
