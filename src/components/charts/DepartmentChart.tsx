"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DepartmentChartProps {
  data: { name: string; resolved: number; pending: number }[];
}

export default function DepartmentChart({ data }: DepartmentChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="name" 
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
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}
        />
        <Bar dataKey="resolved" name="Resolved" fill="#00d4aa" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
