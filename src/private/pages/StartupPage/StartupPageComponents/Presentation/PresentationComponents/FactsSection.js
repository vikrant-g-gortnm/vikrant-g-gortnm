import React from "react";
import { Card } from "Components/elements";
import { AnswerSection } from "./AnswerSection";
import styles from "../PresentationPage.module.css";

export function FactsSection({ presentation, setPresentation }) {
  let sections = presentation?.creativeDetails?.sections || [];

  function moveSectionUp(section) {
    let newSections = sections.map((s, i) => {
      if (section.index === 0) return s;
      if (s.name === section.name) {
        let item = {
          ...s,
          index: section.index - 1,
        };
        return item;
      }
      if (s.index === section.index - 1) {
        let item = {
          ...s,
          index: section.index + 1,
        };
        return item;
      }
      return s;
    });
    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        sections: newSections,
      },
    });
  }

  function moveSectionDown(section) {
    let newSections = sections.map(s => {
      if (section.index === sections.length - 1) {
        return s;
      }
      if (s.name === section.name) {
        let item = {
          ...s,
          index: section.index + 1,
        };
        return item;
      }
      if (s.index === section.index + 1) {
        return {
          ...s,
          index: s.index - 1,
        };
      }
      return s;
    });
    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        sections: newSections,
      },
    });
  }

  return (
    <div>
      {sections
        .filter(section => section?.answers?.length)
        .sort((a, b) => a.index - b.index)
        .map((section, i) => (
          <Card
            label={section.name}
            key={`section-${i}`}
            style={{
              paddingLeft: "45px",
            }}
          >
            <div className={styles.section_movers}>
              {section.index !== 0 && (
                <div
                  className={styles.section_mover}
                  onClick={() => {
                    moveSectionUp(section);
                  }}
                >
                  <i className={"fas fa-arrow-alt-up"} />
                </div>
              )}

              {section.index < sections.length - 1 && (
                <div
                  className={styles.section_mover}
                  onClick={() => {
                    moveSectionDown(section);
                  }}
                >
                  <i className={"fas fa-arrow-alt-down"} />
                </div>
              )}
            </div>

            <AnswerSection
              section={section}
              answers={section.answers || []}
              presentation={presentation}
              setPresentation={setPresentation}
            />
          </Card>
        ))}
    </div>
  );
}
