import React, { useEffect, useState, useRef } from "react";

// Components
import Question from "./Question";
import { Collapsable } from "Components/UI_kit/";

// Styles
import styles from "./TemplatedForm.module.css";

// *****************
// * Main function *
// *****************
export default function Section({ section, answers, setAnswers, open }) {
  // States
  const [isOpen, setIsOpen] = useState(true);

  const myRef = useRef(null);

  // If opened from outside of component
  useEffect(() => {
    if (open) {
      setIsOpen(open);

      // Scroll to element
      let el = myRef.current;
      let offset = 45;
      let pos = el.getBoundingClientRect().top;
      let offsetPosition = pos - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [open]);

  // Definitions
  const { name, description } = section;
  const questions = section.questions || [];

  return (
    <div className={styles.section_container} ref={myRef}>
      <div className={styles.section_title_container}>
        <div
          className={styles.section_title_icon}
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa fa-chevron-${isOpen ? "up" : "down"}`} />
        </div>

        <div
          className={styles.section_title}
          onClick={() => setIsOpen(!isOpen)}
        >
          {name}
        </div>
      </div>

      {isOpen && (
        <div className={styles.section_content}>
          {/* Section description */}
          {description && (
            <div className={styles.section_description}>{description}</div>
          )}

          {/* List of questions */}
          {questions.map(question => (
            <Question
              key={question.id}
              section={section}
              question={question}
              answers={answers}
              setAnswers={setAnswers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
