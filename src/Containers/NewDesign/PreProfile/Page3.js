import React from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

import { Card, Button, MessageBox, Tag } from "Components/elements/";
import styles from "./Profile.module.css";
import Group from "./group/group";

export default function Page3({ setPage, extraInputs, setExtraInputs }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const data = [
    { title: "business angels 1", admin: "Stephanie Wykoff" },
    { title: "business angels 2", admin: "Stephanie Wykoff" },
    { title: "business angels 3", admin: "Stephanie Wykoff" },
    { title: "business angels 4", admin: "Stephanie Wykoff" },
  ];

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
    <div className={styles.profile3}>
      <h1
        style={{
          marginBottom: "50px",
        }}
      >
        Do you want to be a part of these groups?
      </h1>

      {data.map((item, i) => (
        <Group key={i} title={item.title} admin={item.admin} />
      ))}
    </div>
  );
}
