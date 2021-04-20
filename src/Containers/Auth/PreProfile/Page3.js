import React from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

import { Card, Button, MessageBox, Tag } from "Components/elements/";
import styles from "./Profile.module.css";

export default function Page3({ setPage, extraInputs, setExtraInputs }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.keyCode === 188) {
      let val = e.target.value;
      if (val === "") return;
      setExtraInputs({
        ...extraInputs,
        skills: [...extraInputs.skills, e.target.value],
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

  return (
    <div>
      <h1>Your skills 🤓</h1>

      <Card className={styles.cards_container}>
        <MessageBox className={styles.message_box}>
          What are your{" "}
          <span style={{ fontWeight: "var(--font-weight-bold)" }}>
            fields of expertise
          </span>
          ? Are you an expert in a field, for example software, government and
          offshore?
        </MessageBox>

        <form
          className="notata_form"
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: "20px" }}
        >
          <label for="input.skills">Separate with comma</label>
          <input
            type="text"
            placeholder={"software, government, offshore"}
            autoComplete="off"
            ref={register}
            id="input.skills"
            name="input.skills"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />

          <div>
            {extraInputs.skills.map((skill, i) => (
              <Tag
                key={i}
                kill={() => {
                  setExtraInputs({
                    ...extraInputs,
                    skills: extraInputs.skills.filter(it => it !== skill),
                  });
                }}
              >
                {skill}
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
              onClick={() => setPage(2)}
            >
              back
            </Button>

            <Button
              size={"medium"}
              loading={isSubmitting}
              onClick={() => setPage(4)}
            >
              {extraInputs.skills.length ? "NEXT" : "SKIP"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
