import React from "react";

// API
import { useQuery } from "@apollo/client";
import { userInvitationsGet } from "private/Apollo/Queries";

import { Card } from "Components/elements";

import { ExternalInvitations } from "../Team/Team";

export default function Invitations({ history }) {
  const { data, error, loading } = useQuery(userInvitationsGet);

  if (loading && !data) return <span />;

  if (error) {
    console.log("error", error);
    return <span />;
  }

  let userInvitations = data.userInvitationsGet;

  if (!userInvitations.length) return <span />;

  return (
    <Card label="Invitations" maxWidth={1200} style={{ paddingBottom: "20px" }}>
      <ExternalInvitations userInvitations={userInvitations} />
    </Card>
  );
}
