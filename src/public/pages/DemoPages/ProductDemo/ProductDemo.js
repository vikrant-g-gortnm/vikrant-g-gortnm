import React from "react";

import { Content } from "Components/elements";

import { iframe_container } from "./ProductDemo.module.css";

export function ProductDemo({ match }) {
  return (
    <div style={{ marginTop: "100px" }}>
      <Content maxWidth={1200} center>
        <h1>NOTATA PRODUCT DEMO</h1>

        <div style={{ paddingTop: "20px", paddingBottom: "50px" }}>
          <div style={{ padding: "10px 0px" }}>
            Notata is a tool developed by investors in Norway to do two things:
            evaluate startups and to engage our networks.
          </div>

          <div style={{ padding: "10px 0px" }}>
            Below is a series of four short videos that showcase the basic
            features of notata.
          </div>

          <div style={{ padding: "10px 0px" }}></div>
        </div>

        <div></div>

        <h2>Evaluation</h2>
        <div className={iframe_container}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/D90v2nE6P8I"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>

        <h2>Sharing</h2>
        <div className={iframe_container}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/gqFFTX9T-s4"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h2>Startup info</h2>
        <div className={iframe_container}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/U9xyGyrHoRE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h2>Groups</h2>
        <div className={iframe_container}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/-68yYGipTwk"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Content>
    </div>
  );
}
