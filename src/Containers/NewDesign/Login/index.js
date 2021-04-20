/* eslint-disable */
import React, { useEffect, useState } from "react";
import SocialLogin from 'Components/socialLogin/socialLogin';
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { InputForm, Button } from "Components/UI_Kits";

import { userLoggedIn } from "actions/user";
import { getUserIsLoggedIn } from "reducers/selectors/user";

import { dashboard, forgotPassword, signup } from "definitions.js";
import loginImg from "../../../assets/images/login.svg";
import authLogo from "../../../assets/images/auth_logo.png"

import styles from "../style.module.css";

const getErrorMessage = ({ error }) => {
  console.log(JSON.stringify(error, null, 2));
  return error.message;
};

function LoginComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [SMS_MFA, setSMS_MFA] = useState(false);
  const [signinUser, setSigninUser] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const listForm = ["email", "password"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  console.log(errorMessage);

  const { register, handleSubmit, formState, setValue } = useForm({
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

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

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
    // {s.verified && (
    //   <SuccessBox title="Whoop whoop 🎉" style={{ marginBottom: "35px" }}>
    //     Your email have been verified, so now you are ready to rock'n rumble!
    //   </SuccessBox>
    // )}

    <div className={styles.auth_structure}>
      <div className={styles.auth_structure_left}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.logoContainer}>
              <img
                style={{ width: "40px", height: "40px" }}
                src={authLogo}
                alt="logo"
                className={styles.logo}
              />
              <h1>Login</h1>
            </div>

            <InputForm
              label="Email"
              inputType="email"
              placeholder="Email"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              required
              reference={register({ required: true })}
            />
            <InputForm
              label="Password"
              inputType="password"
              placeholder="Password"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              reference={register({ required: true })}
            />
            <Button
              buttonStyle="gray"
              size="large"
              style={{ marginBottom: "15px" }}
              onClick={() => {
                setValidate(true);
              }}
            > 
              LOGIN
            </Button>
          </form>
          <div
            style={{
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <Link
              to={forgotPassword}
              style={{ textDecoration: "none", color: "#969BA3",fontWeight:'600' }}
            >
              <u>Forgot Password?</u>
            </Link>
          </div>
          <div className={styles.separator}>OR</div>
          <SocialLogin type="Log in" />
          <div
            style={{
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <Link
              to={signup}
              style={{ textDecoration: "none", color: "#969BA3", fontWeight:'500'}}
            >
              Not a member? <u style={{fontWeight:'600'}}>Sign up</u>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.auth_structure_right}>
        <img src={loginImg} alt="auth_image" />
      </div>
    </div>
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
