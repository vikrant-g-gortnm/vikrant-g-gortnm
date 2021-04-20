import React from "react";
import { Link } from "react-router-dom";
import { group as group_route } from "definitions";

// API stuff
import { useQuery } from "@apollo/client";
import { userGet } from "private/Apollo/Queries";

// Components
import { SetSubjectiveScore } from "Components/SetSubjectiveScore/SetSubjectiveScore";

// Styles
import styles from "./SubjectiveScore.module.css";

// ********************
// * Helper functions *
// ********************
function getOtherScores({ connection }) {
  let otherScores = [];
  // Connection object will ONLY have 'sharedWithMe' field IF queried by
  // `connectionGet` query (singular) and not on `connectionsGet` query (plural)
  if (connection.sharedWithMe) {
    for (let shared of connection.sharedWithMe) {
      if (shared.connection) {
        let arr = shared.connection.subjectiveScores || [];
        arr = arr.map(it => ({
          ...it,
          ref: {
            name: shared.groupName,
            id: shared.groupId,
          },
        }));
        otherScores = otherScores.concat(arr);
      }
    }
  }
  return otherScores;
}

function getAllScores({ subjectiveScores, otherScores }) {
  let allScores = subjectiveScores.concat(otherScores);

  // Make sure score has author
  allScores = allScores.filter(({ createdByUser }) => createdByUser);

  // Look for duplicates
  // The reason why you might get duplicates is if
  // someone shared their score with you through several groups.
  let dups = {};

  // Get filtered scores
  allScores = allScores.filter(s => {
    // If we've counted, stop
    if (dups[s.createdByUser.email]) {
      return false;
    }

    // Store that we've counted this persons subjective score
    dups[s.createdByUser.email] = true;

    // Return true
    return true;
  });

  return allScores;
}

// .. end helper functions

// LIST SUBJECTIVE SCORES FROM TEAM AND GROUPS
function ListSubjectiveScores({ connection, user, onlyMe }) {
  // subjectiveScores = me any my team
  let subjectiveScores = connection.subjectiveScores || [];

  // otherScores = scores shared with me through groups
  let otherScores = getOtherScores({ connection });

  // Get all scores combined
  let allScores = getAllScores({ subjectiveScores, otherScores });

  // Get average score
  let averageScore;
  if (allScores.length) {
    let { score: ttl } = allScores.reduce((a, b) => ({
      score: a.score + b.score,
    }));
    averageScore = (ttl / allScores.length).toFixed(1);
  }

  return (
    <div>
      {allScores.length > 1 && !onlyMe && (
        <>
          <div className={styles.subjective_score_average}>
            <div className={styles.subjective_score_name}>
              Average subjective score (of {allScores.length})
            </div>
            <div className={styles.subjective_score_val}>{averageScore}</div>
          </div>

          <div className={styles.subjective_score_each_container}>
            {allScores.map((ss, i) => (
              <div key={`ss-${i}`} className={styles.subjective_score_each}>
                <div className={styles.subjective_score_name}>
                  {ss.createdByUser.given_name} {ss.createdByUser.family_name}
                  {ss.createdBy === user.cognitoIdentityId && (
                    <span style={{ opacity: 0.4 }}> (you)</span>
                  )}
                  {ss.ref && (
                    <div className={styles.from_group}>
                      From group:{" "}
                      <Link
                        to={{
                          pathname: `${group_route}/${ss.ref.id}`,
                        }}
                      >
                        {ss.ref.name}
                      </Link>
                    </div>
                  )}
                </div>
                <div className={styles.subjective_score_val}>{ss.score}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Subjective score summaries + set subjective score
export function SubjectiveScore({ connection, onlyMe }) {
  // Query user data
  let userQuery = useQuery(userGet);
  let user = userQuery?.data?.userGet;

  return (
    <div>
      <ListSubjectiveScores
        connection={connection}
        user={user}
        onlyMe={onlyMe}
      />

      <SetSubjectiveScore connection={connection} user={user} />
    </div>
  );
}
