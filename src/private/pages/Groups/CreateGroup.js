import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "Components/elements";

const CreateNewGroup = ({ setDone, mutate }) => {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let { variables } = data;
    try {
      let res = await mutate({ variables });
      let item = res.data.groupPut;
      setDone(item.id);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt3">
        <input
          type="text"
          placeholder={`I.e. "Business Angels London"`}
          autoComplete="off"
          ref={register({ required: true })}
          name="variables.input.name"
        />

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default CreateNewGroup;
