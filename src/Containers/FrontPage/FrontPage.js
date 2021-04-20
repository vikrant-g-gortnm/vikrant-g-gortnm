import React, { useRef } from "react";

import {
  container,
  subline,
  login_class,
  about_section,
} from "./FrontPage.module.css";

import classnames from "classnames";
import { login } from "definitions.js";
import { Link } from "react-router-dom";

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);

export const FrontPage = () => {
  const myRef = useRef(null);

  return (
    <div>
      <div
        className={classnames(container)}
        style={{
          background: `linear-gradient(#52a99e, #2f6e7b)`,
        }}
      >
        <div
          onClick={() => scrollToRef(myRef)}
          style={{
            position: "absolute",
            cursor: "pointer",
            color: "white",
            top: "14px",
            left: "18px",
          }}
        >
          about
        </div>

        <div style={{ position: "relative", top: "-50px" }}>
          <h1>notata</h1>
          <div className={subline}>for investors and startups</div>
        </div>

        <Link className={login_class} to={login}>
          <i className="fal fa-fingerprint" />
        </Link>
      </div>

      <div
        style={{
          background: "#2f6e7b",
          borderTop: "1px dashed rgba(255,255,255,0.2)",
          textAlign: "center",
          padding: "25px",
          paddingTop: "100px",
          paddingBottom: "100px",
          color: "white",
        }}
        ref={myRef}
      >
        <div className={about_section}>
          <h1>About</h1>

          <p>
            Notata is a software where investors can evaluate startups and share
            deals.
          </p>

          <p>
            The software was developed for a small Norwegian family office that
            struggled to find the right tools to help them evaluate startups in
            a structured way. As an early stage investor it was also important
            to be able to share good deals with other investors in the network.
          </p>

          <p>
            Our system is designed to be the first part of your funnel, and will
            smothly integrate with your favorite softwares, making it dead easy
            to share information betweem systems.
          </p>

          <p>
            We aim to be a networking platform for investors, where people can
            safely share sensitive information with people in their network.
          </p>

          <p>
            If you are interested please drop us a line so that we can show you
            a demo.
          </p>

          <p>
            Ane Nordahl Carlsen, CEO
            <br />
            ane@notata.io
          </p>
        </div>
      </div>
    </div>
  );
};
