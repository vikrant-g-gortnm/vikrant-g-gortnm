import React from "react";

import { Content } from "Components/elements";

import SIGNUP from "./gifs/01_signup.gif";
import LOGIN from "./gifs/02_login.gif";
import LOGGEDIN from "./gifs/03_once_logged_in.gif";
import ADD_STARTUP from "./gifs/04_add_startups_to_dealflow.gif";
import VIEW_STARTUP from "./gifs/05_view_startup.gif";
import EVALUATE_STARTUP from "./gifs/06_evaluate.gif";
import CLEAN_UP from "./gifs/07_clean_up.gif";

import {
  container,
  title_class,
  image_class,
  text_class,
  content_class,
  iframe_container,
} from "./DemoPage.module.css";

let list = [
  {
    image: SIGNUP,
    title: "01) Sign up",
    text: `Let's sign up to Notata!

You can sign up to a new free account to Notata here: https://notata.io/signup`,
  },
  {
    image: LOGIN,
    title: "02) Log in",
    text: `When you log in you will have to provide additional information. Fill in, save, and you'll be taken to your dashboard.
    `,
  },
  {
    image: LOGGEDIN,
    title: "3) Logged in",
    text: `When you log in you will be met by your dashboard.

If anyone has shared anything with you it will appear in your "inbox" at the top of the page, like shown here.

Below you have an "add new startup" button as well as a list of all the startups you have looked at (called "deal flow").

    `,
  },
  {
    image: ADD_STARTUP,
    title: "4) Add startups",
    text: `Let's take a look at the group.

In order to work with the starups you have to add them to your deal flow. You can choose which startups you want to add, or you can ann them all at once by clicking the "SAVE ALL STARTUPS TO DEAL FLOW" button.

    `,
  },
  {
    image: VIEW_STARTUP,
    title: "5) View startup",
    text: `By clicking "view" on the startup, you will be taken to the startup page. Here you can add tags, write comments, share etc.

We will focus on the evaluation part for now

    `,
  },
  {
    image: EVALUATE_STARTUP,
    title: "6) Evaluate startup",
    text: `Let's evaluate this startup!

    If you scroll down to the evaluation part, you will see a button labeled "FIRST IMPRESSION TEMPLATE 2020". Click this button to evaluate a startup.

    (If you want to change the evaluation in the future, click the "(edit)" button)
    `,
  },
  {
    image: CLEAN_UP,
    title: "6) General",
    text: `You can clean up your workspace by hiding your inbox by clicking "mark all as seen". You have already added the startups to your deal flow, and you can always access your groups by clicking the "Group" tab.
    `,
  },
];

export function BanDemoPage({ match }) {
  console.log("demo page....");
  return (
    <div style={{ marginTop: "100px" }}>
      <Content maxWidth={1200} center>
        <h1>NOTATA WALK-THROUGH FOR BAN</h1>

        <div style={{ paddingTop: "20px", paddingBottom: "50px" }}>
          <div style={{ padding: "10px 0px" }}>
            Notata is a tool developed by investors in Norway to do two things:
            evaluate startups and share good deals.
          </div>

          <div style={{ padding: "10px 0px" }}>
            The tool is still in its development phase so you will experience
            changes and improvements as you use the tool. Feel free to provide
            us with <a href="mailto:jorgen@notata.io">feedback</a>, wishes and
            suggestions as we depend on the community to make the best possible
            software.
          </div>

          <div style={{ padding: "10px 0px" }}></div>
        </div>

        <div></div>

        <div className={iframe_container}>
          <iframe
            width="100%"
            height="100%"
            title="NOTATA demo ban 2020 video"
            src="https://www.youtube.com/embed/KkZTXW9oe-4"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>

        {list.map(({ title, image, text }, i) => {
          return (
            <div key={i} className={container}>
              <div className={title_class}>{title}</div>

              <div className={content_class}>
                <div className={image_class}>
                  <img src={image} alt="" />
                </div>

                <div className={text_class}>{text}</div>
              </div>
            </div>
          );
        })}
      </Content>
    </div>
  );
}
