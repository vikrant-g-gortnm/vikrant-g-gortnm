import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Modal } from "Components/elements";
import styles from "../PresentationPage.module.css";

export function ExternalLinks({ presentation, setPresentation }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();

  let defaultDeck = "";
  let defaultWebsite = "";
  let externalLinks = presentation?.creativeDetails?.externalLinks || [];

  for (let { key, val } of externalLinks) {
    if (val === "website") {
      defaultWebsite = key;
    }
    if (val === "pitch deck") {
      defaultDeck = key;
    }
  }

  function onSubmit(data, event) {
    let newLinks = [];
    for (let key in data) {
      if (data[key] && data[key] !== "") {
        newLinks.push({
          key: data[key],
          val: key,
        });
      }
    }

    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        externalLinks: newLinks,
      },
    });

    setShowModal(false);
  }

  return (
    <div className={styles.infoBox}>
      <Card
        label={"Links"}
        style={{
          paddingBottom: "20px",
          height: "110px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.infoBoxInner}>
          <div>
            {externalLinks.map(({ key, val }) => (
              <div key={val}>
                <a href={key} target="_blank" rel="noopener noreferrer">
                  <Button
                    style={{ width: "100%" }}
                    iconClass={"fal fa-external-link"}
                    size={"small"}
                  >
                    {val}
                  </Button>
                </a>
              </div>
            ))}

            {(!externalLinks.length && (
              <Button size={"small"} onClick={() => setShowModal(true)}>
                set
              </Button>
            )) || (
              <div className={styles.small_edit_button}>
                <Button type={"just_text"} onClick={() => setShowModal(true)}>
                  edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {showModal && (
        <Modal
          title="Set links"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <input
              type="text"
              placeholder={"website"}
              autoComplete="off"
              ref={register}
              defaultValue={defaultWebsite}
              id="website"
              name="website"
            />

            <input
              type="text"
              placeholder={"pitch deck"}
              autoComplete="off"
              ref={register}
              defaultValue={defaultDeck}
              id="pitch_deck"
              name="pitch deck"
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
