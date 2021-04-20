import React, { useState } from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { dashboard } from "definitions.js";

import { Card, Button, MessageBox } from "Components/elements/";
import styles from "./Profile.module.css";

export default function Page4({ setPage, extraInputs, history }) {
  const [mutate] = useMutation(userUpdate);

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let input = {
      ...extraInputs,
      investor: data.input.investor,
    };

    try {
      setLoading(true);
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);

    history.push(dashboard);
  };

  return (
    <div>
      <h1>Is this your job 💰</h1>

      <Card className={styles.cards_container}>
        <MessageBox className={styles.message_box}>
          Are you a professional investor, or is this your side hustle?
        </MessageBox>

        <form
          className="notata_form"
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: "20px" }}
        >
          <div style={{ padding: "10px" }}>
            <div className={"check_container"}>
              <label for="input.professional">
                <input
                  type="radio"
                  ref={register}
                  id="input.professional"
                  name="input.investor"
                  value="professional"
                />
                Investing is my day job
              </label>
            </div>

            <div className={"check_container"}>
              <label for="input.angel">
                <input
                  type="radio"
                  ref={register}
                  id="input.angel"
                  name="input.investor"
                  value="angel"
                />
                I'm a hobby investor
              </label>
            </div>
          </div>

          <div className={styles.bottom_box}>
            <hr />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                size={"medium"}
                buttonStyle={"secondary"}
                onClick={() => setPage(3)}
              >
                back
              </Button>

              <Button
                type="input"
                // value={isDirty ? "SAVE" : "SKIP"}
                value={"NEXT"}
                loading={loading}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
