import React from "react";

import Sharings from "./Sharings";
import Invitations from "./Invitations";

import { Content } from "Components/elements";
import { History } from "history";
import Connections from "private/pages/Dashboard/Connections/Connections";

export default function DashboardPage({ history }: { history: History }) {
  return (
    <Content maxWidth={1200}>
      {/*<Invitations history={history} />*/}
      {/*<Sharings history={history} />*/}
      <Connections history={history} />
    </Content>
  );
}
