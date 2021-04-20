/* eslint-disable */
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Instructor } from "../EmailSentPage/index";
import { useForm } from "react-hook-form";
import { InputForm, Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";
import FloatingLoginButtons from 'Components/floatingLoginButtons/floatingLoginButtons';

export function ForgotPassword({ done }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const listForm = ["password", "confirmPassword"];

  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);
  const [emailSent, SetEmail] = useState(false);

  const setNextFlag = index => {
    setPosition(index === "email" ? 1 : 0);
  };

  const onSubmit = async (data, event) => {
    const { email } = data;
    try {
      await Auth.forgotPassword(email);
      SetEmail(email);
    } catch (error) {
      console.log("error", error);
      /* Will not throw errors */
    }
  };

  return (
    <>
      {emailSent ? (
        <Instructor email={emailSent} />
      ) : (
        <div className={styles.auth_structure}>
          <div className={styles.auth_structure_left}>
          <div className={styles.mainContent}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.logoContainer}>
                  <img
                    style={{ width: "40px", height: "40px", marginBottom:'15px' }}
                    src={notata}
                    alt="logo"
                    className={styles.logo}
                  />
                  <h1>Forgot your password?</h1>
                  <p style={{margin:'25px 0', lineHeight:'18.05px', fontSize:'15px', color:'#969BA3'}}>
                    please enter your email and we'll find your account and then
                    you will receive instructions on your email to rest your
                    password
                  </p>
                </div>
                <div style={{ marginTop: "20px" }}>
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

                  <Button
                    buttonStyle="secondary"
                    size="large"
                    buttonStyle="green"
                    style={{ marginBottom: "15px" }}
                    onClick={validate}
                    loading={isSubmitting}
                  >
                    {" "}
                    SEND INSTRUCTIONS
                  </Button>
                </div>
              </form>
            </div>
          
          </div>
          <div className={styles.auth_structure_right}>
            <img src={man_standing} alt="man_standing"/>
          </div>
          <FloatingLoginButtons />
          
        </div>
      
      )}
    </>
  );
}
