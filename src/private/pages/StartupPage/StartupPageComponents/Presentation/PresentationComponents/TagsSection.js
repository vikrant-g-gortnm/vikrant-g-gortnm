import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Modal, Tag } from "Components/elements";
import styles from "../PresentationPage.module.css";

export function TagsSection({ presentation, setPresentation }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();
  let _tags = presentation?.tags || [];

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.keyCode === 188) {
      let val = e.target.value;
      if (val === "") return;
      setPresentation({
        ...presentation,
        tags: [...(_tags || []), e.target.value],
      });
      e.target.value = "";
    }
  }

  function handleKeyUp(e) {
    let val = e.target.value;
    if (val === ",") {
      e.target.value = "";
    }
  }

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Card label={"Tags"} style={{ paddingBottom: "20px" }}>
        <div>
          {_tags.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>

        {(!_tags.length && (
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
      </Card>

      {showModal && (
        <Modal
          title="Set tags"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form
            className="notata_form"
            onSubmit={handleSubmit(onSubmit)}
            // style={{ marginBottom: "20px" }}
          >
            <label for="tags">Separate with comma</label>
            <input
              type="text"
              placeholder={"I.e. Ocean-tech, female founders, software"}
              autoComplete="off"
              ref={register}
              id="tags"
              name="tags"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />

            <div>
              {_tags.map((t, i) => (
                <Tag
                  key={i}
                  kill={() => {
                    setPresentation({
                      ...presentation,
                      tags: _tags.filter(it => it !== t),
                    });
                  }}
                >
                  {t}
                </Tag>
              ))}
            </div>
          </form>

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span />
            <Button
              size={"medium"}
              onClick={() => {
                setShowModal(false);
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
