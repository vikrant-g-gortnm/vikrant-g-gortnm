import React from "react";
import { Funnel } from "Components/Funnel/Funnel";

import { Modal } from "Components/elements";

export default function SetFunnelScore({ connection, close }) {
  return (
    <Modal title="Set Funnel score" close={close}>
      <Funnel connection={connection} />
    </Modal>
  );
}
