import React from "react";

import { Content } from "Components/elements";

import PIC1 from "./gifs/001.png";
import PIC2 from "./gifs/002.png";
import PIC3 from "./gifs/003.png";
import PIC4 from "./gifs/004.png";
import PIC5 from "./gifs/005.png";
import PIC6 from "./gifs/006.png";
import PIC7 from "./gifs/007.png";
import PIC8 from "./gifs/008.png";

import {
  container,
  title_class,
  image_class,
  text_class,
  iframe_container,
} from "./DemoPage.module.css";

let list = [
  {
    image: PIC1,
    title: "01) Go to group",
    text: `Click the "TOP 15 PITCHING COMPETITION" link as marked here.`,
  },
  {
    image: PIC2,
    title: "02) Evaluate startup",
    text: `Each startup on your list should have a button labeled "OIA - VOTING TOP 10". Click this button to start evaluating the company.`,
  },
  {
    image: PIC3,
    title: "3) Evaluation Categories",
    text: `We will now evaluate the concept, team, market and problem. Start by clicking the "concept" button.`,
  },
  {
    image: PIC4,
    title: "4) Go to next category",
    text: `When you get to the bottom of the form, click the "TEAM" button to go to the next category. Keep doing this till you end up at the summary section.`,
  },
  {
    image: PIC5,
    title: "5) Index",
    text: `When you get to the summary section, click the "TOP 15 PITCHING COMPETITION" group to get back to the group overview.`,
  },
  {
    image: PIC6,
    title: "6) Evaluate next startup",
    text: `Choose the next startup you want to evaluate.`,
  },
  {
    image: PIC7,
    title: "Edit evaluation - 1",
    text: `If you want to edit an evaluation you have completed, click the company name.`,
  },
  {
    image: PIC8,
    title: "Edit evaluation - 2",
    text: `Click the "EVALUATIONS" tab, then click the tiny "edit" button on the evaluation.`,
  },
];

export function OIADemoPage({ match }) {
  console.log("demo page....");
  return (
    <div style={{ marginTop: "100px" }}>
      <Content maxWidth={1200} center>
        <h1>EVALUATION WALK-THROUGH FOR OIA</h1>

        <div style={{ paddingTop: "20px", paddingBottom: "50px" }}>
          <div style={{ padding: "10px 0px" }}>
            Here is a brief walk-through of how to evaluate startups for the OIA
            programme.
          </div>

          <div style={{ padding: "10px 0px" }}>
            If you have any questions regarding notata please contact{" "}
            <a href="mailto:jorgen@notata.io">jorgen@notata</a>, or call Jørgen
            on +47 93 93 10 34.
          </div>

          <div style={{ padding: "10px 0px" }}></div>
        </div>

        <div></div>

        <div className={iframe_container}>
          <iframe
            title="Demo video"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/bzbAqhtPqI4"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>

        {list.map(({ title, image, text }, i) => {
          return (
            <div key={i} className={container}>
              <div className={title_class}>{title}</div>

              <div>
                <div className={text_class}>{text}</div>
                <div
                  className={image_class}
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                  }}
                >
                  <img src={image} alt="Screenshot" />
                </div>
              </div>
            </div>
          );
        })}
      </Content>
    </div>
  );
}
