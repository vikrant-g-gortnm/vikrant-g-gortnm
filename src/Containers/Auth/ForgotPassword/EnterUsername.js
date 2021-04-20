import React from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { login } from "definitions.js";
import { useForm } from "react-hook-form";

import { Content, Card, Button } from "Components/elements/";

export function EnterUsername({ done }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    const { username } = data;
    try {
      await Auth.forgotPassword(username);
      console.log("done", username);
      done(username);
    } catch (error) {
      console.log("error", error);
      /* Will not throw errors */
    }
  };

  return (
    <Content maxWidth={600} center>
      <h1>Forgot your password?</h1>
      <Card style={{ paddingBottom: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          <label for="username">Your email</label>
          <input
            type="text"
            placeholder="name@mail.com"
            autoComplete="off"
            ref={register({ required: true })}
            name="username"
            id="username"
          />

          <div className="text-right">
            <Button type="input" value="Log in" loading={isSubmitting} />
          </div>
        </form>

        <div
          style={{
            position: "absolute",
            fontSize: "12px",
            bottom: "-23px",
            left: "2px",
          }}
        >
          <Link to={login}>Login</Link>
        </div>
      </Card>
    </Content>
  );
}
