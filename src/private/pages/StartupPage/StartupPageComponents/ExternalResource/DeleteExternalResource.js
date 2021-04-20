import React from "react";

//API
import { useMutation } from "@apollo/client";
import { externalResourcesGet } from "private/Apollo/Queries";
import { externalResourceDelete } from "private/Apollo/Mutations";

//Components
import { Modal, Button } from "Components/elements";

//styles
import styles from "./ExternalResources.module.css";

//Main Function
export const DeleteExternalResource = ({ close, resourceId, connectionId }) => {
  //Mutations
  const [deleteMutation, { loading: isDeleting }] = useMutation(
    externalResourceDelete
  );
  return (
    <Modal title={"Delete resource"} close={close} disableFoot={true}>
      <div>
        <div className={styles.delete_message}>
          Are you sure you want to delete this resource?
        </div>
        <div className={styles.delete_button}>
          <Button size={"medium"} buttonStyle={"secondary"} onClick={close}>
            Cancel
          </Button>

          <Button
            size={"medium"}
            loading={isDeleting}
            onClick={async () => {
              if (isDeleting) {
                return;
              }

              try {
                let variables = { id: resourceId };
                await deleteMutation({
                  variables,
                  update: proxy => {
                    const data = proxy.readQuery({
                      query: externalResourcesGet,
                      variables: { connectionId },
                    });

                    proxy.writeQuery({
                      query: externalResourcesGet,
                      variables: { connectionId },
                      data: {
                        externalResourcesGet: data.externalResourcesGet.filter(
                          r => r.id !== resourceId
                        ),
                      },
                    });
                  },
                });
              } catch (error) {
                console.log("error", error);
              }

              close();
            }}
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};
