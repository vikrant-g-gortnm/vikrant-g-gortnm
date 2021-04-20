import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import {
  Content,
  Card,
  Button,
  SuccessBox,
  ErrorBox,
} from "Components/elements/";

import { userLoggedIn } from "actions/user";
import { getUserIsLoggedIn } from "reducers/selectors/user";

import { dashboard, forgotPassword } from "definitions.js";
import styles from "../Auth.module.css";

const getErrorMessage = ({ error }) => {
  console.log("getErrorMessage");
  console.log(JSON.stringify(error, null, 2));

  // let { code } = error;

  // let defaultError = "Yo, something went wrong, innit";

  // let codeMap = {
  //   NotAuthorizedException: "Email and password does not match",
  // };

  // let errorMessage = codeMap[code] || defaultError;

  // return errorMessage;

  return error.message;
};

function LoginComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  // console.log('*** LoginComp')

  const [SMS_MFA, setSMS_MFA] = useState(false);
  const [signinUser, setSigninUser] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { register, handleSubmit, formState, setValue, errors } = useForm({
    resolver: SMS_MFA
      ? undefined
      : yupResolver(
          yup.object().shape({
            email: yup.string().email().required(),
          })
        ),
  });

  const { isSubmitting, isSubmitted } = formState;
  const s = queryString.parse(location.search);

  useEffect(() => {
    const { email } = s;
    if (!isSubmitted && !isSubmitting && email) {
      setValue("email", email);
    }
  }, [s, setValue, isSubmitting, isSubmitted]);

  const onSubmit = async (data, event) => {
    event.preventDefault();

    if (signinUser && SMS_MFA) {
      try {
        const loggedUser = await Auth.confirmSignIn(
          signinUser,
          data.code.trim(),
          "SMS_MFA"
        );
        userLoggedIn(loggedUser);
      } catch (error) {
        setErrorMessage("The code doesn't seem to match...");
      }
    }

    if (!signinUser && !SMS_MFA) {
      let email = data.email.trim().toLowerCase();
      try {
        let signinUser = await Auth.signIn(email, data.password);
        setSigninUser(signinUser);
        if (signinUser.challengeName === "SMS_MFA") {
          return setSMS_MFA(true);
        }
        userLoggedIn(signinUser);
      } catch (error) {
        setErrorMessage(getErrorMessage({ error }));
      }
    }
  };

  if (userIsLoggedIn) {
    history.push(location.state || dashboard);
  }

  return (
    <Content maxWidth={600} center>
      <h1>Log in</h1>

      {s.verified && (
        <SuccessBox title="Whoop whoop 🎉" style={{ marginBottom: "35px" }}>
          Your email have been verified, so now you are ready to rock'n rumble!
        </SuccessBox>
      )}

      <Card style={{ paddingBottom: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          {!SMS_MFA && (
            <div>
              <label for="email">Email</label>
              <input
                type="text"
                placeholder="email"
                ref={register({ required: true })}
                name="email"
                id="email"
              />
              {errors && errors.email && (
                <p className={styles.error}>that email does not look valid</p>
              )}

              <label for="password">Password</label>
              <input
                type="password"
                placeholder="password"
                ref={register({ required: true })}
                name="password"
                id="password"
              />
            </div>
          )}

          {signinUser && SMS_MFA && (
            <div>
              <label for="code">SMS code</label>
              <input
                type="text"
                placeholder="SMS code"
                ref={register({ required: true })}
                name="code"
                id="code"
              />
            </div>
          )}

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
          <Link to={forgotPassword}>I forgot my password</Link>
        </div>
      </Card>

      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
    </Content>
  );
}

export const Login = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  }),
  {
    userLoggedIn,
  }
)(LoginComp);
