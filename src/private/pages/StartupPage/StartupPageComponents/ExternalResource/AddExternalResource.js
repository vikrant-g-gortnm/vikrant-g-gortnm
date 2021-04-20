import React from "react";
import { useForm } from "react-hook-form";

//API
import { useMutation } from "@apollo/client";
import { externalResourcePut } from "private/Apollo/Mutations";
import { externalResourcesGet } from "private/Apollo/Queries";

//Components
import { Modal, Button } from "Components/elements";

//styles
import styles from "./ExternalResources.module.css";

//Main Function
export const AddExternalResource = ({ close, connectionId }) => {
  // Form
  const { register, errors, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  //Mutations
  const [putMutation] = useMutation(externalResourcePut);

  //On Submitting Form
  const onSubmit = async ({ label, url }, event) => {
    let variables = {
      connectionId: connectionId,
      input: { label, url },
    };

    try {
      let res = await putMutation({
        variables,
        update: (proxy, { data: { externalResourcePut } }) => {
          const data = proxy.readQuery({
            query: externalResourcesGet,
            variables: { connectionId },
          });

          const newData = {
            externalResourcesGet: [
              ...data.externalResourcesGet,
              externalResourcePut,
            ],
          };

          proxy.writeQuery({
            query: externalResourcesGet,
            variables: { connectionId },
            data: newData,
          });
        },
      });
    } catch (error) {
      return console.log("error", error);
    }
    close();
  };

  return (
    <Modal title="Add new resource" close={close} disableFoot={true}>
      <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Link name</label>
          <input
            className={errors["label"] && "form_error"}
            type="text"
            placeholder={"Website name"}
            autoComplete="off"
            ref={register({ required: true })}
            name="label"
          />

          <label>URL</label>
          <input
            className={errors["url"] && "form_error"}
            type="text"
            placeholder={"https://website.com"}
            autoComplete="off"
            ref={register({
              required: true,
              pattern: {
                value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*) ?/gi,
                message: "That does not look like a URL",
              },
            })}
            name="url"
          />

          {errors["url"]?.message && (
            <div className={styles.add_error_message}>
              {errors["url"]?.message}
            </div>
          )}

          <div className={styles.add_button}>
            {/*<Button*/}
            {/*  buttonStyle={"secondary"}*/}
            {/*  size={"medium"}*/}
            {/*  onClick={() => setShowDeleteModal(undefined)}*/}
            {/*>*/}
            {/*  Cancel*/}
            {/*</Button>*/}
            <span />
            <Button type="input" value="OK" loading={isSubmitting} />
          </div>
        </div>
      </form>
    </Modal>
  );
};
