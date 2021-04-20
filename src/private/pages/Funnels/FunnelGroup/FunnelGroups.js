import React, { useCallback, useState } from "react";

//components
import { Modal, SimpleInputForm } from "Components/elements";

//API
import { useMutation, useQuery } from "@apollo/client";
import {
  funnelGroupDelete,
  funnelGroupPut,
  funnelTagDetele,
  funnelTagPut,
} from "private/Apollo/Mutations";
import { funnelGroupGet } from "private/Apollo/Queries";

//Helper
import debounce from "lodash/debounce";

//styles
import styles from "../FunnelGroup.module.css";

//Funnel group function
export function FunnelGroupNameAndDescription({ id, name }) {
  //queries
  const [mutateFunnels] = useMutation(funnelGroupPut);
  const delayedFunnelsMutation = useCallback(
    debounce(options => mutateFunnels(options), 1000),
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
          delayedFunnelsMutation(variables);
        }}
      />
      <hr />
    </form>
  );
}

//Delete Funnel
export function DeleteFunnel({ funnelTag }) {
  let [
    mutateFunnelTagsDelete,
    { loading: funnelTagDeleteLoading },
  ] = useMutation(funnelTagDetele, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  const loading = funnelTagDeleteLoading;

  return (
    <div
      className={styles.option_save}
      onClick={() => {
        if (loading) return;
        const variables = { variables: { id: funnelTag.id } };
        mutateFunnelTagsDelete(variables);
      }}
    >
      {loading && (
        <span>
          <i className="fa fa-spinner fa-spin" />{" "}
        </span>
      )}
      delete
    </div>
  );
}

//Funnel input function
export function FunnelInput({ funnelGroupId, index, funnelTag }) {
  /* //state
  const [ requiredFlag, setRequiredFlag] = useState(false);
  const [existedFlag, setExistedFlag] = useState(undefined);
 */
  //Queries
  const [mutateFunnels, { loading: funnelTagPutLoading }] = useMutation(
    funnelTagPut,
    {
      refetchQueries: [{ query: funnelGroupGet }],
      awaitRefetchQueries: true,
    }
  );

  return (
    <div className={styles.funnel_tag_input} style={{ paddingLeft: "10px" }}>
      <SimpleInputForm
        placeholder="Create new funnels"
        val={funnelTag ? funnelTag.name : ""}
        submit={({ input_val }) => {
          let variables = {
            input: {
              name: input_val,
              index,
            },
          };

          if (funnelTag) {
            variables.id = funnelTag.id;
          }
          variables.funnelGroupId = funnelGroupId;
          mutateFunnels({ variables });
        }}
      />

      {!funnelTag && (
        <div className={styles.option_save}>
          {funnelTagPutLoading && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          add
        </div>
      )}

      {funnelTag && <DeleteFunnel funnelTag={funnelTag} />}
    </div>
  );
}

//TagList function
export function FunnelList({ funnelTags, funnelGroupId }) {
  const data = funnelTags;

  return (
    <>
      {[...data]
        .sort((a, b) => a.index - b.index)
        .map((funnelTag, i) => (
          <FunnelInput
            funnelTag={funnelTag}
            key={funnelTag.id}
            funnelGroupId={funnelGroupId}
            index={i}
          />
        ))}

      <FunnelInput funnelGroupId={funnelGroupId} index={funnelTags.length} />
    </>
  );
}

//delete Funnel
export function DeleteFunnelGroup({ groupId, name, funnelTags }) {
  let [
    funnelGroupDeleteMutation,
    { loading: funnelGroupDeleteLoading },
  ] = useMutation(funnelGroupDelete, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  const [showWarning, setShowWarning] = useState(false);

  const loading = funnelGroupDeleteLoading;

  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <div
          className={styles.option_save}
          onClick={() => {
            if (loading) return;

            if (funnelTags.length) {
              setShowWarning(true);
              return;
            }
            const variable = {
              variables: {
                id: groupId,
              },
            };
            funnelGroupDeleteMutation(variable);
          }}
        >
          {loading && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          <span>Delete Funnel Group</span>
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
            You have to delete all the funnels in the group before you can
            delete the group.
          </span>
        </Modal>
      )}
    </>
  );
}
