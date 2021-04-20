import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { evaluationTemplatePut } from "private/Apollo/Mutations";

import { AutoHeightTextarea } from "Components/elements";

function TemplateInfo({ template }: { template: any }) {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { name, description } = template;

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  }, [name, description]);

  const onSubmit = async (data: any, event: any) => {

    let variables = {
      id: template.id,
      ...data,
    };
    try {
      await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationTemplatePut: {
            ...template,
            ...data.input,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="focus_form mb3" onSubmit={handleSubmit(onSubmit)}>
      <AutoHeightTextarea
        className="form_h1"
        rows={1}
        placeholder='I.e. "Early stage evaluations"'
        name="input.name"
        refObj={register}
        onBlur={handleSubmit(onSubmit)}
      />
      <AutoHeightTextarea
        className="form_p1"
        rows={1}
        placeholder='I.e. "Template for evaluating early stage startups"'
        name="input.description"
        refObj={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

export default TemplateInfo;
