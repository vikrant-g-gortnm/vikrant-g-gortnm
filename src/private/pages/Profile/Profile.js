import React, { useEffect, useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";

import { userGet } from "private/Apollo/Queries";
import { userUpdate } from "private/Apollo/Mutations";

// COMPONENTS
import {
  success_message,
  get_new_code,
  new_code,
  verify_title,
  verified_phone_number,
} from "./Profile.module.css";

import { omit } from "lodash";

import { Content, Card, Button, BreadCrumbs } from "Components/elements";

import { settings, profile } from "definitions.js";

function VerifyPhoneNumberComp({ phoneVerified }) {
  const [resend, setResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
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
      <div className={success_message}>
        Your phone number has been verified. You can now enable SMS verification
        when loggin in for extra security.
      </div>
    );
  }

  return (
    <form className="notata_form mb2" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className={verify_title}>Please verify your phone number</div>

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
            className={get_new_code}
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
          <div className={new_code}>
            A new code has been sent you your phone
          </div>
        )}
      </div>
    </form>
  );
}

export default function Profile() {
  const { data } = useQuery(userGet);
  const [mutate] = useMutation(userUpdate);

  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(false);
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [cognitoUser, setCognitoUser] = useState();

  const { register, handleSubmit, formState, setValue } = useForm();

  const { isSubmitting } = formState;

  useEffect(() => {
    let user = data.userGet;

    for (let a in user) {
      setValue(`input.${a}`, user[a]);
    }

    Auth.currentAuthenticatedUser().then(cognitoUser => {
      setCognitoUser(cognitoUser);
      Auth.userAttributes(cognitoUser).then(userAttributes => {
        let ua = {};
        for (let attrib of userAttributes) {
          ua[attrib.Name] = attrib.Value;
        }
        if (ua.phone_number) setHasPhoneNumber(true);
        if (ua.phone_number_verified === "true") {
          setVerifiedPhoneNumber(true);
        }
      });

      Auth.getPreferredMFA(cognitoUser).then(MFA => {
        console.log("MFA", MFA);
        setValue("input.MFA", MFA);
      });
    });
  }, [data.userGet, setValue]);

  const onSubmit = async (data, event) => {
    let { input } = data;

    try {
      await Auth.updateUserAttributes(
        cognitoUser,
        omit(input, ["email", "company"])
      );
    } catch (error) {
      console.log("error", error);
    }

    try {
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }

    if (input.phone_number) {
      setHasPhoneNumber(true);
    }
  };

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Profile",
            link: profile,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>Profile</h1>

        {hasPhoneNumber && !verifiedPhoneNumber && (
          <Card>
            <VerifyPhoneNumberComp
              phoneVerified={() => {
                setVerifiedPhoneNumber(true);
              }}
            />
          </Card>
        )}

        <Card>
          <form className="notata_form mb2" onSubmit={handleSubmit(onSubmit)}>
            <label for="input.given_name">Given name</label>
            <input
              type="text"
              placeholder={"Given name"}
              autoComplete="off"
              ref={register({ required: true })}
              id="input.given_name"
              name="input.given_name"
            />

            <label for="input.family_name">Family name</label>
            <input
              type="text"
              placeholder={"Family name"}
              autoComplete="off"
              ref={register({ required: true })}
              id="input.family_name"
              name="input.family_name"
            />

            <label for="input.company">Company</label>
            <input
              type="text"
              placeholder={"Company"}
              autoComplete="off"
              ref={register}
              id="input.company"
              name="input.company"
            />

            <label for="input.company">Email</label>
            <input
              type="text"
              placeholder={"Email"}
              autoComplete="off"
              ref={register}
              disabled
              id="input.email"
              name="input.email"
            />

            <label for="input.phone_number">Phone number</label>
            <input
              type="text"
              placeholder={"Phone number"}
              autoComplete="off"
              ref={register}
              id="input.phone_number"
              name="input.phone_number"
            />

            {verifiedPhoneNumber && (
              <>
                <div className={verified_phone_number}>
                  phone number is verified
                </div>
                <div className="check_container">
                  <input
                    type="checkbox"
                    id="input.MFA"
                    name="input.MFA"
                    ref={register}
                  />
                  <label for="input.MFA">
                    Enable SMS for two factor security when logging in.
                  </label>
                </div>
              </>
            )}

            <div
              style={{
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              <Button type="input" value="SAVE" loading={isSubmitting} />
            </div>
          </form>
        </Card>
      </Content>
    </>
  );
}
