import React, { useState } from "react";

import { Table, Button, Modal } from "Components/elements";
import ShareSetting from "./ShareSetting";

function AddNewStartup({ group, connections, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const [showShareSettings, setShowShareSettings] = useState(null);

  let [filter, setFilter] = useState("");

  connections = connections.filter(
    c => !(group.startups || []).some(gs => gs.connectionId === c.id)
  );

  if (filter !== "") {
    connections = connections.filter(c =>
      c.creative.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (connections.length > 10) connections.length = 10;

  const columns = [
    {
      title: "Name",
      dataIndex: "creative",
      key: "name",
      render: creative => <span>{(creative || {}).name}</span>,
    },
    {
      title: "",
      key: "add",
      width: 30,
      render: connection => {
        return (
          <Button
            size="small"
            onClick={() => {
              setShowShareSettings(connection);
            }}
          >
            add
          </Button>
        );
      },
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        // top: "-40px",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <Button
        onClick={() => setShowModal(true)}
        type="right_arrow"
        size="large"
        buttonStyle="danger"
      >
        Add startup
      </Button>

      {showModal && (
        <Modal
          title="Add new startup"
          close={() => {
            setShowModal(false);
            setShowShareSettings(null);
          }}
          disableFoot={true}
        >
          {!showShareSettings && (
            <>
              <form className="notata_form" onSubmit={e => e.preventDefault()}>
                <div className="mt3">
                  <input
                    type="text"
                    placeholder="search..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  />
                </div>
              </form>

              <div style={{ padding: "10px 0px 0px 8px" }}>
                <Table
                  dataSource={connections}
                  columns={columns}
                  disableHead={true}
                  pagination={false}
                />
              </div>
            </>
          )}

          {showShareSettings && (
            <>
              <ShareSetting
                group={group}
                connection={showShareSettings}
                mutate={mutate}
                done={() => {
                  setShowModal(false);
                  setShowShareSettings(null);
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "26px",
                  bottom: "33px",
                }}
              >
                <Button
                  buttonStyle="secondary"
                  size="medium"
                  onClick={() => setShowShareSettings(null)}
                >
                  cancel
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

export default AddNewStartup;
