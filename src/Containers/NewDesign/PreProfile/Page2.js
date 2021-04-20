import React from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

import { Button, CheckBoxes, Tags } from "Components/UI_Kits";
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
      <h1>What are you looking for?</h1>
      <h4>Investment opportunities</h4>

      <form
        className="notata_form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ marginBottom: "20px" }}
      >
        <Tags
          optionalTxt="write or choose up to 3 tags"
          title="xxx"
          suggested={true}
          heading={false}
          title="domain"
          items={[]}
        />
        <h4>Main geography</h4>
        <Tags
          optionalTxt="write or choose up to 3 tags"
          title="xxx"
          suggested={true}
          heading={false}
          title="domain"
          items={[]}
        />
        <h4>Stage</h4>
        <CheckBoxes
          data={[
            { id: 1, value: "Pre seed", label: "Pre seed" },
            { id: 2, value: "Seed", label: "Seed" },
            { id: 3, value: "Series A+", label: "Series A+" },
          ]}
        />
      </form>
      <div className={styles.bottom_box}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        ></div>
      </div>
    </div>
  );
}
