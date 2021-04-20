// Changed By : Siva
// Date : 2/04/2021

import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Content, SuccessBox } from "Components/elements/";

export const SignOut = () => {
  const [signOut, setSignOut] = useState(false);
  const [signOutError, setSignOutError] = useState(false);

  useEffect(() => {
    Auth.signOut()
      .then(() => {
        setSignOut(true);
      })
      .catch(() => {
        setSignOutError(true);
      });
  }, []);

  return (
    <Content center maxWidth={600}>
      <SuccessBox title="Bye bye 😭">You have been logged out!</SuccessBox>
      <div className="text-right">
        <a href="/login">Log in</a>
      </div>
    </Content>
  );
};
