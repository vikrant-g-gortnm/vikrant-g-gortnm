import React, { useEffect, useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";

import { omit } from "lodash";
import styles from "./Profile.module.css";

import { Card, Button, MessageBox } from "Components/elements/";

export default function Page1({ setPage }) {
  const [mutate] = useMutation(userUpdate);
  const [cognitoUser, setCognitoUser] = useState();
  const { register, handleSubmit, formState, setValue } = useForm();

  const { isSubmitting } = formState;

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(cognitoUser => {
      setCognitoUser(cognitoUser);
      Auth.userAttributes(cognitoUser).then(userAttributes => {
        let ua = {};
        for (let attrib of userAttributes) {
          ua[attrib.Name] = attrib.Value;
        }
        for (let a in ua) {
          setValue(`input.${a}`, ua[a]);
        }
      });
    });
  }, [setValue]);

  const onSubmit = async data => {
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
    setPage(2);
  };

  return (
    <div>
      <h1>Great! You are in 🎉</h1>

      <Card className={styles.cards_container}>
        <MessageBox className={styles.message_box}>
          Now we just need to know a little bit more about you.
        </MessageBox>

        <form
          className="notata_form"
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: "20px" }}
        >
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

          <div style={{ visibility: "hidden", display: "none" }}>
            <label for="input.company">Email</label>
            <input
              type="text"
              placeholder={"Email"}
              autoComplete="off"
              ref={register}
              // disabled
              id="input.email"
              name="input.email"
            />
          </div>

          <div className={styles.bottom_box}>
            <hr />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span />
              <Button type="input" value="SAVE" loading={isSubmitting} />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
