import * as React from "react";
import { XAxis, BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import { ChartData, Connection } from "../../Connections/types";
import { CHART_COLORS } from "../ChartArea";

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fontSize={14}
        fill="#666"
        transform="rotate(0)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const ScoresChart = ({ connections }: { connections: Connection[] }) => {
  const arrKar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => [
    value,
    {
      id: value.toString(),
      value: 0,
      name: value.toString(),
    },
  ]);

  const dataMap = connections.reduce(
    (map: Map<number, ChartData>, connection: Connection) => {
      connection.subjectiveScores?.forEach(score => {
        const chartData = map.get(score.score);
        if (chartData) {
          chartData.value += 1;
          map.set(score.score, chartData);
        } else {
          map.set(score.score, {
            id: score.score.toString(),
            value: 1,
            name: score.score.toString(),
          });
        }
      });
      return map;
    },
    new Map<number, ChartData>(arrKar as any)
  );

  const data = Array.from(dataMap.values());
  data.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart width={600} height={200} margin={{ top: 20 }} data={data}>
          <Bar
            dataKey="value"
            label={{
              value: "name",
              position: "top",
              fontWeight: "normal",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index]}
                stroke={CHART_COLORS[index]}
              />
            ))}
          </Bar>
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={<CustomizedAxisTick />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoresChart;
