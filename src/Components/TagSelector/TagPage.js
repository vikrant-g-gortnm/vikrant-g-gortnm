import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { tagGroupsGet } from "private/Apollo/Queries";
import { tagPut } from "private/Apollo/Mutations";

import {
  dropdown_inner,
  dropdown_list_container,
  dropdown_group_item,
  dropdown_group_item_check,
  dropdown_close,
  dropdown_group_tile,
  save_as_new_small,
} from "./Tags.module.css";

import { Button } from "../elements/";

export default function TagPage({
  groupId,
  checkedTags,
  addTag,
  deleteTag,
  close,
  tagGroups,
}) {
  let [mutate, { loading }] = useMutation(tagPut, {
    refetchQueries: [{ query: tagGroupsGet }],
    awaitRefetchQueries: true,
  });

  const [filter, setFilter] = useState("");

  let group = tagGroups.find(({ id }) => id === groupId);

  if (!group) return <div>No group</div>;

  let tags = group.tags || [];

  if (filter.length) {
    tags = tags.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  let addNewButton;

  if (filter.length) {
    let match = tags.some(
      ({ name }) => name.toLowerCase() === filter.toLowerCase()
    );

    if (!match) addNewButton = "SMALL";
  }

  if (filter.length && !tags.length) addNewButton = "LARGE";

  return (
    <div
    // className={dropdown_container}
    >
      <div className={dropdown_inner}>
        <div className={dropdown_group_tile}>{group.name}</div>

        <div className="notata_form">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="filter list..."
          />
        </div>

        {addNewButton && (
          <div
            className="text-right"
            onClick={async () => {
              if (loading) return;

              let res;
              try {
                let variables = {
                  tagGroupId: group.id,
                  input: {
                    name: filter,
                  },
                };
                res = await mutate({ variables });
              } catch (error) {
                return console.log("error", error);
              }

              addTag(res.data.tagPut);
              setFilter("");
            }}
          >
            {addNewButton === "LARGE" && (
              <Button type="right_arrow" size="small" loading={loading}>
                save as new tag
              </Button>
            )}

            {addNewButton === "SMALL" && (
              <div className={save_as_new_small}>
                {loading && (
                  <span>
                    <i className="fa fa-spinner fa-spin" />{" "}
                  </span>
                )}
                save as new tag
              </div>
            )}
          </div>
        )}

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
