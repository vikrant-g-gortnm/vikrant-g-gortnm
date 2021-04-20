import React, { useState } from "react";
import classnames from "classnames";
import styles from "./EvaluationBox.module.css";
import { Button } from "Components/elements";

export default function SummaryLine({
  name,
  percentageScore,
  className,
  list,
  hide,
  toggleHide,
  evaluationId,
  timeStamp,
  isYou,
  editLink,
  summaryLink,
  history,
}) {
  let [showList, setShowList] = useState(false);

  return (
    <div>
      <div
        className={classnames(
          styles.line_style,
          className && className,
          evaluationId && hide && hide[evaluationId] && styles.hide_line
        )}
      >
        <div className={classnames(styles.name_style, styles.title_container)}>
          {list && (
            <div
              className={styles.caret_button}
              onClick={() => setShowList(!showList)}
            >
              {(showList && <i className="fas fa-caret-down" />) || (
                <i className="fas fa-caret-right" />
              )}
            </div>
          )}

          <span
            onClick={() => {
              summaryLink && history.push(summaryLink);
            }}
          >
            {isYou ? (
              <span className={styles.isYou}>{name} (you)</span>
            ) : (
              <span>{name}</span>
            )}
          </span>
        </div>

        <div className={styles.score_container}>
          <div className={styles.edit_container}>
            {(isYou && editLink && (
              <Button
                style={{ margin: "0px" }}
                size="small"
                type="just_text"
                onClick={() => {
                  history.push(editLink);
                }}
              >
                edit
              </Button>
            )) || <span />}
          </div>

          {(evaluationId && toggleHide && (
            <div
              className={styles.eye_toggle}
              onClick={() => {
                toggleHide(evaluationId);
              }}
            >
              {hide &&
                (hide[evaluationId] ? (
                  <i className="fal fa-eye-slash" />
                ) : (
                  <i className="fal fa-eye" />
                ))}
            </div>
          )) || <span />}

          {(timeStamp && (
            <div className={styles.timeStamp}>{timeStamp}</div>
          )) || <span />}

          <div className={styles.score_style}>{percentageScore}%</div>
        </div>
      </div>

      {showList && list && (
        <div className={styles.expanded_list_container}>
          {list.map((item, i) => (
            <SummaryLine
              key={i}
              hide={hide}
              evaluationId={evaluationId}
              name={item.name}
              percentageScore={item.percentageScore}
              className={classnames(className, styles.sub_list)}
              history={history}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// import React, { useState } from "react";
// import classnames from "classnames";
// import styles from "./EvaluationBox.module.css";
// import { Button } from "Components/elements";
//
// export default function SummaryLine({
//   name,
//   percentageScore,
//   score,
//   possibleScore,
//   className,
//   list,
//   hide,
//   toggleHide,
//   evaluationId,
//   timeStamp,
//   isYou,
//   editLink,
//   history,
//   numberScore,
//   iteration,
// }) {
//   iteration = iteration || 0;
//
//   let [showList, setShowList] = useState(false);
//   const [viewPercentage, setViewPercentage] = useState(!numberScore);
//
//   return (
//     <div style={{ paddingLeft: iteration * 5 + "px" }}>
//       <div
//         className={classnames(
//           styles.line_style,
//           className && className,
//           evaluationId && hide && hide[evaluationId] && styles.hide_line
//         )}
//       >
//         <div className={classnames(styles.name_style, styles.title_container)}>
//           {list && (
//             <div
//               className={styles.caret_button}
//               onClick={() => setShowList(!showList)}
//             >
//               {(showList && <i className="fas fa-caret-down" />) || (
//                 <i className="fas fa-caret-right" />
//               )}
//             </div>
//           )}
//           {isYou ? (
//             <span className={styles.isYou}>{name} (you)</span>
//           ) : (
//             <span>{name}</span>
//           )}
//         </div>
//
//         <div className={styles.score_container}>
//           <div className={styles.edit_container}>
//             {(isYou && editLink && history && (
//               <Button
//                 style={{ margin: "0px" }}
//                 size="small"
//                 type="just_text"
//                 onClick={() => {
//                   history.push(editLink);
//                 }}
//               >
//                 edit
//               </Button>
//             )) || <span />}
//           </div>
//
//           {(evaluationId && toggleHide && (
//             <div
//               className={styles.eye_toggle}
//               onClick={() => {
//                 toggleHide(evaluationId);
//               }}
//             >
//               {hide &&
//                 (hide[evaluationId] ? (
//                   <i className="fal fa-eye-slash" />
//                 ) : (
//                   <i className="fal fa-eye" />
//                 ))}
//             </div>
//           )) || <span />}
//
//           {(timeStamp && (
//             <div className={styles.timeStamp}>{timeStamp}</div>
//           )) || <span />}
//
//           {viewPercentage && (
//             <div
//               className={styles.score_style}
//               onClick={() => setViewPercentage(false)}
//             >
//               {percentageScore || 0}%
//             </div>
//           )}
//
//           {!viewPercentage && (
//             <div
//               className={styles.score_style}
//               onClick={() => setViewPercentage(true)}
//             >
//               {score}/{possibleScore}
//             </div>
//           )}
//         </div>
//       </div>
//
//       {showList && list && (
//         <div className={styles.expanded_list_container}>
//           {list
//             .sort((a, b) => {
//               if (a.name < b.name) {
//                 return -1;
//               }
//               if (a.name > b.name) {
//                 return 1;
//               }
//               return 0;
//             })
//             .map((item, i) => {
//               let innerList = (item.scorePerAnswer || []).map(it => {
//                 let res = {
//                   name: it.question,
//                   percentageScore: Math.round(
//                     (it.score / it.possibleScore) * 100
//                   ),
//                   score: it.score,
//                   possibleScore: it.possibleScore,
//                   numberScore: true,
//                 };
//                 return res;
//               });
//
//               return (
//                 <>
//                   <SummaryLine
//                     key={iteration + i}
//                     iteration={iteration + 1}
//                     hide={hide}
//                     evaluationId={evaluationId}
//                     name={item.name}
//                     percentageScore={item.percentageScore}
//                     score={item.score}
//                     possibleScore={item.possibleScore}
//                     className={classnames(className, styles.sub_list)}
//                     list={!!innerList.length && innerList}
//                     numberScore={item.numberScore}
//                     history={history}
//                   />
//                 </>
//               );
//             })}
//         </div>
//       )}
//     </div>
//   );
// }
