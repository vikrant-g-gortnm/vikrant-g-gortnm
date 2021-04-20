import React, { useEffect, useState } from "react";
import { Button, Card } from "Components/elements";
import { useLazyQuery, useMutation } from "@apollo/client";
import { impactGoalsGet } from "private/Apollo/Queries";
import { impactGoalsPut } from "private/Apollo/Mutations";
import styles from "./Impact.module.css";
import images from "./img/";
import { omit } from "lodash";
import classnames from "classnames";

export function Impact({ connection, history, location }) {
  const [isLoading, setIsLoading] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [getImpactGoals, { data, called }] = useLazyQuery(impactGoalsGet);

  const [mutate] = useMutation(impactGoalsPut, {
    refetchQueries: [
      {
        query: impactGoalsGet,
        variables: { id: connection.id },
      },
    ],
  });

  useEffect(() => {
    if (connection && !called) {
      getImpactGoals({
        variables: { id: connection.id },
      });
    }
  }, [connection, called]);

  let impactGoals = data?.impactGoalsGet || {};

  async function setGoals(key) {
    setIsLoading({
      ...isLoading,
      [key]: true,
    });

    let pre = {
      input: {
        goals: [],
      },
    };

    if (impactGoals) {
      pre = {
        ...omit(impactGoals, "__typename", "goals"),
        input: {
          goals: impactGoals?.goals?.map(g => omit(g, "__typename")) || [],
        },
      };

      let hit = pre.input.goals.find(it => it.key === key.toString());

      if (hit) {
        pre.input.goals = pre.input.goals.filter(
          it => it.key !== key.toString()
        );
      } else {
        pre.input.goals.push({ key: key.toString(), val: key.toString() });
      }
    }

    let variables = {
      id: connection.id,
      ...pre,
    };

    let optimisticResponse = {
      __typename: "Mutation",
      impactGoalsPut: {
        __typename: "ImpactGoals",
        id: connection.id,
        goals:
          pre?.input?.goals?.map(g => ({ ...g, __typename: "KeyVal" })) || [],
      },
    };

    try {
      await mutate({
        variables,
        optimisticResponse,
      });
    } catch (error) {
      console.log("error", error);
    }

    setIsLoading({
      ...isLoading,
      [key]: false,
    });
  }

  return (
    <div>
      <Card label={"IMPACT GOALS"} noMargin={true}>
        <div
          style={{
            padding: "13px",
            paddingBottom: "5px",
          }}
        >
          {!isEditing && (
            <div className={styles.selector}>
              {data?.impactGoalsGet?.goals?.map(({ key }) => (
                <div
                  key={key}
                  className={classnames(
                    styles.selected_each,
                    styles.each_select
                  )}
                >
                  <img
                    src={images?.find(g => g.key === key.toString()).src}
                    alt="goal"
                  />
                </div>
              ))}
            </div>
          )}

          {!isEditing && !impactGoals?.goals?.length && (
            <div
              style={{
                color: "var(--color-gray-medium)",
                padding: "20px",
                paddingTop: "12px",
              }}
            >
              What sustainable development goals does this company meet?
            </div>
          )}

          {isEditing && (
            <div className={styles.selector}>
              {images.map(({ src, key }) => (
                <div
                  key={key}
                  className={classnames(
                    data?.impactGoalsGet?.goals?.some(
                      g => g.key === key.toString()
                    ) && styles.selected_each,
                    styles.each_select
                  )}
                  onClick={() => {
                    setGoals(key);
                  }}
                >
                  <img src={src} alt="goal" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div
        style={{
          marginTop: "0px",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: "-40px",
        }}
      >
        <span />
        <Button
          // type="right_arrow"
          size="small"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {!isEditing ? "Set goals" : "Close set goals"}
        </Button>
      </div>
    </div>
  );
}
