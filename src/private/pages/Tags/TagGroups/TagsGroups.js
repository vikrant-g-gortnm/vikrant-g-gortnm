import React, { useCallback, useState } from "react";

//API
import { useMutation } from "@apollo/client";
import {
  tagDelete,
  tagGroupDelete,
  tagGroupPut,
  tagPut,
} from "private/Apollo/Mutations";
import { tagGroupsGet } from "private/Apollo/Queries";

//Components
import { Modal, SimpleInputForm } from "Components/elements";

//Helpers
import debounce from "lodash/debounce";

//styles
import styles from "../TagGroup.module.css";

export function TagGroupNameAndDescription({ id, name, type }) {
  const [mutateTags] = useMutation(tagGroupPut);
  const delayedTagsMutation = useCallback(
    debounce(options => mutateTags(options), 1000),
    []
  );

  return (
    <form className="focus_form mb3">
      <textarea
        rows={1}
        className="form_h2"
        name="input.name"
        defaultValue={name}
        onChange={event => {
          const variables = {
            variables: {
              id,
              input: { name: event.target.value },
            },
          };
          delayedTagsMutation(variables);
        }}
      />
      <hr />
    </form>
  );
}

function DeleteTag({ tag }) {
  let [mutateTagsDelete, { loading: tagDeleteLoading }] = useMutation(
    tagDelete,
    {
      refetchQueries: [{ query: tagGroupsGet }],
      awaitRefetchQueries: true,
    }
  );

  const loading = tagDeleteLoading;

  return (
    <div
      className={styles.option_save}
      onClick={() => {
        if (loading) return;
        const variables = { variables: { id: tag.id } };
        mutateTagsDelete(variables);
      }}
    >
      {loading && (
        <span>
          <i className="fa fa-spinner fa-spin" />{" "}
        </span>
      )}
      Delete
    </div>
  );
}

export function TagInput({ tag, tagGroupId, index }) {
  const [mutateTags, { loading: tagPutLoading }] = useMutation(tagPut, {
    refetchQueries: [{ query: tagGroupsGet }],
    awaitRefetchQueries: true,
  });

  return (
    <div className={styles.option_dashed_container}>
      <SimpleInputForm
        placeholder="Create new tag"
        val={tag ? tag.name : ""}
        submit={({ input_val }) => {
          if (!input_val.length) return;

          let variables = {
            input: {
              name: input_val,
              index,
            },
          };

          if (tag) {
            variables.id = tag.id;
          }
          variables.tagGroupId = tagGroupId;
          mutateTags({ variables }).then(null);
        }}
      />

      {!tag && (
        <div className={styles.option_save}>
          {tagPutLoading && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          add
        </div>
      )}

      {tag && <DeleteTag tag={tag} />}
    </div>
  );
}

export function TagList({ tags, tagGroupId }) {
  const data = tags;

  return (
    <>
      {[...data]
        .sort((a, b) => a.index - b.index)
        .map((tag, i) => (
          <TagInput key={tag.id} tag={tag} tagGroupId={tagGroupId} index={i} />
        ))}

      <TagInput tagGroupId={tagGroupId} index={tags.length} />
    </>
  );
}

export function DeleteTagGroup({ tags, groupId, name }) {
  let [
    tagGroupDeleteMutation,
    { loading: tagGroupDeleteLoading },
  ] = useMutation(tagGroupDelete, {
    refetchQueries: [{ query: tagGroupsGet }],
    awaitRefetchQueries: true,
  });

  const [showWarning, setShowWarning] = useState(false);

  const loading = tagGroupDeleteLoading;

  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <div
          className={styles.option_save}
          onClick={() => {
            if (loading) return;

            if (tags.length) {
              setShowWarning(true);
              return;
            }
            const variable = {
              variables: {
                id: groupId,
              },
            };
            tagGroupDeleteMutation(variable);
          }}
        >
          {loading && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          <span>Delete tag group</span>
        </div>
      </div>
      {showWarning && (
        <Modal
          title={`${name} Delete Warning`}
          disableFoot={false}
          close={() => setShowWarning(false)}
          key="warningModal"
          loading={false}
          showScrollBar={false}
        >
          <span>
            You have to delete all the tags in the group before you can delete
            the group.
          </span>
        </Modal>
      )}
    </>
  );
}
