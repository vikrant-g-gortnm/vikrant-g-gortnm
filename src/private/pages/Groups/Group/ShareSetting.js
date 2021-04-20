import React from "react";
import { useForm } from "react-hook-form";

import { share_title, share_description } from "./Group.module.css";

import { Button } from "Components/elements";

function ShareSetting({ group, connection, mutate, done }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let variables = {
      id: group.id,
      input: {
        addStartup: {
          connectionId: connection.id,
          creativeId: connection.creativeId,
          ...data,
        },
      },
    };
    try {
      await mutate({
        variables,
        // update: (proxy, { data: { groupPut } }) => {
        //   const data = proxy.readQuery({
        //     query: groupGet,
        //     variables: { id: group.id },
        //   });
        //
        //   proxy.writeQuery({
        //     query: groupGet,
        //     variables: { id: group.id },
        //     data: {
        //       groupGet: {
        //         ...data.groupGet,
        //         startups: [...data.groupGet.startups, groupPut],
        //       },
        //     },
        //   });
        //
        // },
      });
      done();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className={share_title}>{connection.creative.name}</div>

      <div className={share_description}>
        In addition to the facts part of the startup, what else would you like
        to share with this group?
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="evaluations"
              id="evaluations"
            />
            evaluations
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="subjective_score"
              id="subjective_score"
            />
            subjective score
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="tags"
              id="tags"
            />
            tags
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="comments"
              id="comments"
            />
            comments
          </label>
        </div>

        <div
          style={{
            marginTop: "15px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </form>
    </div>
  );
}

export default ShareSetting;
