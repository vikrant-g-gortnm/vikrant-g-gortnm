import React, { useState, useEffect } from "react";

//styles
import styles from "./Dropdown.module.css";
import classnames from "classnames";

// const useKeyPress = function(targetKey) {
//   const [keyPressed, setKeyPressed] = useState(false);

//   function downHandler({ key }) {
//     if (key === targetKey) {
//       setKeyPressed(true);
//     }
//   }

//   const upHandler = ({ key }) => {
//     if (key === targetKey) {
//       setKeyPressed(false);
//     }
//   };

//   React.useEffect(() => {
//     window.addEventListener("keydown", downHandler);
//     window.addEventListener("keyup", upHandler);

//     return () => {
//       window.removeEventListener("keydown", downHandler);
//       window.removeEventListener("keyup", upHandler);
//     };
//   });

//   return keyPressed;
// };

//  const items = [
//   { id: 1, name: "Josh Weir" },
//   { id: 2, name: "Sarah Weir" },
//   { id: 3, name: "Alicia Weir" },
//   { id: 4, name: "Doo Weir" },
//   { id: 5, name: "Grooft Weir" }
// ];

// const ListItem = ({ item, active, setSelected, setHovered }) => (
//   <div
//     className={`item ${active ? "active" : ""}`}
//     onClick={() => setSelected(item)}
//     onMouseEnter={() => setHovered(item)}
//     onMouseLeave={() => setHovered(undefined)}
//   >
//     {item.name}
//   </div>
// );

/*export function Dropdown({ title}){
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);
  const [isListOpen, setListOpen] = useState(false);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor(prevState =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
 useEffect(() => {
    if (items.length && enterPress) {
      setSelected(items[cursor]);
    }
  }, [cursor, enterPress]); 
  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);

  return (
    <div>
      <p>
        <small>
          Use up down keys and hit enter to select, or use the mouse
        </small>
      </p>
      <span>Selected: {selected ? selected.name : "none"}</span>
      {items.map((item, i) => (
        <ListItem
          key={item.id}
          active={i === cursor}
          item={item}
          setSelected={setSelected}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
};
 */

// Main function
export function Dropdown({ title, items = [] }) {
  // States
  const [isListOpen, setListOpen] = useState(false);

  return (
    <div className={styles.dd_wrapper}>
      <div
        role="button"
        className={styles.dd_header}
        onClick={() => {
          setListOpen(!isListOpen);
        }}
      >
        <div className={styles.dd_header_title}>{title}</div>

        {isListOpen ? (
          <i className={classnames("fal fa-angle-up ", styles.i_icon)} />
        ) : (
          <i className={classnames("fal fa-angle-down", styles.i_icon)} />
        )}
      </div>

      {isListOpen && (
        <div role="list" className={styles.dd_list}>
          {/*   <span>Selected: {selected ? selected.name : "none"}</span>  */}
          {items.map(item => (
            <button
              className={styles.dd_list_item}
              key={item.id}
              /*  active={i === cursor}
              item={item}
              setSelected={setSelected}
              setHovered={setHovered} */
              type="button"
              onClick={() => {
                setListOpen(!isListOpen);
              }}
            >
              {item.title}
              {/* {item.selected && <FontAwesome name="check" />} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
