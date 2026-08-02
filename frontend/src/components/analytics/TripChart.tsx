import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


interface TripChartProps {
  data: {
    planned: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

export const TripChart: React.FC<TripChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Planned', count: data.planned, color: '#a855f7' }, // Purple
    { name: 'Active', count: data.active, color: '#3b82f6' }, // Blue
    { name: 'Completed', count: data.completed, color: '#10b981' }, // Emerald
    { name: 'Cancelled', count: data.cancelled, color: '#f43f5e' }, // Rose
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          style={{ fontWeight: 'bold' }}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          allowDecimals={false}
          style={{ fontWeight: 'bold' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'var(--foreground)',
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default TripChart;
