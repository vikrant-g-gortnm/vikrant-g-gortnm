import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { groupGet } from "private/Apollo/Queries";

import validateEmail from "utils/validateEmail";

import { Button, Modal } from "Components/elements";

function AddNewMember({ group, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const emailForm = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });

  const [changeGroupName, setChangeGroupName] = useState(
    group.members.some(m => m.email === group.name)
  );

  const onSubmitInvite = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    let variables = {
      id: group.id,
      input: { addMember: email },
    };
    try {
      await mutate({ variables });
      event.target.reset();
      setShowModal(false);
    } catch (error) {
      return console.log("error", error);
    }
  };

  const onSubmitGroupName = async (data, event) => {
    let variables = {
      id: group.id,
      input: { name: data.name },
    };

    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupGet,
            variables: { id: group.id },
          });

          proxy.writeQuery({
            query: groupGet,
            variables: { id: group.id },
            data: {
              groupGet: {
                ...data.groupGet,
                ...data.groupPut,
              },
            },
          });
        },
      });
      event.target.reset();
      setChangeGroupName(null);
    } catch (error) {
      return console.log("error", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        top: "-40px",
      }}
    >
      <div className="text-right">
        <Button onClick={() => setShowModal(true)} type="just_text">
          + invite new member
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Invite new member"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          {changeGroupName && (
            <div>
              <div>
                Before adding a new member to this group we should change the
                group name, as all members will be able to see it.
              </div>
              <form
                className="notata_form"
                onSubmit={handleSubmit(onSubmitGroupName)}
              >
                <div className="mt3">
                  <input
                    type="text"
                    placeholder="Group name"
                    autoComplete="off"
                    ref={register({ required: true })}
                    name="name"
                  />
                  <div
                    style={{
                      marginTop: "5px",
                      textAlign: "right",
                    }}
                  >
                    <Button type="input" value="OK" loading={isSubmitting} />
                  </div>
                </div>
              </form>
            </div>
          )}

          {!changeGroupName && (
            <form
              className="notata_form"
              onSubmit={emailForm.handleSubmit(onSubmitInvite)}
            >
              <div className="mt3">
                <input
                  type="text"
                  placeholder="name@email.com"
                  autoComplete="off"
                  ref={emailForm.register()}
                  name="email"
                />
                {emailForm.errors && emailForm.errors.email && (
                  <p style={{ color: "red" }}>must be a valid email address</p>
                )}
                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    type="input"
                    value="OK"
                    loading={emailForm.formState.isSubmitting}
                  />
                </div>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

export default AddNewMember;
