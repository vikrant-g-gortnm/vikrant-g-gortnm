import React, { useState } from "react";
import { useForm } from "react-hook-form";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionCreate, creativePut } from "private/Apollo/Mutations";

// COMPONENTS
import { Button, Modal } from "Components/elements";

// DEFINITIONS
import { startup_page } from "definitions";

// *****************
// * MAIN FUNCTION *
// *****************

export const CreateStartupModal = ({ history, open, close }) => {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);

  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  // Mutations
  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate);

  // Queries
  const connectionsQuery = useQuery(connectionsGet);
  const connections = connectionsQuery?.data?.connectionsGet || [];

  // Look for duplicate names
  let companyNameArr = [];
  function lookForDuplicateNames(e) {
    // Populate array if empty
    if (companyNameArr.length === 0) {
      companyNameArr = connections.map(sub => sub.creative.name);
    }

    // Filter array to see if we have a match
    let match = companyNameArr.find(name => name === e.target.value);

    // If duplicate, set state
    setExistedFlag(match);
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists
    if (existedFlag) {
      close();
      setExistedFlag(undefined);
      return;
    }

    try {
      // Create creative
      let creative_res = await mutateCreative(data);
      let creative = creative_res?.data?.creativePut;

      // Create connection
      let variables = { creativeId: creative.id };
      let res_connection = await mutateConnectionCreate({ variables });
      let connection = res_connection?.data?.connectionCreate;

      // Go to startup page
      let path = `${startup_page}/${connection.id}`;
      history.push(path);

      // Close modal
      close();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  return (
    <>
      {open && (
        <Modal
          title="Add startup"
          close={() => {
            setExistedFlag(undefined);
            close();
          }}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt3">
              <input
                type="text"
                placeholder='I.e. "Money Press Inc."'
                autoComplete="off"
                ref={register({ required: true })}
                onChange={lookForDuplicateNames}
                name="variables.input.name"
              />

              {existedFlag && (
                <p style={{ color: "rgb('255,0,0')" }}>
                  <span style={{ color: "black" }}>{existedFlag}</span> It`s
                  already Exists
                </p>
              )}

              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                }}
              >
                <Button
                  type="input"
                  value={existedFlag ? "Cancel" : "OK"}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default CreateStartupModal;
