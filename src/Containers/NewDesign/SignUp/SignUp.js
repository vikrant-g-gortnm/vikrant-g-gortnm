/* eslint-disable */
import React, { useState } from "react";
import SocialLogin from 'Components/socialLogin/socialLogin';
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { InputForm, Button } from "Components/UI_Kits";

import { Content, Card, SuccessBox, ErrorBox } from "Components/elements/";
import { userLoggedIn } from "actions/user";
import { getUserIsLoggedIn } from "reducers/selectors/user";

import { dashboard, awaiting, login } from "definitions.js";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";

function SignupComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const listForm = ["email", "password", "confirmPassword"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
      })
    ),
  });
  const { isSubmitting } = formState;

  if (userIsLoggedIn) {
    history.push(location.state || dashboard);
  }

  function onSubmit(data) {
    let { email, password } = data;

    email = email.toLowerCase().trim();

    setIsLoading(true);
    Auth.signUp({
      username: email,
      password,
      attributes: { email },
    })
      .then(res => {
        let path = `${awaiting}?=awaitingConfirm=true&email=${encodeURIComponent(
          email
        )}`;
        history.push(path);
        setIsLoading(false);
      })
      .catch(error => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  return (
    <div className={styles.auth_structure}>
      <div className={styles.auth_structure_left}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.logoContainer}>
              <img
                style={{ width: "40px", height: "40px" }}
                src={notata}
                alt="logo"
                className={styles.logo}
              />
              <h1>Sign up</h1>
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
              required={true}
            />
            <InputForm
              label="Confirm Password"
              inputType="password"
              placeholder="Password"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              reference={register({ required: true })}
              passwordConfirm="true"
              required={true}
              errorMessage="Password do not match"
            />
            <Button
              size="large"
              buttonStyle="gray"
              style={{ marginBottom: "5px" }}
              onClick={validate}
            >
              {" "}
              SIGN UP
            </Button>
          </form>
          <div className={styles.separator}>OR</div>
          <SocialLogin type="Sign up" />
          <div
            style={{
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <Link
              to={login}
              style={{ textDecoration: "none", color: "#969BA3" }}
            >
              Already on Notata? <u style={{fontWeight:'600'}}>Sign in</u>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.auth_structure_right}>
        <img src={man_standing} alt="auth_image" />
      </div>
    </div>
  );
}

export const Signup = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  }),
  {
    userLoggedIn,
  }
)(SignupComp);
