import React from "react";
import {
  LineChart as Chart,
  Line,
  YAxis,
  Tooltip,
  XAxis,
  ResponsiveContainer,
} from "recharts";

const LineChart = ({ data }: { data: object[] }) => (
  <div style={{ width: "100%", height: 300 }}>
    <ResponsiveContainer>
      <Chart width={600} height={200} data={data}>
        <Line
          dataKey="value"
          type="monotone"
          dot={false}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Tooltip />
        <XAxis dataKey="name" />
        <YAxis />
      </Chart>
    </ResponsiveContainer>
  </div>
);

export default LineChart;
