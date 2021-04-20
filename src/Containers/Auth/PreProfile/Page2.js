import React from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

import { Tag, Card, Button, MessageBox } from "Components/elements/";
import styles from "./Profile.module.css";

export default function Page2({ setPage, extraInputs, setExtraInputs }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.keyCode === 188) {
      let val = e.target.value;
      if (val === "") return;
      setExtraInputs({
        ...extraInputs,
        interests: [...extraInputs.interests, e.target.value],
      });
      e.target.value = "";
    }
  }

  function handleKeyUp(e) {
    let val = e.target.value;
    if (val === ",") {
      e.target.value = "";
    }
  }

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  return (
    <div>
      <h1>Your interests 🧐</h1>

      <Card className={styles.cards_container}>
        <MessageBox className={styles.message_box}>
          What kind of{" "}
          <span style={{ fontWeight: "var(--font-weight-bold)" }}>
            companies are you interested
          </span>{" "}
          in? For example, are you interested in ocean-tech, female founders and
          software solutions?
        </MessageBox>

        <form
          className="notata_form"
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: "20px" }}
        >
          <label for="input.interests">Separate with comma</label>
          <input
            type="text"
            placeholder={"Ocean-tech, female founders, software"}
            autoComplete="off"
            ref={register}
            id="input.interests"
            name="input.interests"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />

          <div>
            {extraInputs.interests.map((interest, i) => (
              <Tag
                key={i}
                kill={() => {
                  setExtraInputs({
                    ...extraInputs,
                    interests: extraInputs.interests.filter(
                      it => it !== interest
                    ),
                  });
                }}
              >
                {interest}
              </Tag>
            ))}
          </div>
        </form>

        <div className={styles.bottom_box}>
          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Button
              size={"medium"}
              buttonStyle={"secondary"}
              onClick={() => setPage(1)}
            >
              back
            </Button>

            <Button
              size={"medium"}
              loading={isSubmitting}
              onClick={() => setPage(3)}
            >
              {extraInputs.interests.length ? "NEXT" : "SKIP"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
