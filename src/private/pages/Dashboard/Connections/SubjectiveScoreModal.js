import React from "react";
import { Modal, GhostLoader } from "Components/elements";
import { SetSubjectiveScore } from "Components/SetSubjectiveScore/SetSubjectiveScore";
import { useQuery } from "@apollo/client";
import { userGet } from "private/Apollo/Queries";

export default function SubjectiveScoreModal({ connection, close }) {
  // Query user data
  let userQuery = useQuery(userGet);
  let user = userQuery?.data?.userGet;

  return (
    <Modal title="Set subjective score" close={close}>
      {(!user && <GhostLoader />) || (
        <SetSubjectiveScore connection={connection} user={user} />
      )}
    </Modal>
  );
}
