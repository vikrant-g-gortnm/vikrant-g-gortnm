import React, { useState } from "react";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import { Content } from "Components/elements/";
import classnames from "classnames";
import styles from "./Profile.module.css";

function Dots({ page, setPage }) {
  let pages = [1, 2, 3, 4];
  return (
    <div className={styles.dots_container}>
      {pages.map(n => (
        <div
          key={n}
          className={classnames(styles.dot, page >= n && styles.dot_active)}
        ></div>
      ))}
    </div>
  );
}

export default function PreProfile({ history }) {
  const [page, setPage] = useState(1);
  const [extraInputs, setExtraInputs] = useState({ interests: [], skills: [] });

  return (
    <Content
      maxWidth={600}
      style={{
        padding: "20px",
        marginTop: "-20px",
      }}
    >
      {page === 1 && <Page1 history={history} setPage={setPage} />}

      {page === 2 && (
        <Page2
          extraInputs={extraInputs}
          setExtraInputs={setExtraInputs}
          setPage={setPage}
        />
      )}

      {page === 3 && (
        <Page3
          extraInputs={extraInputs}
          setExtraInputs={setExtraInputs}
          setPage={setPage}
        />
      )}

      {page === 4 && (
        <Page4 extraInputs={extraInputs} history={history} setPage={setPage} />
      )}

      <Dots page={page} setPage={setPage} />
    </Content>
  );
}

// const [mutate] = useMutation(userUpdate);
// // let { input } = data;
// // try {
// //   await mutate({ variables: { input } });
// // } catch (error) {
// //   console.log("error", error);
// // }
// // history.push(dashboard);

// // API STUFF
// import { useMutation } from "@apollo/client";
// import { userUpdate } from "Apollo/Mutations";
// import { dashboard } from "definitions.js";
// import { omit } from "lodash";
