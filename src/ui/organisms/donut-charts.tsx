import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: ChartData<'doughnut'>;
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  console.log(data, 'data');

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    layout: {
      padding: {
        right: 20,
      },
    },
    cutout: '70%',
  };

  return <Doughnut data={data} options={options} width={400} height={400} />;
};

export default DonutChart;
