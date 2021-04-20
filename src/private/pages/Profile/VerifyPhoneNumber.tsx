import React, { useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// COMPONENTS
// import {
//   success_message,
//   get_new_code,
//   new_code,
//   verify_title,
// } from "./Profile.module.css";
import styles from "./Profile.module.css";

import { Button } from "Components/elements";

function VerifyPhoneNumber({ phoneVerified }: { phoneVerified: any }) {
  const [resend, setResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data: any, event: any) => {
    try {
      await Auth.verifyCurrentUserAttributeSubmit(
        "phone_number",
        data.verification_code
      );

      setSuccess(true);
      phoneVerified();
    } catch (error) {
      console.log("error", error);
    }
  };

  if (success) {
    return (
      <div className={styles.success_message}>
        Your phone number has been verified. You can now enable SMS verification
        when loggin in for extra security.
      </div>
    );
  }

  return (
    <form className="notata_form mb3" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className={styles.verify_title}>
          Please verify your phone number
        </div>

        <input
          placeholder="Verification code"
          type="text"
          name="verification_code"
          autoComplete="off"
          ref={register({ required: true })}
        />

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="VERIFY" loading={isSubmitting} />
        </div>

        {!resend && (
          <div
            className={styles.get_new_code}
            onClick={async () => {
              try {
                await Auth.verifyCurrentUserAttribute("phone_number");
                setResend(true);
              } catch (error) {
                return console.log("error", error);
              }
            }}
          >
            Get a new code
          </div>
        )}

        {resend && (
          <div className={styles.new_code}>
            A new code has been sent you your phone
          </div>
        )}
      </div>
    </form>
  );
}

export default VerifyPhoneNumber;
