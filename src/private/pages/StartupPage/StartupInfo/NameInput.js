import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// API
import { useMutation } from "@apollo/client";
import { creativePut } from "private/Apollo/Mutations";

// *****************
// * Main function *
// *****************
export default function NameInput({ creativeId, name }) {
  // Mutations
  const [mutate] = useMutation(creativePut);

  // Form
  const { register, handleSubmit, setValue } = useForm();

  // Set form value from props
  useEffect(() => {
    if (name) {
      setValue("input.name", name);
    }
  }, [name]);

  // Handle submit
  const onSubmit = async data => {
    try {
      let variables = { id: creativeId, ...data };
      await mutate({ variables });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="focus_form"
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginBottom: "20px" }}
    >
      <textarea
        className="form_h1"
        rows={1}
        placeholder="Company name"
        name="input.name"
        defaultValue={name}
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}
