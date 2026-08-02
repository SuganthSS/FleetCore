import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


interface MaintenanceChartProps {
  data: {
    scheduled: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export const MaintenanceChart: React.FC<MaintenanceChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Scheduled', count: data.scheduled, color: '#3b82f6' }, // Blue
    { name: 'In Progress', count: data.inProgress, color: '#f59e0b' }, // Amber
    { name: 'Completed', count: data.completed, color: '#10b981' }, // Emerald
    { name: 'Overdue', count: data.overdue, color: '#ef4444' }, // Red
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
        <XAxis
          type="number"
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          allowDecimals={false}
          style={{ fontWeight: 'bold' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={10}
          tickLine={false}
          style={{ fontWeight: 'bold' }}
          width={70}
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
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default MaintenanceChart;
