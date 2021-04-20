import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { userGet, groupGet } from "private/Apollo/Queries";
import { groupPut } from "private/Apollo/Mutations";

import { group as group_route } from "definitions.js";

import {
  BreadCrumbs,
  Content,
  Card,
  Button,
  GhostLoader,
  SuccessBox,
} from "Components/elements";

export default function GroupSettings({ match, history }) {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const id = match.params.id;

  const [mutate] = useMutation(groupPut);
  const userQuery = useQuery(userGet);
  const groupQuery = useQuery(groupGet, { variables: { id } });

  const hasAllData = groupQuery.data && userQuery.data;
  const error = groupQuery.error || userQuery.error;
  const loading = groupQuery.loading || userQuery.loading;

  if (error) {
    console.log("error", error);
    return <div>We're updaing...</div>;
  }

  if (!hasAllData && loading) {
    return <GhostLoader />;
  }

  const onSubmit = async (settings, event) => {
    let variables = {
      id: group.id,
      input: { settings },
    };

    setSuccess(false);

    try {
      await mutate({ variables });
    } catch (error) {
      return console.log("error", error);
    }

    setSuccess(true);
  };

  const group = groupQuery.data.groupGet;
  const user = userQuery.data.userGet;
  const settings = group.settings || {};
  const isAdmin = group.members.some(
    ({ email, role }) => email === user.email && role === "admin"
  );

  if (!isAdmin) {
    return <div>You are not an admin of this group</div>;
  }

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "All Groups",
            link: `${group_route}`,
          },
          {
            val: `Group: ${group.name}`,
            link: `${group_route}/${id}`,
          },
          {
            val: `Settings`,
            link: `${group_route}/${id}/settings`,
          },
        ]}
      />

      <Content maxWidth={600}>
        <div style={{ marginBottom: "50px" }}>
          <h1>{group.name}</h1>

          <Card style={{ paddingTop: "5px", paddingBottom: "15px" }}>
            <h3>Group settings</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
              <div className="check_container">
                <label>
                  <input
                    type="checkbox"
                    ref={register}
                    name="showScores"
                    id="showScores"
                    defaultChecked={settings.showScores}
                  />
                  Members can see scores.
                </label>
              </div>

              <div className="check_container">
                <label>
                  <input
                    type="checkbox"
                    ref={register}
                    name="showUsers"
                    id="showUsers"
                    defaultChecked={settings.showUsers}
                  />
                  Everyone can see everyone, including individual scores.
                </label>
              </div>

              <div className="check_container">
                <label>
                  <input
                    type="checkbox"
                    ref={register}
                    name="addStartup"
                    id="addStartup"
                    defaultChecked={settings.addStartup}
                  />
                  Allow members to share with group.
                </label>
              </div>

              {/*<div className="check_container">*/}
              {/*  <label>*/}
              {/*    <input*/}
              {/*      type="checkbox"*/}
              {/*      ref={register}*/}
              {/*      name="showScores"*/}
              {/*      id="showScores"*/}
              {/*      defaultChecked={settings.showScores}*/}
              {/*    />*/}
              {/*    List individual scores.*/}
              {/*  </label>*/}
              {/*</div>*/}

              <div
                style={{
                  marginTop: "15px",
                  textAlign: "right",
                }}
              >
                <Button type="input" value="SAVE" loading={isSubmitting} />
              </div>
            </form>
          </Card>

          {success && <SuccessBox>Settings successfully saved</SuccessBox>}
        </div>
      </Content>
    </>
  );
}
