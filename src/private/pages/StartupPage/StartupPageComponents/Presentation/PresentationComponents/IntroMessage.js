import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Button, Card, Modal } from "Components/elements";
import styles from "../PresentationPage.module.css";

export function IntroMessage({ presentation, setPresentation }) {
  const { register, handleSubmit } = useForm();

  const [showModal, setShowModal] = useState(false);

  function onSubmit({ message }, event) {
    setPresentation({
      ...presentation,
      message,
    });

    setShowModal(false);
  }

  return (
    <div>
      <Card label="Introduction" style={{ paddingBottom: "20px" }}>
        <div>{presentation?.message}</div>

        {((!presentation?.message || presentation?.message === "") && (
          <Button size="small" onClick={() => setShowModal(true)}>
            set
          </Button>
        )) || (
          <div className={styles.small_edit_button}>
            <Button type="just_text" onClick={() => setShowModal(true)}>
              edit
            </Button>
          </div>
        )}
      </Card>

      {showModal && (
        <Modal
          title="Introduction message"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <textarea
              rows={12}
              style={{ resize: "none" }}
              placeholder="message"
              autoComplete="off"
              defaultValue={presentation?.message}
              ref={register}
              id="message"
              name="message"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span />
              <Button type="submit" size="medium">
                OK
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
