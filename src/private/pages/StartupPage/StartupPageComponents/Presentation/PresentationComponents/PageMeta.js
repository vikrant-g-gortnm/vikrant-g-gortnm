import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, ErrorBox, SuccessBox } from "Components/elements";
import { pageMetaGet } from "private/Apollo/Queries";
import { useLazyQuery } from "@apollo/client";
import { omit } from "lodash";
import styles from "public/pages/PublicPresentationPage/PublicPresentationPage.module.css";

export function PageMeta({ answer, close, setPageMeta }) {
  const { register, handleSubmit } = useForm();
  const [getPageMeta, { data, error, loading }] = useLazyQuery(pageMetaGet);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let url = answer.val;
    if (url) {
      getPageMeta({ variables: { url } });
    }
  }, [answer]);

  let pageMeta = data?.getPageMeta;

  function handleKeyUp(event) {
    let { value } = event.target;
    setTitle(value === "" ? pageMeta?.title : value);
  }

  function onSubmit() {
    let newPageMeta = {
      ...omit(pageMeta, "__typename"),
      title: title || pageMeta.title,
    };
    setPageMeta(answer.id, newPageMeta);
    close();
  }

  if (loading) {
    return (
      <div>
        <SuccessBox>
          <div style={{ textAlign: "center" }}>
            <div>
              <i className={"fa fa-spinner fa-spin"} />
            </div>
            <div>Surfing the web for page meta</div>
          </div>
        </SuccessBox>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <span />
          <Button size={"medium"} buttonStyle={"secondary"} onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorBox>Sorry. Could not fetch page meta for this url.</ErrorBox>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <span />
          <Button size={"medium"} buttonStyle={"secondary"} onClick={close}>
            OK
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-block",
        padding: "4px",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div className={styles.pageMeta_outer}>
        <a href={pageMeta?.url} target="_blank" rel="noopener noreferrer">
          <div className={styles.pageMeta}>
            <div className={styles.pageMeta_provider}>{pageMeta?.provider}</div>
            <div className={styles.pageMeta_title}>
              {title || pageMeta?.title}
            </div>
            <div className={styles.pageMeta_image}>
              <img src={pageMeta?.image} />
            </div>
          </div>
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
        <label>Change title</label>
        <input
          type="text"
          placeholder={pageMeta?.title}
          autoComplete="off"
          ref={register}
          defaultValue={pageMeta?.title}
          id="title"
          name="title"
          onKeyUp={handleKeyUp}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button size={"medium"} buttonStyle={"secondary"} onClick={close}>
            cancel
          </Button>

          <Button type={"submit"} size={"medium"}>
            OK
          </Button>
        </div>
      </form>
    </div>
  );
}
