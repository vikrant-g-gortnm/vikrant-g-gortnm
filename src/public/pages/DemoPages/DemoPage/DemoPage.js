import React from "react";

import { Content } from "Components/elements";

import LOGIN from "./gifs/01_LOGIN_396.gif";
import DASH from "./gifs/02_DASH_396.gif";
import GROUPS from "./gifs/03_GROUPS_396.gif";
import VIEW_STARTUP from "./gifs/04_VIEW_STARTUP_396.gif";
import EVALUATE_STARTUP from "./gifs/05_EVALUATE_STARTUP_396.gif";
import GENERAL from "./gifs/06_GENERAL_396.gif";

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
    image: LOGIN,
    title: "01) Log in",
    text: `Let's log in to Notata!

If you don't already have an account, you can sign up to a new free account here: https://notata.io/signup`,
  },
  {
    image: DASH,
    title: "02) Dashboard",
    text: `When you log in you will be met by your dashboard.

If anyone has shared anything with you it will appear in your "inbox" at the top of the page, like shown here.

Below you have an "add new startup" button as well as a list of all the startups you have looked at (called "deal flow").
    `,
  },
  {
    image: GROUPS,
    title: "3) Groups",
    text: `We can share startups and evaluations in groups.

If someone have shared a startup with you in a group you can add it to your list of startup by clicking "save startup". 

The starup is now in your deal flow and we can start working with it!

    `,
  },
  {
    image: VIEW_STARTUP,
    title: "4) View startup",
    text: `Let's take a look at the startup.

On the startup page you can start working on the startup. In the top section you have the "facts" part that the startup have filled in.

Below that we have the funnel and tags before we get to the evaluation part. We can also see which group this startup belongs to and we can write comments.

    `,
  },
  {
    image: EVALUATE_STARTUP,
    title: "5) Evaluate startup",
    text: `Let's evaluate this startup!

You can evaluate startups based on multiple templates, which in turn will generate a score.

In this example a template has been share with the group, so let's use that one.

    `,
  },
  {
    image: GENERAL,
    title: "6) General",
    text: `You can clean up your workspace by hiding your inbox by clicking "mark all as seen". You have already added the startup to your deal flow, and you can always access your groups by clicking the "Group" tab.

Under settings you can tweak your tags and expand your team. You also have a couple of default evaluation templates that you can play around with.
    `,
  },
];

export function DemoPage({ match }) {
  console.log("demo page....");
  return (
    <div style={{ marginTop: "100px" }}>
      <Content maxWidth={1200} center>
        <h1>NOTATA WALK-THROUGH</h1>

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
            title="NOTATA WIN - demo video"
            src="https://www.youtube.com/embed/PyOVVLZddng"
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
