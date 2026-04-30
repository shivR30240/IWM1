"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
  data: { date: string; created: number; resolved: number }[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 11, fill: '#a1a1aa' }} 
          axisLine={{ stroke: '#27272a' }}
          tickLine={{ stroke: '#27272a' }}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#a1a1aa' }} 
          axisLine={{ stroke: '#27272a' }}
          tickLine={{ stroke: '#27272a' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #27272a',
            borderRadius: '12px',
            color: '#fafafa',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#a1a1aa' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
        />
        <Line type="monotone" dataKey="created" name="New" stroke="#ef4444" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#00d4aa" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
