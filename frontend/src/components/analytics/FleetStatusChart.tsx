import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FleetStatusChartProps {
  data: {
    active: number;
    inactive: number;
    maintenance: number;
  };
}

export const FleetStatusChart: React.FC<FleetStatusChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Active', value: data.active, color: '#3b82f6' }, // Blue
    { name: 'Inactive', value: data.inactive, color: '#64748b' }, // Slate
    { name: 'Maintenance', value: data.maintenance, color: '#f43f5e' }, // Rose
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <span className="text-xs text-muted-foreground">No vehicle status data available</span>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={0}
          outerRadius={75}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}

          labelLine={false}
          style={{ fontSize: '10px', fontWeight: 'bold', fill: 'var(--foreground)' }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'var(--foreground)',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={32}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default FleetStatusChart;
