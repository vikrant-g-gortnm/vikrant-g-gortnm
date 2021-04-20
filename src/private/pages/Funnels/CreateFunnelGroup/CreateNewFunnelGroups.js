import React, { useState } from "react";
import { useForm } from "react-hook-form";

//API
import { useMutation, useQuery } from "@apollo/client";
import { funnelGroupPut } from "private/Apollo/Mutations";
import { funnelGroupGet } from "private/Apollo/Queries";

//components
import { Button, Modal } from "Components/elements";

//styles
import styles from "../FunnelGroup.module.css";

//Main function
export function CreateNewFunnelGroups({ index, open, close }) {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);
  const [requiredFlag, setRequiredFlag] = useState(false);

  // Queries
  const funnelGroupsQuery = useQuery(funnelGroupGet);
  const funnelGroup = funnelGroupsQuery?.data?.accountGet.funnelGroups || [];

  //Mutations
  const [mutateFunnels] = useMutation(funnelGroupPut, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  //Form
  const { register, handleSubmit, formState, reset } = useForm();
  const { isSubmitting } = formState;

  // Look for duplicate names
  let FunnelNameArr = [];
  function lookForDuplicateNames(e) {
    //Input field is not empty stop warning
    if (e.target.value !== "" && requiredFlag) {
      setRequiredFlag(false);
    }

    // Populate array if empty
    if (FunnelNameArr.length === 0) {
      FunnelNameArr = funnelGroup.map(sub => sub.name);
    }

    // Filter array to see if we have a match
    let match = FunnelNameArr.find(
      name => name === e.target.value.toUpperCase()
    );

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
      let tempVaraible = variables;
      tempVaraible.input.name = tempVaraible.input.name.toUpperCase();
      await mutateFunnels({
        variables: {
          ...tempVaraible,
          index,
        },
      });
      reset();
      setRequiredFlag(false);
      close();
    } catch (error) {
      console.log("ERROR CREATING FUNNEL", error);
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
              placeholder="Funnel Group Name"
              name="input.name"
              onChange={lookForDuplicateNames}
              ref={register}
            />

            <textarea
              rows={1}
              className="form_p1"
              placeholder="Funnel Group Description"
              name="input.description"
              ref={register}
            />

            {/* If Duplicate values exists show this message */}
            {existedFlag && (
              <p style={{ color: "rgb('255,0,0')" }}>
                {" "}
                <span style={{ color: "black" }}>{existedFlag}</span> It`s
                already Exists
              </p>
            )}

            {/* If input field empty show this error message */}
            {requiredFlag && (
              <p style={{ color: "rgb('255,0,0')" }}>
                Please Enter Funnel Group Name.
              </p>
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
