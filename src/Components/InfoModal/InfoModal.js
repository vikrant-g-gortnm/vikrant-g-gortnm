import React, { useState } from "react";
import styles from "./InfoModal.module.css";
import { Modal } from "Components/elements";

export default function InfoModal({ title, content }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles.question} onClick={() => setShowModal(true)}>
        <i className="fal fa-question-circle" />
      </div>

      {showModal && (
        <Modal
          title={title}
          close={() => setShowModal(false)}
          disableFoot={false}
        >
          <div className={styles.content}>{content}</div>
        </Modal>
      )}
    </>
  );
}
