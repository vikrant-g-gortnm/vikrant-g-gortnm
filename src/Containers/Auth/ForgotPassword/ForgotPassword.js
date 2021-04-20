import React, { useState } from "react";
import { EnterUsername } from "./EnterUsername";
import { ConfirmUser } from "./ConfirmUser";

export function ForgotPassword({ location }) {
  // const [ enterUsername, setEnterUsername ] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [email, setEmail] = useState();

  if (confirmEmail) return <ConfirmUser email={email} />;
  else
    return (
      <EnterUsername
        location={location}
        done={email => {
          setEmail(email);
          setConfirmEmail(true);
        }}
      />
    );
}
