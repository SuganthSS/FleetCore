import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ShipmentChartProps {
  data: {
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
}

export const ShipmentChart: React.FC<ShipmentChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Pending', value: data.pending, color: '#f59e0b' }, // Amber
    { name: 'In Transit', value: data.inTransit, color: '#3b82f6' }, // Blue
    { name: 'Delivered', value: data.delivered, color: '#10b981' }, // Emerald
    { name: 'Cancelled', value: data.cancelled, color: '#ef4444' }, // Red
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <span className="text-xs text-muted-foreground">No shipment status data available</span>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={4}
          dataKey="value"
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}

          labelLine={false}
          style={{ fontSize: '9px', fontWeight: 'bold', fill: 'var(--foreground)' }}
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
export default ShipmentChart;
