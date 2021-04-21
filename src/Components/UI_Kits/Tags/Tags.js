import React, { useState } from "react";
import TagsInput from "./TagsInput";
import { Tag } from "Components/elements";

//styles
import styles from "./Tag.module.css";
import classnames from "classnames";

//Tag buttons
function getTagButtons(tagButtons) {
  switch (tagButtons) {
    case "bigButtons":
      return styles.tagBigButton;
    case "smallButtons":
      return styles.tagSmallButton;
    default:
      return styles.tagBigButton;
  }
}
// Main function
export const Tags = ({
  title = "",
  items = [],
  size,
  tagSize,
  tagName,
  closeIcon,
  ulSize,
  tagButtons,
  optionalTxt,
  suggested,
  heading,
}) => {
  // States
  const [selectedTags, setSelectedTags] = useState([]);

  console.log("items", items);
  console.log("selectedTags", selectedTags);

  // Select tags
  function selectTags(tags) {
    // TODO: mutation
    setSelectedTags(tags);
  }

  return (
    <div className={styles.tag_wrapper}>
      {heading && <div className={styles.tag_title}>TAGS</div>}
      <div className={styles.tag_sub_title1}>TAGS</div>

      <div className={styles.tag_sub_title2}>
        {optionalTxt ? optionalTxt : "Write or choose tags"}
      </div>
      <div>
        <TagsInput
          selectTags={selectTags}
          selectedTags={selectedTags}
          size={size}
          tagSize={tagSize}
          tagName={tagName}
          closeIcon={closeIcon}
          ulSize={ulSize}
        />
      </div>
      {suggested && <div className={styles.tag_sub_title3}>Suggested tags</div>}
      <div>
        {items.map(item => (
          // TODO: Should not be a button item
          // need to create a <Tag> item.
          // See elements/NotataComponents/Tag
          <Tag
            className={classnames(getTagButtons(tagButtons))}
            key={item.id}
            type="button"
            onClick={() => {
              // The tags array should consist of object, not strings
              // see src/Apollo/Fragments => any tag related file

              selectTags([...selectedTags, item]);
            }}
          >
            {item.name}
          </Tag>
        ))}
      </div>
    </div>
  );
};
