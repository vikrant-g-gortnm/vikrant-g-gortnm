import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// API
import { useMutation } from "@apollo/client";
import { creativePut } from "private/Apollo/Mutations";

// Helpers
import { validateEmail } from "util";

// Styles
import styles from "./StartupInfo.module.css";

// Components: general
import { Card, SuccessBox, Button, Modal } from "Components/elements";

// Helper function: Get public share url
function getPublicShareUrl({ creative }) {
  let url =
    `${window.location.protocol}//` +
    `${window.location.host}/` +
    `public/creative/` +
    `${creative.accountId}/` +
    `${creative.id}` +
    `&email=${creative.sharedWithEmail}`;
  return url;
}

// -----------------------------------
// Component: Startup has been invited
// -----------------------------------
function StartupHasBeenInvited({ creative, connectionId }) {
  // States
  const [copySuccess, setCopySuccess] = useState(false);

  // Mutations
  const [mutate, { loading }] = useMutation(creativePut);

  // Copy string to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
  }

  // Helpers: Get public share URL
  const shareUrl = getPublicShareUrl({ creative });

  // Execute mutation: Revoke access
  const revokeAccess = async () => {
    try {
      let variables = {
        id: creative.id,
        input: {
          removeSharing: true,
          connectionId,
        },
      };
      await mutate({ variables });
      setCopySuccess(false);
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div>
      <div className={styles.share_title}>This form can now be shared</div>

      <div className={styles.share_text}>
        You can now share this form with
        <b>{creative.sharedWithEmail}</b>. No email has been sent from Notata,
        so you will have to copy the link and send it by email.
      </div>

      {/* Public link to share */}
      <SuccessBox className={styles.invitation_success}>{shareUrl}</SuccessBox>

      {/* Copy link to clipboard */}
      <div className={styles.copy_link} onClick={copyToClipboard}>
        {copySuccess ? "link copied to clipboard" : "copy link"}
      </div>

      {/* Buttons */}
      <div className={styles.invitation_button_container}>
        <Button type="right_arrow" loading={loading} onClick={revokeAccess}>
          Revoke access
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------
// Component: Startup has NOT been invited
// ---------------------------------------
function StartupHasNotBeenInvited({ creative, connectionId }) {
  // States
  const [showModal, setShowModal] = useState(false);

  // Mutations
  const [mutate] = useMutation(creativePut);

  // Form
  const { register, handleSubmit, formState, setValue, errors } = useForm();
  const { isSubmitting } = formState;

  // Preload form value from server
  useEffect(() => {
    if (creative.sharedWithEmail) {
      setValue("email", creative.sharedWithEmail);
    }
  }, [creative.sharedWithEmail]);

  // Execute Mutation: Handle submit
  const onSubmit = async data => {
    // Convert email to correct string
    let email = data.email.toLowerCase().trim();

    // Validate email input
    return !validateEmail(email);

    // Save input
    try {
      let variables = {
        id: creative.id,
        input: {
          sharedWithEmail: email,
          connectionId,
        },
      };
      await mutate({ variables });
    } catch (error) {
      console.log("error");
    }

    // Close modal
    setShowModal(false);
  };

  return (
    <>
      {/* Content */}
      <div>
        <div className={styles.share_title}>
          Invite startup to fill in this information.
        </div>
        <div className={styles.share_text}>
          By inviting a startup to fill in this information you will generate a
          link that you can share with the startup. The startup will then have
          access to this form, and will be able to see all pre filled inforation
          you may have provided.
        </div>

        <div className={styles.invitation_button_container}>
          <Button type="right_arrow" onClick={() => setShowModal(true)}>
            Invite startup
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Invite startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.invitation_input_container}>
              <input
                type="text"
                placeholder={"name@email.com"}
                autoComplete="off"
                ref={register({ required: true })}
                name="email"
              />

              {errors && errors.email && (
                <p style={{ color: "red" }}>must be a valid email address</p>
              )}

              <div className={styles.invitation_button_container}>
                <Button type="input" value="OK" loading={isSubmitting} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// *****************
// * Main function *
// *****************
export default function InviteStartup({ creative, connectionId }) {
  // Startup has been invited if it has property "sharedWithEmail"
  const startupHasBeenInvited = !!creative.sharedWithEmail;

  return (
    <Card style={{ paddingBottom: "20px" }}>
      {/* Startup has been invited */}
      {startupHasBeenInvited && (
        <StartupHasBeenInvited
          creative={creative}
          connectionId={connectionId}
        />
      )}

      {/* Startup has not invited */}
      {!startupHasBeenInvited && (
        <StartupHasNotBeenInvited
          creative={creative}
          connectionId={connectionId}
        />
      )}
    </Card>
  );
}
