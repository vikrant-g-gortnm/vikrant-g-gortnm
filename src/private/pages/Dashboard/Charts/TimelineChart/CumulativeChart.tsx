import React from "react";
import moment from "moment";
import { Connection } from "../../Connections/types";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  id: number;
  name: string;
  value: number;
  total?: number;
};

const dateFormat = "YYYY MM";

const CumulativeChart = ({ connections }: { connections: Connection[] }) => {
  const dateNameFormat = "MMM YYYY";
  const dataMap = connections.reduce(
    (map: Map<number, ChartData>, connection: Connection) => {
      const dateMoment = moment(connection.createdAt);
      let date, nameLabel;
      date = dateMoment.format(dateFormat);
      nameLabel = dateMoment.format(dateNameFormat);

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

  if (data.length <= 1) return <span/>


  data.reduce((prevValue, curValue) => {
    if (prevValue?.total) curValue.total = prevValue.total + curValue.value;
    else {
      prevValue.total = prevValue.value;
      curValue.total = prevValue.value + curValue.value;
    }
    return curValue;
  });

  return (
    <div style={{ width: "100%", height: 300, marginTop: "28px" }}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#413ea0" />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#ff7300"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeChart;
