import React, { useState } from "react";
import moment from "moment";
import { Connection } from "../../Connections/types";
import BarChart from "../BarChart";
import LineChart from "./LineChart";
import styles from "../ChartBlock.module.scss";

enum ChartType {
  LINE = "line",
  BAR = "bar",
}
enum Timeframe {
  M = "M",
  W = "W",
}

type ChartData = {
  id: number;
  name: string;
  value: number;
};

function weekOfMonth(date: moment.Moment) {
  let weekInYearIndex = date.week();
  if (date.year() !== date.weekYear()) {
    weekInYearIndex = date.clone().subtract(1, "week").week() + 1;
  }
  return weekInYearIndex - moment(date).startOf("month").week() + 1;
}
const dateFormat = "YYYY MM";

const TimelineChart = ({ connections }: { connections: Connection[] }) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.LINE);
  const [timeframeState, setTimeframe] = useState<Timeframe>(Timeframe.M);

  const dateNameFormat =
    timeframeState === Timeframe.M ? "MMM YYYY" : " [Week] MMM YYYY";
  const dataMap = connections.reduce(
    (map: Map<number, ChartData>, connection: Connection) => {
      const dateMoment = moment(connection.createdAt);
      let date, nameLabel;
      if (timeframeState === Timeframe.M) {
        date = dateMoment.format(dateFormat);
        nameLabel = dateMoment.format(dateNameFormat);
      } else {
        const weekNumber = weekOfMonth(dateMoment);
        date = `${dateMoment.format(dateFormat)} ${weekNumber}`;
        nameLabel = `#${weekNumber} ${dateMoment.format(dateNameFormat)}`;
      }
      const dateInt = parseInt(date.replace(/ /g, ""));
      const chartData = map.get(dateInt);
      if (chartData) {
        chartData.value += 1;
        map.set(dateInt, chartData);
      } else {
        map.set(dateInt, {
          id: dateInt,
          value: 1,
          name: nameLabel,
        });
      }
      return map;
    },
    new Map<number, ChartData>()
  );

  const data: ChartData[] = Array.from(dataMap.values());
  data.sort((a, b) => a.id - b.id);

  return (
    <>
      <div className={styles.fixed_controls}>
        <button
          onClick={() =>
            setTimeframe(
              timeframeState === Timeframe.M ? Timeframe.W : Timeframe.M
            )
          }
          className={styles.button_width}
        >
          {timeframeState}
        </button>

        <button
          className={styles.button_chart_type}
          onClick={() =>
            setChartType(
              chartType === ChartType.LINE ? ChartType.BAR : ChartType.LINE
            )
          }
        >
          <i className={`fas fa-chart-${chartType}`} />
        </button>
      </div>
      {chartType === ChartType.BAR ? (
        <BarChart data={data} selectedTags={new Map()} />
      ) : (
        <LineChart data={data} />
      )}
    </>
  );
};

export default TimelineChart;
