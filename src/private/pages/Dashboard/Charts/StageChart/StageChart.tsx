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

type IndexedChartData = ChartData & { index: number };

const StageChart = ({ connections }: { connections: Connection[] }) => {
  const dataMap = connections.reduce(
    (map: Map<string, IndexedChartData>, connection: Connection) => {
      connection.funnelTags.forEach(funnelTag => {
        const chartData = map.get(funnelTag.id);
        if (chartData) {
          chartData.value += 1;
        } else {
          map.set(funnelTag.id, {
            id: funnelTag.id,
            value: 1,
            name: funnelTag.name,
            index: funnelTag.index,
          });
        }
      });
      return map;
    },
    new Map<string, IndexedChartData>()
  );

  const data = Array.from(dataMap.values());
  data.sort((a, b) => a.index - b.index);

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

export default StageChart;
