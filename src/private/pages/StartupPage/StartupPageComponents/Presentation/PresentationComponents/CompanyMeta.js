import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "Components/elements";
import styles from "../PresentationPage.module.css";

export function CompanyMeta({ presentation, setPresentation }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();

  function onSubmit(data, event) {
    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        ...data,
      },
    });

    setShowModal(false);
  }

  return (
    <div>
      <div className={styles.facts_section}>
        <div className={styles.facts_byline}>
          <div className={styles.facts_byline_label}>Company name:</div>
          <div>
            {presentation?.creativeDetails?.name || <span>&nbsp;</span>}
          </div>
        </div>

        <div className={styles.facts_byline}>
          <div className={styles.facts_byline_label}>Location:</div>
          <div>
            {presentation?.creativeDetails?.location || <span>&nbsp;</span>}
          </div>
        </div>

        <div className={styles.facts_byline}>
          <div className={styles.facts_byline_label}>Contact person:</div>
          <div>
            {presentation?.creativeDetails?.contactPerson || (
              <span>&nbsp;</span>
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            left: "-5px",
          }}
        >
          <Button
            size={"small"}
            type={"just_text"}
            onClick={() => setShowModal(true)}
          >
            edit
          </Button>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Company meta"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <label>Company Name</label>
            <input
              type="text"
              placeholder={"name"}
              autoComplete="off"
              ref={register}
              defaultValue={presentation?.creativeDetails?.name}
              id="name"
              name="name"
            />

            <label>Location</label>
            <input
              type="text"
              placeholder={"location"}
              autoComplete="off"
              ref={register}
              defaultValue={presentation?.creativeDetails?.location}
              id="location"
              name="location"
            />

            <label>Contact person</label>
            <input
              type="text"
              placeholder={"contact person"}
              autoComplete="off"
              ref={register}
              defaultValue={presentation?.creativeDetails?.contactPerson}
              id="contactPerson"
              name="contactPerson"
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span />
              <Button type={"submit"} size={"medium"}>
                OK
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
