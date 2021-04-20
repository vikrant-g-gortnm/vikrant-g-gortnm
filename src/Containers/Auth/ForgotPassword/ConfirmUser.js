import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "definitions.js";
import {
  Content,
  Card,
  Button,
  SuccessBox,
  ErrorBox,
} from "Components/elements/";

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function ConfirmUser({ email }) {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const ids = {
    form: makeid(8),
    code: makeid(8),
    password: makeid(8),
  };

  const onSubmit = async (data, event) => {
    // const { code, password } = data;
    const code = data[ids.code];
    const password = data[ids.password];

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      setSuccessMessage("New password has been reset. You can now log in!");
      setErrorMessage(null);
    } catch (error) {
      console.log("failed with error", error);
      setErrorMessage("Something went wrong...");
      setSuccessMessage(null);
    }
  };

  return (
    <Content maxWidth={600} center>
      <h1>Set new password</h1>

      {!successMessage && (
        <Card style={{ paddingBottom: "20px" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="notata_form"
            name={ids.form}
            id={ids.form}
          >
            <label for={ids.code}>Code sent to your mail</label>
            <input
              type="text"
              placeholder="Code"
              ref={register({ required: true })}
              autoComplete="off"
              name={ids.code}
              id={ids.code}
            />

            <label for={ids.password}>Your new password</label>
            <input
              type="password"
              placeholder="Shh... it's a secret..."
              ref={register({ required: true })}
              autoComplete="off"
              name={ids.password}
              id={ids.password}
            />

            <div className="text-right">
              <Button
                type="input"
                value="Set password"
                loading={isSubmitting}
              />
            </div>
          </form>
        </Card>
      )}

      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}

      {successMessage && (
        <>
          <SuccessBox>{successMessage}</SuccessBox>
          <div>
            <Link to={login}>Log in</Link>
          </div>
        </>
      )}
    </Content>
  );
}
