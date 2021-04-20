import React, { useState } from "react";
import { useForm } from "react-hook-form";

//API
import { useMutation, useQuery } from "@apollo/client";
import { tagGroupPut } from "private/Apollo/Mutations";
import { tagGroupsGet } from "private/Apollo/Queries";

//components
import { Modal, Button } from "Components/elements";

//styles
import styles from "../TagGroup.module.css";

//Main Function
export function CreateTagGroups({ index, open, close }) {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);
  const [requiredFlag, setRequiredFlag] = useState(false);

  //Queries
  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];

  //Mutations
  const [mutateTags] = useMutation(tagGroupPut, {
    refetchQueries: [{ query: tagGroupsGet }],
    awaitRefetchQueries: true,
  });

  //Form
  const { register, handleSubmit, formState, reset } = useForm();
  const { isSubmitting } = formState;

  // Look for duplicate names
  let TagNameArr = [];
  function lookForDuplicateNames(e) {
    //Input field is not empty stop warning
    if (e.target.value !== "" && requiredFlag) {
      setRequiredFlag(false);
    }
    // Populate array if empty
    if (TagNameArr.length === 0) {
      TagNameArr = tagGroups.map(sub => sub.name);
    }

    // Filter array to see if we have a match
    let match = TagNameArr.find(name => name === e.target.value.toUpperCase());

    // If duplicate, set state
    setExistedFlag(match);
  }

  // Submit function with mutations
  const onSubmit = async variables => {
    //Input field is empty throw warning
    if (variables.input.name === "") {
      setRequiredFlag(true);
      return;
    }
    // Stop if startup with same name exists
    if (existedFlag) {
      close();
      setExistedFlag(undefined);
      return;
    }
    try {
      //temporary variable to convert input into uppercase
      let tempVariable = variables;
      tempVariable.input.name = tempVariable.input.name.toUpperCase();
      await mutateTags({
        variables: {
          ...tempVariable,
          index,
        },
      });

      reset();
      setRequiredFlag(false);
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {open && (
        <Modal
          title="Create Funnel Group"
          close={() => {
            setExistedFlag(undefined);
            close();
          }}
          disableFoot={true}
        >
          <form className="focus_form mb3" onSubmit={handleSubmit(onSubmit)}>
            <textarea
              rows={1}
              className="form_h1"
              placeholder="Tag Group Name"
              name="input.name"
              onChange={lookForDuplicateNames}
              ref={register({ required: true })}
              ref={register}
            />

            <textarea
              rows={1}
              className="form_p1"
              placeholder="Tag Group Description"
              name="input.description"
              ref={register}
            />

            {/* If Duplicate values exists show this message */}
            {existedFlag && (
              <p style={{ color: "rgb('255,0,0')" }}>
                <span style={{ color: "black" }}>{existedFlag}</span>, It`s
                already Exists.
              </p>
            )}

            {/* If input field empty show this error message */}
            {requiredFlag ? (
              <p style={{ color: "rgb('255,0,0')" }}>
                Please Enter Tag Group Name.
              </p>
            ) : (
              <></>
            )}

            <div className={styles.submit_button}>
              <Button
                type="input"
                value={existedFlag ? "Cancel" : "OK"}
                loading={isSubmitting}
                size="large"
              ></Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
