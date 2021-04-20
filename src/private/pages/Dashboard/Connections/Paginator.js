import React from "react";

// API
import { useQuery } from "@apollo/client";
import { connectionPagesGet } from "private/Apollo/Queries";

import styles from "./Paginator.module.css";

export default function Paginator({ currentPage, setCurrentPage }) {
  const { data, loading } = useQuery(connectionPagesGet);

  // Loader
  if (loading) {
    return <div>loading</div>;
  }

  const currentPageNo = (currentPage && currentPage.pageNo) || 1;

  // Data
  let pages = data?.connectionPagesGet;

  return (
    <div className={styles.container}>
      <span>Page</span>
      <i
        className="fa fa-chevron-left"
        onClick={() => {
          let prevPage = pages.find(
            ({ pageNo }) => pageNo === currentPageNo - 1
          );
          setCurrentPage(prevPage);
        }}
      />
      <input
        type="text"
        value={currentPageNo}
        onFocus={e => e.target.select()}
        onChange={e => {
          let val = e.target.value;
          let selectedPage = pages.find(
            ({ pageNo }) => pageNo === parseInt(val)
          );
          if (selectedPage) {
            setCurrentPage(selectedPage);
          }
        }}
      />

      <span> of </span>
      <span>1</span>
      {/* <span>{pages.length + 1}</span> */}
      <i
        className="fa fa-chevron-right"
        onClick={() => {
          let nextPage = pages.find(
            ({ pageNo }) => pageNo === currentPageNo + 1
          );
          nextPage && setCurrentPage(nextPage);
        }}
      />
    </div>
  );
}
