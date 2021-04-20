import React from "react";
import style from "./Navigation.module.css";

export default function Navigation({ sections, history, location }) {
  let { pathname } = location;

  return (
    <div className={style.container}>
      <div className={style.content}>
        <ul>
          {sections.map((section, i) => (
            <li
              key={i}
              onClick={() => {
                history.push(`${pathname}#${section.id}`);
              }}
            >
              {section.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
